import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Axios from "axios";
import Cookies from "js-cookie";

import { Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PieChart } from "@mui/x-charts/PieChart";

function ChartsDashboard() {
  const [activeCount, setActiveCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [blockedCount, setBlockedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState({});
  const [orderStats, setOrderStats] = useState({});



  useEffect(() => {
    const token = Cookies.get("authToken");

    if (!token) {
      setError("Authentication token missing.");
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const [userRes, orderRes] = await Promise.all([
          Axios.get("https://pixelparts-dev-api.up.railway.app/api/v1/stats/userStats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          Axios.get("https://pixelparts-dev-api.up.railway.app/api/v1/stats/orderStats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUserStats(userRes.data.data.stats);
        setOrderStats(orderRes.data.data.stats);
      } catch (err) {
        setError("Error fetching data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const samplePieData = [
    {
      label: "Active",
      value: userStats.activeusers,
      percentage: userStats.activepercentage,
    },
    {
      label: "Pending",
      value: userStats.pendingusers,
      percentage: userStats.pendingpercentage,
    },
    {
      label: "Blocked",
      value: userStats.blockedusers,
      percentage: userStats.blockedpercentage,
    },
  ];


  const orderPieData = [
    { label: "Paid", value: orderStats.paidorders, percentage: orderStats.paidpercentage },
    { label: "Pending", value: orderStats.pendingorders, percentage: orderStats.pendingpercentage },
    { label: "Cancelled", value: orderStats.cancelledorders, percentage: orderStats.cancelledpercentage },
  ];

  const sampleBarData = [
    { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
    { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
    { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
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
                    Doctors Count
                  </MDTypography>
                </MDBox>
                <MDBox p={3} width="100%" align="center">
                  <PieChart
                    width={500}
                    height={300}
                    series={[
                      {
                        data: samplePieData,
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
                      data={samplePieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      label
                    >
                      {samplePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="dark"
                  borderRadius="lg"
                  coloredShadow="dark"
                >
                  <MDTypography variant="h6" color="white">
                    Bar Chart Example Testing
                  </MDTypography>
                </MDBox>
                <MDBox p={3} align="center">
                  <BarChart
                    width={600}
                    height={300}
                    data={sampleBarData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="uv" fill="#8884d8" />
                    <Bar dataKey="pv" fill="#82ca9d" />
                  </BarChart>
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={6} marginTop={3}>
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
                    Products Count
                  </MDTypography>
                </MDBox>
                <MDBox p={3} width="100%" align="center">
                  <PieChart
                    width={500}
                    height={300}
                    series={[
                      {
                        data: orderPieData,
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
                      data={orderPieData}
                      dataKey="value"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      label
                    >
                      {orderPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </MDBox>

              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={6} marginTop={3}>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="dark"
                >
                  <MDTypography variant="h6" color="white">
                    Bar Chart Example Testing
                  </MDTypography>
                </MDBox>
                <MDBox p={3} align="center">
                  <BarChart
                    width={600}
                    height={300}
                    data={sampleBarData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="uv" fill="#8884d8" />
                    <Bar dataKey="pv" fill="#82ca9d" />
                  </BarChart>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        )}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ChartsDashboard;
