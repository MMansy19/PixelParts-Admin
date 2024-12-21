/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

import Axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const [ordersnumber, setOrdersnumber] = useState(0);
  const [workspacesnumber, setWorkspacesnumber] = useState(0);
  const [appointmentsnumber, setAppointmentsnumber] = useState(0);
  const [usersnumber, setUsersnumber] = useState(0);
  const [ordersMoney, setOrdersMoney] = useState(0);
  const [appointmentsMoney, setAppointmentsMoney] = useState(0);
  const [AppointmentsMonthly, setAppointmentsMonthly] = useState([]);
  const [ordersMonthly, setOrdersMonthly] = useState([]);

  useEffect(() => {
    const token = Cookies.get("authToken");
    Axios.get("https://mediportal-api-production.up.railway.app/api/v1/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setOrdersnumber(response.data.data.ordersnumber);
      setWorkspacesnumber(response.data.data.workspacesnumber);
      setAppointmentsnumber(response.data.data.appointmentsnumber);
      setUsersnumber(response.data.data.usersnumber);
      setOrdersMoney(response.data.data.orderstotalmoney);
      setAppointmentsMoney(response.data.data.appointmentstotoalmoney);
      // Transform AppointmentsMonthly data
      const transformedAppointments = {
        labels: response.data.data.AppointmentsMonthly.map((item) =>
          new Date(0, item.month - 1).toLocaleString("default", { month: "short" })
        ),
        datasets: {
          label: "Appointments",
          data: response.data.data.AppointmentsMonthly.map((item) =>
            parseInt(item.appointmentcount, 10)
          ),
        },
      };

      // Transform ordersMonthly data
      const transformedOrders = {
        labels: response.data.data.ordersMonthly.map((item) =>
          new Date(0, item.month - 1).toLocaleString("default", { month: "short" })
        ),
        datasets: {
          label: "Orders",
          data: response.data.data.ordersMonthly.map((item) => parseInt(item.ordercount, 10)),
        },
      };

      // Update the state with the transformed data
      setAppointmentsMonthly(transformedAppointments);
      setOrdersMonthly(transformedOrders);
    });
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Orders"
                count={ordersnumber}
                percentage={{
                  color: "success",
                  label: "just updated",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="event"
                title="Appointments"
                count={appointmentsnumber}
                percentage={{
                  color: "success",
                  label: "just updated",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Workspace"
                count={workspacesnumber}
                percentage={{
                  color: "success",
                  label: "just updated",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Users"
                count={usersnumber}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Monthly Appointments"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={AppointmentsMonthly}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="Monthly Orders"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={ordersMonthly}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ComplexStatisticsCard
                  color="dark"
                  icon="paid"
                  title="Appointments Total Profit"
                  count={`${appointmentsMoney} $`}
                  percentage={{
                    color: "success",
                    amount: "+25%",
                    label: " Just updated",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ComplexStatisticsCard
                  color="success"
                  icon="paid"
                  title="Orders Total Profit"
                  count={`${ordersMoney} $`}
                  percentage={{
                    color: "success",
                    amount: "+10%",
                    label: " Just updated",
                  }}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
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
