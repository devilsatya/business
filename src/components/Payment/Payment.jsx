import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import styles from "../../styles/styles";

const Payment = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const storedOrder = localStorage.getItem("latestOrder");
    if (storedOrder) {
      setOrderData(JSON.parse(storedOrder));
    } else {
      toast.error("No order data found");
      navigate("/cart");
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!orderData) {
    return null;
  }

  const order = {
    cart: orderData.cart.map(item => ({
      ...item,
      size: item.size,  // Ensure size is included
    })),
    shippingAddress: orderData.shippingAddress,
    user: user,
    totalPrice: orderData.totalPrice,
  };

  const paymentData = {
    amount: Math.round(orderData.totalPrice * 100),
  };

  // Stripe Payment Handler
  const paymentHandler = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      toast.error("Stripe is not properly initialized.");
      return;
    }

    try {
      const { data } = await axios.post(`${server}/payment/process-stripe`, paymentData);
      const client_secret = data.client_secret;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        order.paymentInfo = {
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
          type: "Credit Card",
        };
        createOrder(order);
      }
    } catch (error) {
      toast.error("Stripe payment failed. Please try again.");
    }
  };

  // PayPal Handlers
  const createOrder = async (orderData) => {
    try {
      const { data } = await axios.post(`${server}/order/create-order`, orderData);
      navigate("/order/success");
      toast.success("Order placed successfully!");
      clearLocalStorage();
    } catch (error) {
      toast.error("Failed to create order. Please try again.");
    }
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      const paymentInfo = details.payer;
      if (paymentInfo) {
        order.paymentInfo = {
          id: paymentInfo.payer_id,
          status: "succeeded",
          type: "PayPal",
        };
        createOrder(order);
      }
    });
  };

  const razorpayPaymentHandler = async () => {
    try {
      const { data } = await axios.post(`${server}/payment/process-razorpay`, paymentData);
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: paymentData.amount,
        currency: data.currency,
        name: "FabreeKart",
        description: "Payment for order",
        order_id: data.order_id,
        handler: (response) => {
          order.paymentInfo = {
            id: response.razorpay_payment_id,
            status: "succeeded",
            type: "Razorpay",
          };
          createOrder(order);
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      toast.error("Error with Razorpay payment");
    }
  };

  const clearLocalStorage = () => {
    localStorage.setItem("cartItems", JSON.stringify([]));
    localStorage.setItem("latestOrder", JSON.stringify([]));
    window.location.reload();
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <PaymentInfo
            user={user}
            paymentHandler={paymentHandler}
            onApprove={onApprove}
            razorpayPaymentHandler={razorpayPaymentHandler}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

const PaymentInfo = ({ user, paymentHandler, onApprove, razorpayPaymentHandler }) => {
  const [select, setSelect] = useState(1);

  return (
    <div className="w-full bg-white rounded-md p-5 pb-8">
      
     {/* Stripe Payment 
      <div className="flex items-center pb-5">
        <div onClick={() => setSelect(1)} className="cursor-pointer">
          <input type="radio" checked={select === 1} onChange={() => setSelect(1)} />
        </div>
        <h4 className="text-[18px] pl-2 font-semibold">Pay with Credit/Debit Card</h4>
      </div>
      {select === 1 && (
        <form onSubmit={paymentHandler}>
          <div>
            <label>Name on Card</label>
            <input value={user?.name || ""} className={styles.input} disabled />
          </div>
          <CardNumberElement className={styles.input} />
          <CardExpiryElement className={styles.input} />
          <CardCvcElement className={styles.input} />
          <button type="submit" className={styles.button}>
            Pay Now
          </button>
        </form>
      )*/}

      {/* PayPal Payment }
      <div className="flex items-center pb-5">
        <div onClick={() => setSelect(2)} className="cursor-pointer">
          <input type="radio" checked={select === 2} onChange={() => setSelect(2)} />
        </div>
        <h4 className="text-[18px] pl-2 font-semibold">Pay with PayPal</h4>
      </div>
      {select === 2 && (
        <PayPalScriptProvider options={{ "client-id": process.env.PAYPAL_CLIENT_ID }}>
          <PayPalButtons onApprove={onApprove} />
        </PayPalScriptProvider>
      )}*/}
      {/* Razorpay Payment */}
      <div className="flex items-center pb-5">
        <div onClick={() => setSelect(3)} className="cursor-pointer">
          <input type="radio" checked={select === 3} onChange={() => setSelect(3)} />
        </div>
        <h4 className="text-[18px] pl-2 font-semibold">Pay with Razorpay</h4>
      </div>
      {select === 3 && (
  <button
    onClick={razorpayPaymentHandler}
    className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300"
  >
    Pay Now
  </button>
)}

    </div>
  );
};

const CartData = ({ orderData }) => {
  const shipping = orderData?.shipping?.toFixed(2);
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">subtotal:</h3>
        <h5 className="text-[18px] font-[600]">₹{orderData?.subTotalPrice}</h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">shipping:</h3>
        <h5 className="text-[18px] font-[600]">₹{shipping}</h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Discount:</h3>
        <h5 className="text-[18px] font-[600]">{orderData?.discountPrice? "₹" + orderData.discountPrice : "-"}</h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3">
        ₹{orderData?.totalPrice}
      </h5>
      <br />
    </div>
  );
};
export default Payment;
