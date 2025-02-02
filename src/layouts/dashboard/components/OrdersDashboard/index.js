import { useState, useEffect } from "react";
import Axios from "axios";
import Cookies from "js-cookie";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";

function OrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await Axios.get(
          "https://pixelparts-dev-api.up.railway.app/api/v1/order/allOrders?limit=7&order=-o.orderDate",
          {
            headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
          }
        );
        setOrders(response.data.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const columns = [
    { Header: "Order ID", accessor: "orderid", width: "10%", align: "left" },
    { Header: "Order Date", accessor: "orderdate", width: "20%", align: "left" },
    { Header: "Customer Name", accessor: "username", width: "20%", align: "left" },
    { Header: "Email", accessor: "email", width: "20%", align: "left" },
    { Header: "Total Price", accessor: "totalprice", align: "center" },
    { Header: "Payment Status", accessor: "paymentstatus", align: "center" },
  ];

  const rows = orders.map((order) => ({
    orderid: order.orderid,
    orderdate: new Date(order.orderdate).toLocaleString(),
    username: order.username,
    email: (
      <Tooltip title={order.email}>
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {order.email.length > 20 ? order.email.slice(0, 20) + "..." : order.email}
        </MDTypography>
      </Tooltip>
    ),
    totalprice: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        ${order.totalprice}
      </MDTypography>
    ),
    paymentstatus: (
      <Chip
        label={order.paymentstatus}
        color={order.paymentstatus === "Pending" ? "warning" : "success"}
        size="small"
      />
    ),
  }));

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Latest Orders
          </MDTypography>
          <MDBox display="flex" alignItems="center" lineHeight={0}>
            <Icon sx={{ fontWeight: "bold", color: "info.main", mt: -0.5 }}>done</Icon>
            <MDTypography variant="button" fontWeight="regular" color="text">
              &nbsp;<strong>Last 7</strong> this month
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
      <MDBox>
        {loading ? (
          <MDBox display="flex" justifyContent="center" py={3}>
            <CircularProgress />
          </MDBox>
        ) : (
          <DataTable                   
            table={{ columns, rows }}
            isSorted
            entriesPerPage={false}
            showTotalEntries
            noEndBorder
          />
        )}
      </MDBox>
    </Card>
  );
}

export default OrdersDashboard;
