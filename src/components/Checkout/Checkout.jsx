import React, { useState, useEffect } from "react";
import styles from "../../styles/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { server } from "../../server";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [city, setCity] = useState(""); // Allow user to manually enter city
  const [state, setState] = useState("");  
  const [userInfo, setUserInfo] = useState(false);
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [zipCode, setZipCode] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(user ? user.phoneNumber : "");

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchCityStateFromZip = async (zip) => {
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${zip}`);
      const data = response.data;
      if (data[0].Status === "Success") {
        const { State } = data[0].PostOffice[0]; // Fetch state from PostOffice
        setState(State); // Automatically set the state based on zip code
      } else {
        setState(""); 
        toast.error("Invalid Zip Code");
      }
    } catch (error) {
      setState(""); 
      toast.error("Error fetching city/state data");
    }
  };

  const handleZipCodeChange = (e) => {
    const zip = e.target.value;
    setZipCode(zip);
    if (zip.length === 6) {
      fetchCityStateFromZip(zip); // Fetch state when 6-digit zip code is entered
    }
  };

  const paymentSubmit = () => {
    if (
      houseNumber === "" ||
      street === "" ||
      zipCode === null ||
      city === "" || // User must manually input city
      state === "" || 
      phoneNumber === "" 
    ) {
      toast.error("Please choose your delivery address!");
    } else {
      const shippingAddress = {
        houseNumber,
        street,
        zipCode,
        city, // Manual city input will be used
        state,
        phoneNumber,  
      };

      const orderData = {
        cart,
        totalPrice,
        subTotalPrice,
        shipping,
        discountPrice,
        shippingAddress,

        user,
      };

      localStorage.setItem("latestOrder", JSON.stringify(orderData));
      navigate("/payment");
    }
  };

  const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const shipping = 40;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = couponCode;

    await axios.get(`${server}/coupon/get-coupon-value/${name}`).then((res) => {
      const shopId = res.data.couponCode?.shopId;
      const couponCodeValue = res.data.couponCode?.value;
      if (res.data.couponCode !== null) {
        const isCouponValid =
          cart && cart.filter((item) => item.shopId === shopId);

        if (isCouponValid.length === 0) {
          toast.error("Coupon code is not valid for this shop");
          setCouponCode("");
        } else {
          const eligiblePrice = isCouponValid.reduce(
            (acc, item) => acc + item.qty * item.discountPrice,
            0
          );
          const discountPrice = (eligiblePrice * couponCodeValue) / 100;
          setDiscountPrice(discountPrice);
          setCouponCodeData(res.data.couponCode);
          setCouponCode("");
        }
      }
      if (res.data.couponCode === null) {
        toast.error("Coupon code doesn't exist!");
        setCouponCode("");
      }
    });
  };

  const discountPercentenge = couponCodeData ? discountPrice : "";

  const totalPrice = couponCodeData
    ? (subTotalPrice + shipping - discountPercentenge).toFixed(2)
    : (subTotalPrice + shipping).toFixed(2);

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <ShippingInfo
            user={user}
            city={city}
            setCity={setCity} // Allow city to be manually set
            state={state} 
            setState={setState} 
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            houseNumber={houseNumber}
            setHouseNumber={setHouseNumber}
            street={street}
            setStreet={setStreet}
            zipCode={zipCode}
            setZipCode={setZipCode}
            handleZipCodeChange={handleZipCodeChange}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData
            handleSubmit={handleSubmit}
            totalPrice={totalPrice}
            shipping={shipping}
            subTotalPrice={subTotalPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountPercentenge={discountPercentenge}
          />
        </div>
      </div>
      <div
        className={`${styles.button} w-[150px] 800px:w-[280px] mt-10`}
        onClick={paymentSubmit}
      >
        <h5 className="text-white">Go to Payment</h5>
      </div>
    </div>
  );
};

const ShippingInfo = ({
  user,
  city,
  setCity,
  state,
  setState,
  userInfo,
  setUserInfo,
  houseNumber,
  setHouseNumber,
  street,
  setStreet,
  zipCode,
  setZipCode,
  handleZipCodeChange,
  phoneNumber,
  setPhoneNumber
}) => {
  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
      <h5 className="text-[18px] font-[500]">Shipping Address</h5>
      <br />
      <form>
        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Full Name</label>
            <input
              type="text"
              value={user && user.name}
              required
              className={`${styles.input} !w-[95%]`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Email Address</label>
            <input
              type="email"
              value={user && user.email}
              required
              className={`${styles.input}`}
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Phone Number</label>
            <input
              type="number"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)} // Allow user to manually input
              className={`${styles.input} !w-[95%]`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Zip Code</label>
            <input
              type="number"
              value={zipCode}
              onChange={handleZipCodeChange}
              required
              className={`${styles.input}`}
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">State</label>
            <input
              type="text"
              value={state}
              readOnly
              className={`${styles.input} !w-[95%]`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">City</label>
            <input
              type="text"
              value={city} // Allow user to manually enter city
              onChange={(e) => setCity(e.target.value)} // Handle manual city input
              required
              className={`${styles.input}`}
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">House Number</label>
            <input
              type="text"
              required
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
              className={`${styles.input} !w-[95%]`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Street</label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
              className={`${styles.input}`}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

const CartData = ({
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPercentenge,
}) => {
  return (
    <div className="w-full bg-white rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[18px] font-[500]">Cart Total</h3>
        <h3 className="text-[18px] font-[500]">₹{subTotalPrice}</h3>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[18px] font-[500]">Shipping</h3>
        <h3 className="text-[18px] font-[500]">₹{shipping}</h3>
      </div>
      <br />
      {discountPercentenge && (
        <div className="flex justify-between">
          <h3 className="text-[18px] font-[500]">Discount</h3>
          <h3 className="text-[18px] font-[500]">-₹{discountPercentenge}</h3>
        </div>
      )}
      <div className="flex justify-between pt-3 border-t border-gray-300">
        <h3 className="text-[18px] font-[500]">Total</h3>
        <h3 className="text-[18px] font-[500]">₹{totalPrice}</h3>
      </div>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className={`${styles.input} !w-[95%]`}
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <div className={`${styles.button} !w-[150px] mt-5`}>
          <input type="submit" value="Apply Code" className="text-white" />
        </div>
      </form>
    </div>
  );
};

export default Checkout;
