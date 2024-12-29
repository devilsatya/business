import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";
import Ratings from "../Products/Ratings";
import { getAllEventsShop } from "../../redux/actions/event";

const ShopProfileData = ({ isOwner }) => {
  const { products } = useSelector((state) => state.products);
  const { events } = useSelector((state) => state.events);
  const { id } = useParams();
  const dispatch = useDispatch();

  const [active, setActive] = useState(1);

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    dispatch(getAllEventsShop(id));
  }, [dispatch, id]);

  const allReviews =
    products && products.map((product) => product.reviews).flat();

  return (
    <div className="flex-1 lg:ml-1/4 p-5">
      {/* Header Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex space-x-6 mb-4 md:mb-0">
          <button
            className={`font-[600] text-[20px] ${
              active === 1 ? "text-red-500" : "text-[#333]"
            } cursor-pointer`}
            onClick={() => setActive(1)}
          >
            Shop Products
          </button>
          <button
            className={`font-[600] text-[20px] ${
              active === 2 ? "text-red-500" : "text-[#333]"
            } cursor-pointer`}
            onClick={() => setActive(2)}
          >
            Running Events
          </button>
          <button
            className={`font-[600] text-[20px] ${
              active === 3 ? "text-red-500" : "text-[#333]"
            } cursor-pointer`}
            onClick={() => setActive(3)}
          >
            Shop Reviews
          </button>
        </div>
        {isOwner && (
          <Link to="/dashboard">
            <div className={`${styles.button} rounded-md h-[42px]`}>
              <span className="text-white">Go Dashboard</span>
            </div>
          </Link>
        )}
      </div>

      <br />
      {/* Content Sections */}
      {active === 1 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
          {products &&
            products.map((product, index) => (
              <ProductCard data={product} key={index} isShop />
            ))}
          {products && products.length === 0 && (
            <h5 className="text-center text-[18px] w-full py-5">
              No Products available for this shop!
            </h5>
          )}
        </div>
      )}

      {active === 2 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
          {events &&
            events.map((event, index) => (
              <ProductCard
                data={event}
                key={index}
                isShop
                isEvent
              />
            ))}
          {events && events.length === 0 && (
            <h5 className="text-center text-[18px] w-full py-5">
              No Events available for this shop!
            </h5>
          )}
        </div>
      )}

      {active === 3 && (
        <div>
          {allReviews &&
            allReviews.map((review, index) => (
              <div key={index} className="flex my-4 items-start">
                <img
                  src={review.user.avatar?.url}
                  alt=""
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
            <h5 className="text-center text-[18px] w-full py-5">
              No Reviews available for this shop!
            </h5>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopProfileData;
