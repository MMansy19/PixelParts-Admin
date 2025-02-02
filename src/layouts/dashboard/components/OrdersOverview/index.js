import { useEffect, useState, useMemo } from "react";
import Axios from "axios";
import Cookies from "js-cookie";
import { Bar } from "react-chartjs-2";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function OrdersChart() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = Cookies.get("authToken");
      try {
        const response = await Axios.get(
          "https://pixelparts-dev-api.up.railway.app/api/v1/order/allOrders?limit=7&order=-o.orderDate",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(response.data.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const chartData = useMemo(() => {
    if (orders.length === 0) return null;

    return {
      labels: orders.map((order) =>
        new Date(order.orderdate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      ),
      datasets: [
        {
          label: "Total Price ($)",
          data: orders.map((order) => parseFloat(order.totalprice)),
          backgroundColor: ["#3F51B5", "#009688", "#FF9800", "#F44336", "#4CAF50", "#2196F3", "#FFC107"],
        },
      ],
    };
  }, [orders]);

  return (
    <Card sx={{ padding: 5, marginTop: 3 }}>
      <MDBox>
        <MDTypography variant="h6" fontWeight="medium">
          Last 7 Orders
        </MDTypography>
      </MDBox>
      <MDBox>
        {chartData ? <Bar data={chartData} /> : <MDTypography>Loading...</MDTypography>}
      </MDBox>
    </Card>
  );
}

export default OrdersChart;
