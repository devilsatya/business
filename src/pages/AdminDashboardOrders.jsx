import React, { useEffect } from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import { DataGrid } from "@material-ui/data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../redux/actions/order";
import { Button } from "@material-ui/core";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
const AdminDashboardOrders = () => {
  const dispatch = useDispatch();

  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
  }, []);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "size",
      headerName: "size",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "color",
      headerName: "color",
      type: "text",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

  
  ];


  const row = [];

adminOrders &&
  adminOrders.forEach((item) => {
    // Map through cart items to extract colors and sizes
    const colors = item?.cart?.map((cartItem) => cartItem.color).join(", ") || "N/A";
    const sizes = item?.cart?.map((cartItem) => cartItem.size).join(", ") || "N/A";

    row.push({
      id: item._id,
      itemsQty: item?.cart?.reduce((acc, cartItem) => acc + cartItem.qty, 0) || 0,
      total: "₹" + (item?.totalPrice || 0),
      status: item?.status || "N/A",
      createdAt: item?.createdAt?.slice(0, 10) || "N/A",
      color: colors,
      size: sizes,
    });
  });

  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={2} />
          </div>

          <div className="w-full min-h-[45vh] pt-5 rounded flex justify-center">
            <div className="w-[97%] flex justify-center">
              <DataGrid
                rows={row}
                columns={columns}
                pageSize={4}
                disableSelectionOnClick
                autoHeight
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOrders;
