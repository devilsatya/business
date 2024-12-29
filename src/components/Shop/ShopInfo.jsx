import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { server } from "../../server";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import ShopProfileData from './ShopProfileData.jsx';

const ShopInfo = ({ isOwner }) => {
  const [data, setData] = useState({});
  const { products } = useSelector((state) => state.products);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to control sidebar visibility
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    setIsLoading(true);
    axios
      .get(`${server}/shop/get-shop-info/${id}`)
      .then((res) => {
        setData(res.data.shop);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [id, dispatch]);

  const logoutHandler = async () => {
    axios.get(`${server}/shop/logout`, {
      withCredentials: true,
    });
    window.location.reload();
  };

  const totalReviewsLength =
    products && products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const averageRating = totalRatings / totalReviewsLength || 0;

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex">
          {/* Sidebar */}
          <div
            className={`fixed z-40 bg-white shadow-md h-full transition-transform duration-300 lg:static lg:w-1/4 ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:block`} // Updated lg:block to make it visible by default
          >
            <div className="p-5">
              <div className="w-full flex items-center justify-center mb-4">
                <img
                  src={`${data.avatar?.url}`}
                  alt=""
                  className="w-[100px] h-[100px] object-cover rounded-full"
                />
              </div>
              <h3 className="text-center py-2 text-[20px]">{data.name}</h3>
              <p className="text-[16px] text-[#000000a6] p-[10px] flex items-center">
                {data.description}
              </p>
              <div className="p-3">
                <h5 className="font-[600]">Address</h5>
                <h4 className="text-[#000000a6]">{data.address}</h4>
              </div>
              <div className="p-3">
                <h5 className="font-[600]">Phone Number</h5>
                <h4 className="text-[#000000a6]">{data.phoneNumber}</h4>
              </div>
              <div className="p-3">
                <h5 className="font-[600]">Total Products</h5>
                <h4 className="text-[#000000a6]">{products && products.length}</h4>
              </div>
              <div className="p-3">
                <h5 className="font-[600]">Shop Ratings</h5>
                <h4 className="text-[#000000b0]">{averageRating}/5</h4>
              </div>
              <div className="p-3">
                <h5 className="font-[600]">Joined On</h5>
                <h4 className="text-[#000000b0]">{data?.createdAt?.slice(0, 10)}</h4>
              </div>
              {isOwner && (
                <div className="py-3 px-4">
                  <Link to="/settings">
                    <div
                      className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
                    >
                      <span className="text-white">Edit Shop</span>
                    </div>
                  </Link>
                  <div
                    className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
                    onClick={logoutHandler}
                  >
                    <span className="text-white">Log Out</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 lg:ml-1/4">
            {/* Toggle Button for Sidebar (visible only on smaller screens) */}
            <button
              className="lg:hidden fixed top-4 left-4 bg-teal-500 text-white px-3 py-2 rounded-md shadow-md z-50"
              onClick={toggleSidebar}
            >
              {isSidebarOpen ? "Close" : "Menu"}
            </button>
            <ShopProfileData />
          </div>
        </div>
      )}
    </>
  );
};

export default ShopInfo;
