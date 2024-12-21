import Tooltip from "@mui/material/Tooltip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";

import Axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Data() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await Axios.get(
        "http://127.0.0.1:3000/api/v1/orders/allOrders?limit=7&&order=o.orderDate",
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        }
      );
      setOrders(response.data.data.allOrders);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = [
    { Header: "Order ID", accessor: "orderid", width: "15%", align: "left" },
    { Header: "Order Date", accessor: "orderdate", width: "25%", align: "left" },
    { Header: "Patient Name", accessor: "fullname", width: "20%", align: "left" },
    { Header: "Total Amount", accessor: "totalamount", align: "center" },
    { Header: "Products", accessor: "products", align: "left" },
  ];

  const rows = orders.map((order) => ({
    orderid: order.orderid,
    orderdate: new Date(order.orderdate).toLocaleString(),
    fullname: `${order.firstname} ${order.lastname}`,
    totalamount: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        ${order.totalamount}
      </MDTypography>
    ),
    products: order.products.map((product, index) => (
      <MDBox key={index} display="flex" flexDirection="row" alignItems="center" gap={3}>
        <MDTypography variant="caption">{product.productName || "N/A"}</MDTypography>
        <MDTypography variant="caption">Quantity: {product.productQuantity || 0}</MDTypography>
      </MDBox>
    )),
  }));

  return {
    columns,
    rows,
  };
}
