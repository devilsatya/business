import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { getAllEventsShop } from "../../redux/actions/event";
import ProductCard from '../../components/Route/ProductCard/ProductCard'
import Ratings from "../../components/Products/Ratings"
import { server } from "../../server";
import styles from "../../styles/styles";
import Loader from "../../components/Layout/Loader";

const ShopHomePage = ({ isOwner }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { events } = useSelector((state) => state.events);

  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(1); // To track the active tab
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to control sidebar visibility

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    dispatch(getAllEventsShop(id));
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
  }, [dispatch, id]);

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

  const logoutHandler = async () => {
    axios.get(`${server}/shop/logout`, { withCredentials: true });
    window.location.reload();
  };

  // Flatten all reviews from products
  const allReviews = products && products.map((product) => product.reviews).flat();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex">
          {/* Sidebar */}
          <div
            className={`${
              // Sidebar will be hidden for small screens (under 800px) and shown on larger screens
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 fixed lg:static z-40 bg-white shadow-md h-full transition-transform duration-300 lg:w-1/4`}
          >
            <div className="p-5">
              <div className="w-full flex items-center justify-center mb-4">
                <img
                  src={data.avatar?.url}
                  alt="Shop Avatar"
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
              {true && (
                <div className="py-3 px-4">
                  <Link to="/settings">
                    <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}>
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

          {/* Main Content */}
          <div className="flex-1 lg:ml-1/4">
            {/* Toggle Button for Sidebar (visible only on smaller screens) */}
           {/* Toggle Button for Sidebar (visible only on smaller screens) */}
<div className="lg:hidden mt-4 ml-4 lg:mt-0 lg:ml-0">
  <button
    className="bg-teal-500 text-white relative px-3 py-2 rounded-md shadow-md z-50"
    onClick={toggleSidebar}
  >
    {isSidebarOpen ? "Close" : "Menu"}
  </button>
</div>


            {/* Tabs for Products, Events, and Reviews */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div className="flex space-x-6 mb-4 md:mb-0">
                <button
                  className={`font-[600] text-[20px] ${activeTab === 1 ? "text-red-500" : "text-[#333]"}`}
                  onClick={() => setActiveTab(1)}
                >
                  Shop Products
                </button>
                <button
                  className={`font-[600] text-[20px] ${activeTab === 2 ? "text-red-500" : "text-[#333]"}`}
                  onClick={() => setActiveTab(2)}
                >
                  Running Events
                </button>
                <button
                  className={`font-[600] text-[20px] ${activeTab === 3 ? "text-red-500" : "text-[#333]"}`}
                  onClick={() => setActiveTab(3)}
                >
                  Shop Reviews
                </button>
              </div>
            </div>

            {/* Content for Each Tab */}
            {activeTab === 1 && (
                <div className="grid grid-cols-2 gap-[20px] sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mb-12 border-0">
          {products &&
                  products.map((product, index) => <ProductCard data={product} key={index} isShop />)}
                {products && products.length === 0 && (
                  <h5 className="text-center text-[18px] w-full py-5">No Products available for this shop!</h5>
                )}
              </div>
            )}

            {activeTab === 2 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
                {events &&
                  events.map((event, index) => <ProductCard data={event} key={index} isShop isEvent />)}
                {events && events.length === 0 && (
                  <h5 className="text-center text-[18px] w-full py-5">No Events available for this shop!</h5>
                )}
              </div>
            )}

            {activeTab === 3 && (
              <div>
                {allReviews &&
                  allReviews.map((review, index) => (
                    <div key={index} className="flex my-4 items-start">
                      <img
                        src={review.user.avatar?.url}
                        alt="User Avatar"
                        className="w-[50px] h-[50px] rounded-full"
                      />
                      <div className="ml-3">
                        <div className="flex items-center">
                          <h1 className="font-[600] pr-2">{review.user.name}</h1>
                          <Ratings rating={review.rating} />
                        </div>
                        <p className="text-[#000000a7]">{review.comment}</p>
                        <p className="text-[#000000a7] text-[14px]">2 days ago</p>
                      </div>
                    </div>
                  ))}
                {allReviews && allReviews.length === 0 && (
                  <h5 className="text-center text-[18px] w-full py-5">No Reviews available for this shop!</h5>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ShopHomePage;
