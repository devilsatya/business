import React from "react";
import styles from "../../styles/styles";
import CountDown from "./CountDown";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const capitalizeWords = (str) => {
    if (!str) return '';
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const addToCartHandler = (data) => {
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  return (
    <div
      className={`w-full block bg-white rounded-lg ${
        active ? "unset" : "mb-12"
      } lg:flex p-4`}
    >
      {/* Product Image */}
      <div className="w-full lg:w-1/2 flex justify-center items-center">
        <img
          src={`${data.images[0]?.url}`}
          alt={data.name}
          className="w-auto h-auto sm:h-[300px] md:h-[350px] lg:h-[400px] object-fit rounded-lg"
        />
      </div>

      {/* Product Details */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 mt-4 lg:mt-0">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">
       { capitalizeWords(data.name)}
        </h2>
        <p className="text-gray-600 text-sm md:text-base mt-2">
        {capitalizeWords(data.description)}
        </p>
        <div className="flex py-2 justify-between items-center">
          <div className="flex items-center">
            <h5 className="font-[500] text-[16px] md:text-[18px] text-[#d55b45] pr-3 line-through">
              ₹{data.originalPrice}
            </h5>
            <h5 className="font-bold text-[18px] md:text-[20px] text-[#333]">
              ₹{data.discountPrice}
            </h5>
          </div>
          <span className="text-[15px] md:text-[17px] text-[#44a55e]">
            {data.sold_out} sold
          </span>
        </div>
        <CountDown data={data} />
        <div className="flex items-center mt-4 space-x-4">
          <Link to={`/product/${data._id}?isEvent=true`}>
            <button
              className={`${styles.button} text-white py-2 px-4`}
            >
              See Details
            </button>
          </Link>
          <button
            className={`${styles.button} text-white py-2 px-4`}
            onClick={() => addToCartHandler(data)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
