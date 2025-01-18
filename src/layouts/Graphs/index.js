import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
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
  const [doctorsStats, setDoctorsStats] = useState({});
  const [stats, setStats] = useState({});

  const fetchDoctorsStat = async () => {
    try {
      const response = await Axios.get(
        "https://mediportal-api-production.up.railway.app/api/v1/doctors/stats"
      );
      // console.log(response);
      setDoctorsStats(response.data.data.stats);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointmentsStats = async () => {
    try {
      setLoading(true);
      const response = await Axios.get(
        "https://mediportal-api-production.up.railway.app/api/v1/appointments/stats",
        {
          headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
        }
      );
      setLoading(false);
      console.log(response.data.data.stats);
      setStats(response.data.data.stats);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDoctorsStat();
    fetchAppointmentsStats();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const samplePieData = [
    {
      label: "Active",
      value: doctorsStats.activedoctors,
      percentage: doctorsStats.activepercentage,
    },
    {
      label: "Pending",
      value: doctorsStats.pendingdoctors,
      percentage: doctorsStats.pendingpercentage,
    },
    {
      label: "Blocked",
      value: doctorsStats.blockeddoctors,
      percentage: doctorsStats.blockedpercentage,
    },
  ];

  const appData = [
    {
      label: "Completed",
      value: stats.completedappointments,
      percentage: stats.completedpercentage,
    },
    {
      label: "Scheduled",
      value: stats.scheduledappointments,
      percentage: stats.scheduledpercentage,
    },
    {
      label: "Cancelled",
      value: stats.cancelledappointments,
      percentage: stats.cancelledpercentage,
    },
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
                        data: appData,
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
                      data={appData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      label
                    >
                      {appData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
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
