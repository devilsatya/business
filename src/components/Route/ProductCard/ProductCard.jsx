

// ProductCard Component
import React, { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import { addToWishlist, removeFromWishlist } from "../../../redux/actions/wishlist";
import { addTocart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "../../Products/Ratings";

const ProductCard = ({ data, isEvent }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const capitalizeWords = (str) => {
    if (!str) return '';
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stockS < 1 && data.stockM < 1 && data.stockL < 1 && data.stockXL < 1 && data.stockXXL < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  return (
    <div className="w-full sm:w-[220px] md:w-[260px] lg:w-[230px] xl:w-[230px] h-auto bg-white rounded-lg shadow-lg sm:p-3 relative cursor-pointer mb-6">
      {/* <div className="flex justify-end"></div> */}
      <Link to={`${isEvent ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}>
        <img
          src={data.images && data.images[0]?.url}
          alt="product"
          className="w-full h-[180px] sm:h-[220px] object-fit rounded-lg mb-3"
        />
      </Link>
      <Link to={`/shop/preview/${data?.shop._id}`}>
        <h5 className={`${styles.shop_name} px-2 py-1 text-sm text-gray-600 font-semibold mb-1`}>
          {data.shop.name}
        </h5>
      </Link>
      <Link to={`${isEvent ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}>
        <h4 className="pb-3 px-2 py-1 font-[500] text-base">
          {data.name.length > 40 ? capitalizeWords(data.name.slice(0, 40)) + "..." : capitalizeWords(data.name)}
        </h4>
      
        <div className="py-2 px-2 flex items-center justify-between">
          <div className="flex">
            <h5 className={`${styles.productDiscountPrice} text-lg font-semibold`}>
              ₹{data.originalPrice === 0 ? data.originalPrice : data.discountPrice}
            </h5>
            <h4 className={`${styles.price} text-sm text-gray-500 line-through ml-2`}>
              {data.originalPrice ? `₹${data.originalPrice}` : null}
            </h4>
          </div>
        </div>
      </Link>

      {/* side options */}
      <div>
        {click ? (
          <AiFillHeart
            size={22}
            className="cursor-pointer absolute right-2 top-60"
            onClick={() => removeFromWishlistHandler(data)}
            color="red"
            title="Remove from wishlist"
          />
        ) : (
          <AiOutlineHeart
            size={22}
            className="cursor-pointer absolute right-2 top-60"
            onClick={() => addToWishlistHandler(data)}
            color="#333"
            title="Add to wishlist"
          />
        )}

        {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
      </div>
    </div>
  );
};

export default ProductCard;
