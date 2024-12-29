import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../server";
import { DataGrid } from "@material-ui/data-grid";
import { BsPencil } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { toast } from "react-toastify";

const AllWithdraw = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState();
  const [withdrawStatus, setWithdrawStatus] = useState("Processing");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${server}/withdraw/get-all-withdraw-request`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data.withdraws);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  }, []);

  const columns = [
    { field: "id", headerName: "Withdraw Id", minWidth: 250, flex: 0.7 },
    { field: "name", headerName: "Shop Name", minWidth: 280, flex: 1.4 },
    { field: "shopId", headerName: "Shop Id", minWidth: 280, flex: 1.4 },
    { field: "bankName", headerName: "Bank Name", minWidth: 250, flex: 0.8 },
    {
      field: "bankHolderName",
      headerName: "Account Holder",
      minWidth: 250,
      flex: 1.2,
    },
    {
      field: "accountNumber",
      headerName: "Account Number",
      minWidth: 180,
      flex: 1.4,
      renderCell: (params) => {
        const accountNumber = params.row.accountNumber;
        return accountNumber ? accountNumber : "N/A";
      },
    },
    { field: "ifsc", headerName: "IFSC Code", minWidth: 150, flex: 1.2 },
    { field: "amount", headerName: "Amount", minWidth: 100, flex: 0.6 },
    { field: "status", headerName: "Status", type: "text", minWidth: 80, flex: 0.5 },
    {
      field: "createdAt",
      headerName: "Request given at",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: " ",
      headerName: "Update Status",
      type: "number",
      minWidth: 130,
      flex: 0.6,
      renderCell: (params) => {
        return (
          <BsPencil
            size={20}
            className={`${
              params.row.status !== "Processing" ? "hidden" : ""
            } mr-5 cursor-pointer`}
            onClick={() => setOpen(true) || setWithdrawData(params.row)}
          />
        );
      },
    },
  ];

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await axios.put(
        `${server}/withdraw/update-withdraw-request/${withdrawData.id}`,
        {
          sellerId: withdrawData.shopId,
        },
        { withCredentials: true }
      );

      toast.success("Withdraw request updated successfully!");
      setOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update withdraw request.");
    } finally {
      setLoading(false);
    }
  };

  const row = [];

  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        shopId: item.seller._id,
        name: item.seller.name,
        bankHolderName: item.seller.withdrawMethod?.bankHolderName || "N/A",
        bankName: item.seller.withdrawMethod?.bankName || "N/A",
        accountNumber: item.seller.withdrawMethod?.bankAccountNumber,
        ifsc: item.seller.withdrawMethod?.bankSwiftCode,
        amount: "₹ " + item.amount,
        status: item.status,
        createdAt: item.createdAt.slice(0, 10),
      });
    });

  return (
    <div className="w-full flex items-center justify-center pt-5">
      <div className="w-[95%] lg:w-[85%] bg-white">
        <div className="overflow-auto">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      </div>
      {open && (
        <div className="w-full fixed h-screen top-0 left-0 bg-[#00000031] z-[9999] flex items-center justify-center px-4">
          <div className="w-[90%] md:w-[60%] lg:w-[40%] min-h-[40vh] bg-white rounded shadow p-4">
            <div className="flex justify-end w-full">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <h1 className="text-[20px] md:text-[25px] text-center font-Poppins">
              Update Withdraw Status
            </h1>
            <br />
            <select
              onChange={(e) => setWithdrawStatus(e.target.value)}
              className="w-full md:w-[200px] h-[35px] border rounded"
            >
              <option value={withdrawStatus}>{withdrawData?.status}</option>
              <option value="Succeed">Succeed</option>
            </select>
            <button
              type="submit"
              className={`block ${styles.button} text-white !h-[42px] mt-4 text-[18px] ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWithdraw;
