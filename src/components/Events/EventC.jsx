import React from "react";
import styles from "../../styles/styles"; // Ensure styles are imported correctly
import CountDown from "./CountDown";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const EventC = ({ active, data }) => {
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
      className={`w-full h-auto bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 ${
        active ? "unset" : "mb-12"
      } flex flex-col lg:flex-row p-6 relative overflow-hidden`}
    >
      {/* Event Badge */}
      <div className="absolute top-4 left-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-sm font-bold py-2 px-6 rounded-full shadow-lg transform transition-all duration-300 z-10">
        New Event
      </div>

      {/* Product Image */}
      <div className="w-full h-auto flex justify-center items-center overflow-hidden mb-4 lg:mb-0 lg:w-1/2 relative">
        <Link to={`/product/${data._id}?isEvent=true`}>
          <img
            src={data.images[0]?.url || "/placeholder-image.jpg"} // Fallback for missing image
            alt={data.name}
            className="w-full h-auto object-cover rounded-lg shadow-2xl transform transition-all duration-500 hover:scale-110"
          />
        </Link>
      </div>

      {/* Product Details */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between px-6 py-4 mt-4 lg:mt-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 hover:text-indigo-600 transition-all duration-300">
       { capitalizeWords(data.name)}
        </h2>

        {/* Event Description */}
        <p className="text-gray-600 text-sm sm:text-base mt-2 mb-4 font-medium">
          Limited-time event. Get the best deals now!
        </p>

        {/* Countdown Timer */}
        <div className="mt-4">
          <CountDown data={data} />
        </div>

        {/* Action Buttons (optional) */}
      </div>
    </div>
  );
};

export default EventC;
