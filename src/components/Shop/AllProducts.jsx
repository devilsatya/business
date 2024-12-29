import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { deleteProduct } from "../../redux/actions/product";
import Loader from "../Layout/Loader";

const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    window.location.reload();
  };

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "string", // Change to string as we are returning a formatted string
      minWidth: 200,
      flex: 1.2,
      renderCell: (params) => {
        const variations = params.row.variations;

        // Initialize an array to store the stock information for each color and size
        let stockInfo = [];

        variations.forEach((variation) => {
          variation.colors.forEach((color) => {
            const sizes = ["S", "M", "L", "XL", "XXL", "XS"];
            sizes.forEach((size) => {
              const stockKey = `stock${size}`;
              if (color[stockKey] > 0) {
                stockInfo.push(`${color.color}:(${size})=${color[stockKey]}`);
              }
            });
          });
        });

        // Join the stock info with a comma separator
        return stockInfo.join(", ");
      }
    },
    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/product/${params.id}`}>
            <Button>
              <AiOutlineEye size={20} />
            </Button>
          </Link>
        );
      },
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Button onClick={() => handleDelete(params.id)}>
            <AiOutlineDelete size={20} />
          </Button>
        );
      },
    },
  ];

  const row = [];

  products &&
    products.forEach((item) => {
      // Calculate total stock for the product by summing across all variations and sizes
      let totalStock = 0;
      item.variations.forEach((variation) => {
        variation.colors.forEach((color) => {
          totalStock += color.stockS + color.stockM + color.stockL + color.stockXL + color.stockXXL + color.stockXS;
        });
      });

      row.push({
        id: item._id,
        name: item.name,
        price: "₹" + item.discountPrice,
        stock: "", // Set stock as empty, we'll render it dynamically
        sold: item?.sold_out,
        variations: item.variations, // Add variations to row data for the stock calculation
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 z-0 pt-1 mt-10 bg-white">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}
    </>
  );
};

export default AllProducts;
