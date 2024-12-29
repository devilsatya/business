import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { getAllOrdersOfShop } from "../../redux/actions/order";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { loadSeller } from "../../redux/actions/user";
import { AiOutlineDelete } from "react-icons/ai";

const WithdrawMoney = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const { seller } = useSelector((state) => state.seller);
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(50);
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    bankCountry: "",
    bankSwiftCode: "",
    bankAccountNumber: "",
    bankHolderName: "",
    bankAddress: "",
  });

  const availableBalance = seller?.availableBalance?.toFixed(2);

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const withdrawMethod = {
        bankName: bankInfo.bankName,
        bankCountry: bankInfo.bankCountry,
        bankSwiftCode: bankInfo.bankSwiftCode,
        bankAccountNumber: bankInfo.bankAccountNumber,
        bankHolderName: bankInfo.bankHolderName,
        bankAddress: bankInfo.bankAddress,
      };

      await axios.put(
        `${server}/shop/update-payment-methods`,
        { withdrawMethod },
        { withCredentials: true }
      );

      toast.success("Withdraw method added successfully!");
      dispatch(loadSeller());
      setBankInfo({
        bankName: "",
        bankCountry: "",
        bankSwiftCode: "",
        bankAccountNumber: "",
        bankHolderName: "",
        bankAddress: "",
      });
      setPaymentMethod(false);
      window.location.reload(); // Reload after success
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add withdraw method!");
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async () => {
    setLoading(true);

    try {
      await axios.delete(`${server}/shop/delete-withdraw-method`, {
        withCredentials: true,
      });

      toast.success("Withdraw method deleted successfully!");
      dispatch(loadSeller());
      navigate("/dashboard"); // Navigate to /dashboard after success
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete withdraw method!");
    } finally {
      setLoading(false);
    }
  };

  const withdrawHandler = async () => {
    if (withdrawAmount < 50 || withdrawAmount > availableBalance) {
      toast.error("Invalid withdrawal amount!");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${server}/withdraw/create-withdraw-request`,
        { amount: withdrawAmount },
        { withCredentials: true }
      );

      toast.success("Withdraw request submitted successfully!");
      window.location.reload(); // Reload after success
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process withdrawal!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[90vh] p-8">
      <div className="w-full bg-white h-full rounded flex items-center justify-center flex-col">
        <h5 className="text-[20px] pb-4">Available Balance: ₹{availableBalance}</h5>
        <button
          className={`${styles.button} text-white !h-[42px] !rounded ${loading || availableBalance < 50 ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => availableBalance >= 50 && setOpen(true)}
          disabled={loading || availableBalance < 50}
        >
          Withdraw
        </button>
      </div>

      {open && (
        <div className="w-full h-screen z-[9999] fixed top-0 left-0 flex items-center justify-center bg-[#0000004e]">
          <div
            className={`w-[95%] 800px:w-[50%] bg-white shadow rounded ${paymentMethod ? "h-[80vh] overflow-y-scroll" : "h-[unset]"} min-h-[40vh] p-3`}
          >
            <div className="w-full flex justify-end">
              <RxCross1
                size={25}
                onClick={() => {
                  setOpen(false);
                  setPaymentMethod(false);
                }}
                className="cursor-pointer"
              />
            </div>
            {paymentMethod ? (
              <form onSubmit={handleSubmit}>
                <h3 className="text-[22px] font-Poppins text-center font-[600]">
                  Add New Withdraw Method:
                </h3>
                {Object.keys(bankInfo).map((key, index) => (
                  <div key={index} className="pt-2">
                    <label>
                      {key.replace(/([A-Z])/g, " $1").trim()} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankInfo[key]}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          [key]: e.target.value,
                        })
                      }
                      placeholder={`Enter your ${key.replace(/([A-Z])/g, " $1").trim().toLowerCase()}!`}
                      className={`${styles.input} mt-2`}
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className={`${styles.button} mb-3 text-white ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={loading}
                >
                  Add
                </button>
              </form>
            ) : (
              <div>
                <h3 className="text-[22px] font-Poppins">Available Withdraw Methods:</h3>
                {seller?.withdrawMethod ? (
                  <div>
                    <div className="800px:flex w-full justify-between items-center">
                      <div className="800px:w-[50%]">
                        <h5>
                          Account Number:{" "}
                          {"*".repeat(seller.withdrawMethod.bankAccountNumber.length - 3) +
                            seller.withdrawMethod.bankAccountNumber.slice(-3)}
                        </h5>
                        <h5>Bank Name: {seller.withdrawMethod.bankName}</h5>
                      </div>
                      <AiOutlineDelete
                        size={25}
                        className={`cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={deleteHandler}
                      />
                    </div>
                    <br />
                    <h4>Available Balance: ₹{availableBalance}</h4>
                    <div className="800px:flex w-full items-center mt-3">
                      <input
                        type="number"
                        placeholder="Amount..."
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                        className="800px:w-[100px] w-full border 800px:mr-3 p-1 rounded"
                      />
                      <button
                        className={`${styles.button} !h-[42px] text-white ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={withdrawHandler}
                        disabled={loading}
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-[18px] pt-2">No Withdraw Methods available!</p>
                    <button
                      className={`${styles.button} text-white text-[18px] mt-4 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => setPaymentMethod(true)}
                      disabled={loading}
                    >
                      Add New
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawMoney;
