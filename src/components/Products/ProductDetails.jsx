import React, { useEffect, useState } from "react";
import { AiOutlineShoppingCart, AiOutlineMessage, AiOutlineShareAlt } from "react-icons/ai";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import axios from "axios";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
  PinterestIcon,
} from "react-share";
import styles from "../../styles/styles";
import { server } from "../../server";

const ProductDetails = ({ data }) => {
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [count, setCount] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(data?.shop?._id));
  }, [data, dispatch]);
  const capitalizeWords = (str) => {
    if (!str) return '';
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
 // Detect mobile/tablet devices
 useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  checkMobile();
  window.addEventListener("resize", checkMobile);
  return () => window.removeEventListener("resize", checkMobile);
}, []);

 // Handle next and previous slide via swipe (touch event for mobile/tablets)
 const handleTouchStart = (e) => {
  const touchStart = e.touches[0].clientX;
  const handleTouchMove = (e) => {
    const touchEnd = e.touches[0].clientX;
    if (touchStart - touchEnd > 50 && currentSlide < data.images.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else if (touchStart - touchEnd < -50 && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Attach touchmove event listener
  e.target.addEventListener("touchmove", handleTouchMove);
  // Remove touchmove event listener when touch ends
  e.target.addEventListener("touchend", () => {
    e.target.removeEventListener("touchmove", handleTouchMove);
  });
};

// Handle arrows for desktop (for navigation)
const nextSlide = () => {
  if (currentSlide < data.images.length - 1) {
    setCurrentSlide(currentSlide + 1);
  }
};

const prevSlide = () => {
  if (currentSlide > 0) {
    setCurrentSlide(currentSlide - 1);
  }
};

  useEffect(() => {
    if (selectedColor && data?.category !== "Saree") {
      const selectedVariation = data?.variations?.find((variation) =>
        variation.colors.some((color) => color.color === selectedColor)
      );

      if (selectedVariation) {
        const selectedColorData = selectedVariation.colors.find(
          (color) => color.color === selectedColor
        );
        const sizes = [
          { size: "XS", stock: selectedColorData.stockXS },
          { size: "S", stock: selectedColorData.stockS },
          { size: "M", stock: selectedColorData.stockM },
          { size: "L", stock: selectedColorData.stockL },
          { size: "XL", stock: selectedColorData.stockXL },
          { size: "XXL", stock: selectedColorData.stockXXL },
        ];

        const availableSizes = sizes.filter((size) => size.stock > 0);
        setAvailableSizes(availableSizes);
        setSelectedSize(availableSizes.length ? availableSizes[0].size : null);
      }
    }
  }, [selectedColor, data]);

  const addToCartHandler = (id) => {
    if (!selectedColor) {
      toast.error("Please select color!");
      return;
    }

    if (data?.category !== "Saree" && !selectedSize) {
      toast.error("Please select size!");
      return;
    }

    const isItemExists = cart?.find(
      (i) => i._id === id && i.color === selectedColor && i.size === selectedSize
    );

    if (isItemExists) {
      toast.error("Item with the same color and size already in cart!");
      return;
    }

    const isSameColorDifferentSize = cart?.find(
      (i) => i._id === id && i.color === selectedColor && i.size !== selectedSize
    );

    if (isSameColorDifferentSize || !isItemExists) {
      const cartData = { ...data, qty: count, color: selectedColor, size: selectedSize };
      dispatch(addTocart(cartData));
      toast.success("Item added to cart successfully!");
    }
  };

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.shop._id;

      await axios
        .post(`${server}/conversation/create-new-conversation`, { groupTitle, userId, sellerId })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Please login to create a conversation");
    }
  };

  const toggleShareOptions = () => setShowShareOptions(!showShareOptions);

  return (
    <div className="bg-white py-8">
      {data ? (
        <div className={`${styles.section} w-[95%] mx-auto sm:w-[90%]`}>
         <div className="flex flex-col lg:flex-row">
              {/* Product Image Slider Section */}
              <div
                className="w-full lg:w-1/2 relative"
                onTouchStart={isMobile ? handleTouchStart : null} // Touch event for mobile/tablets only
              >
                <div className="w-full h-[400px] bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={`${data && data.images[currentSlide]?.url}`}
                    alt="Product"
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                </div>

                {/* Image Dots Indicator */}
                <div className="flex justify-center mt-4 space-x-2">
                  {data.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        currentSlide === index ? "bg-teal-500" : "bg-gray-300"
                      }`}
                    ></div>
                  ))}
                </div>

                {/* Arrows for desktop */}
                {!isMobile && (
                  <>
                    <button
                      className="absolute top-1/2 left-0 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
                      onClick={prevSlide}
                    >
                      &#60;
                    </button>
                    <button
                      className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
                      onClick={nextSlide}
                    >
                      &#62;
                    </button>
                  </>
                )}
              </div>


           {/* Product Details Section */}
           <div className="w-full lg:w-1/2 lg:pl-8 mt-5 lg:mt-0">
                <h1 className="text-xl lg:text-2xl font-bold">{capitalizeWords(data.name)}</h1>
                <p className="mt-2 text-gray-700">{capitalizeWords(data.description)}</p>
                <div className="flex items-center mt-4">
                  <h4 className="text-2xl font-bold text-teal-600">₹{data.discountPrice}</h4>
                  {data.originalPrice && (
                    <h3 className="ml-4 text-lg line-through text-gray-500">₹{data.originalPrice}</h3>
                  )}
                </div>
              {/* Color Selection */}
              <div className="mt-4">
                <h3 className="font-semibold text-base sm:text-lg">Select Color</h3>
                <div className="flex gap-3 mt-2 flex-wrap">
                  {data?.variations?.map((variation) =>
                    variation.colors.map((color) => (
                      <button
                        key={color.color}
                        onClick={() => setSelectedColor(color.color)}
                        className={`${
                          selectedColor === color.color ? "bg-teal-500 text-white" : "bg-gray-200"
                        } px-3 sm:px-5 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-colors duration-300 hover:bg-teal-400`}
                      >
                        {color.color} ({color.totalStock})
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Size Selection */}
              {data.subcategory !== "Saree" && selectedColor && (
                <div className="mt-4">
                  <h3 className="font-semibold text-base sm:text-lg">Select Size</h3>
                  <div className="flex gap-3 mt-2 flex-wrap">
                    {availableSizes.length > 0 ? (
                      availableSizes.map((size) => (
                        <button
                          key={size.size}
                          onClick={() => setSelectedSize(size.size)}
                          className={`${
                            selectedSize === size.size
                              ? "bg-teal-500 text-white"
                              : "bg-gray-200"
                          } px-3 sm:px-5 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-colors duration-300 hover:bg-teal-400`}
                        >
                          {size.size} ({size.stock})
                        </button>
                      ))
                    ) : (
                      <p className="text-gray-500">No sizes available for this color.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4 gap-4 sm:gap-0">
                <div
                  className="flex items-center justify-center px-4 py-3 bg-teal-600 text-white rounded-lg cursor-pointer transition-all duration-300 hover:bg-teal-700"
                  onClick={() => addToCartHandler(data._id)}
                >
                  <AiOutlineShoppingCart className="mr-2 text-lg sm:text-xl" />
                  <span className="text-sm sm:text-lg">Add to Cart</span>
                </div>
                <div
                  className="flex items-center justify-center px-4 py-3 bg-teal-600 text-white rounded-lg cursor-pointer transition-all duration-300 hover:bg-teal-700"
                  onClick={handleMessageSubmit}
                >
                  <AiOutlineMessage className="mr-2 text-lg sm:text-xl" />
                  <span className="text-sm sm:text-lg">Message Seller</span>
                </div>
                <div
                  className="flex items-center justify-center px-4 py-3 bg-teal-600 text-white rounded-lg cursor-pointer transition-all duration-300 hover:bg-teal-700"
                  onClick={toggleShareOptions}
                >
                  <AiOutlineShareAlt className="mr-2 text-lg sm:text-xl" />
                  <span className="text-sm sm:text-lg">Share</span>
                </div>
              </div>

              {/* Share Options */}
              {showShareOptions && (
                <div className="mt-4 flex gap-3 flex-wrap">
                  <FacebookShareButton url={window.location.href} quote={data.name}>
                    <FacebookIcon size={35} round />
                  </FacebookShareButton>
                  <TwitterShareButton url={window.location.href}>
                    <TwitterIcon size={35} round />
                  </TwitterShareButton>
                  <WhatsappShareButton url={window.location.href}>
                    <WhatsappIcon size={35} round />
                  </WhatsappShareButton>
                  <LinkedinShareButton url={window.location.href}>
                    <LinkedinIcon size={35} round />
                  </LinkedinShareButton>
                  <PinterestShareButton url={window.location.href} media={data.images[0]?.url}>
                    <PinterestIcon size={35} round />
                  </PinterestShareButton>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">Product not found.</p>
      )}
    </div>
  );
};

export default ProductDetails;
