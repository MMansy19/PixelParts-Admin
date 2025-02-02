import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from "chart.js";
import React, { useState, useEffect, useCallback } from "react";
import { Grid, Card, Box, CircularProgress } from "@mui/material";
import Cookies from "js-cookie";
import Axios from "axios";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import OrdersDashboard from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { Pie, Cell, Tooltip } from "recharts";
import { PieChart } from "@mui/x-charts/PieChart";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

const API_BASE = "https://pixelparts-dev-api.up.railway.app/api/v1/stats";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const fetchStats = async (token, endpoint, setState) => {
  try {
    const res = await Axios.get(`${API_BASE}/${endpoint}`, { headers: { Authorization: `Bearer ${token}` } });
    setState(res.data.data.stats);
  } catch (err) {
    console.error(`Error fetching ${endpoint}:`, err);
  }
};

function Dashboard() {
  const [stats, setStats] = useState({});
  const [userStats, setUserStats] = useState({});
  const [orderStats, setOrderStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (!token) return;

    Promise.all([
      fetchStats(token, "userStats", setUserStats),
      fetchStats(token, "orderStats", setOrderStats),
      fetchStats(token, "", setStats),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }


  const { orders, products, users, messages, ordersTotalMoney, monthlyStats = [] } = stats;

  const transformedOrders = {
    labels: monthlyStats.map((item) => new Date(0, item.month - 1).toLocaleString("default", { month: "short" })),
    datasets: { label: "Orders", data: monthlyStats.map((item) => parseInt(item.ordercount, 10)) },
  };

  const createPieData = (data) => [
    { label: "Active", value: data.activeusers, percentage: data.activepercentage },
    { label: "Pending", value: data.pendingusers, percentage: data.pendingpercentage },
    { label: "Blocked", value: data.blockedusers, percentage: data.blockedpercentage },
  ];


  const orderPieData = (data) => [
    { label: "Pending", value: data.pendingorders, percentage: data.pendingpercentage },
    { label: "Completed", value: data.completedorders || 0, percentage: data.completedpercentage || 0 },
    { label: "Cancelled", value: data.cancelledorders, percentage: data.cancelledpercentage },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3} justifyContent="center">
          {[
            { title: "Orders", count: parseInt(orders, 10), icon: "shopping_cart", color: "dark" },
            { title: "Products", count: parseInt(products, 10), icon: "category", color: "primary" },
            { title: "Users", count: parseInt(users, 10), icon: "people", color: "success" },
            { title: "Messages", count: parseInt(messages, 10), icon: "message", color: "warning" },
            { title: "Orders Total Profit", count: `${parseInt(ordersTotalMoney, 10)} $`, icon: "paid", color: "success" },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
              <ComplexStatisticsCard {...item} percentage={{ color: "success", label: "Just updated" }} />
            </Grid>
          ))}
        </Grid>
        <MDBox mt={4.5}>
          <Grid spacing={3}>
            <Grid item xs={12} md={6} lg={9}>
              <ReportsLineChart color="success" title="Monthly Orders" chart={transformedOrders} />
            </Grid>
          </Grid>
        </MDBox>
          <Grid container spacing={3} marginTop={4.5}>
            <Grid item xs={12} md={6} lg={6}>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <MDTypography variant="h6" color="white">
                    Users Count
                  </MDTypography>
                </MDBox>
                <MDBox p={3} width="100%" align="center">
                  <PieChart
                    width={500}
                    height={300}
                    series={[
                      {
                        data: createPieData(userStats),
                        arcLabel: (item) => `${item.percentage}%`,
                        arcLabelMinAngle: 50,
                        arcLabelRadius: "60%",
                        highlightScope: { fade: "global", highlight: "item" },
                        faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
                      },
                    ]}
                    colors={["#00C49F", "#FFBB28", "#850000"]}
                    title="Pie Chart"
                  >
                    <Pie
                      data={createPieData(userStats)}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      label
                    >
                      {createPieData(userStats).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={6} >
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="dark"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <MDTypography variant="h6" color="white">
                    Orders Count
                  </MDTypography>
                </MDBox>
                <MDBox p={3} width="100%" align="center">
                  <PieChart
                    width={500}
                    height={300}
                    series={[
                      {
                        data: orderPieData(orderStats),
                        arcLabel: (item) => `${item.percentage}%`,
                        arcLabelMinAngle: 50,
                        arcLabelRadius: "60%",
                        highlightScope: { fade: "global", highlight: "item" },
                        faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
                      },
                    ]}
                    colors={COLORS}
                    title="Orders Distribution"
                  >
                    <Pie
                      data={orderPieData(orderStats)}
                      dataKey="value"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      label
                    >
                      {orderPieData(orderStats).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </MDBox>

              </Card>
            </Grid>
          </Grid>

        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <OrdersDashboard />
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
