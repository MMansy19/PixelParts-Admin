import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Dashboard components
import OrdersDashboard from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

import Axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

function Dashboard() {
  const [ordersNumber, setOrdersNumber] = useState(0);
  const [productsNumber, setProductsNumber] = useState(0);
  const [usersNumber, setUsersNumber] = useState(0);
  const [messagesNumber, setMessagesNumber] = useState(0);
  const [ordersTotalMoney, setOrdersTotalMoney] = useState(0);
  const [ordersMonthly, setOrdersMonthly] = useState({ labels: [], datasets: { label: "Orders", data: [] } });

 useEffect(() => {
  Axios.get("https://pixelparts-dev-api.up.railway.app/api/v1/stats", {
    headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
  })
    .then((response) => {
      const stats = response.data.data.stats;
      setOrdersNumber(parseInt(stats.orders, 10));
      setProductsNumber(parseInt(stats.products, 10));
      setUsersNumber(parseInt(stats.users, 10));
      setMessagesNumber(parseInt(stats.messages, 10));
      setOrdersTotalMoney(parseFloat(stats.ordersTotalMoney));

      const transformedOrders = {
        labels: stats.monthlyStats.map((item) =>
          new Date(0, item.month - 1).toLocaleString("default", { month: "short" })
        ),
        datasets: {
          label: "Orders",
          data: stats.monthlyStats.map((item) => parseInt(item.ordercount, 10)),
        },
      };
      setOrdersMonthly(transformedOrders);
    })
    .catch((error) => {
      console.error("Error fetching stats:", error);
    });
}, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard color="dark" icon="shopping_cart" title="Orders" count={ordersNumber} percentage={{
                  color: "success",
                  label: "just updated",
                }}/>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard color="primary" icon="category" title="Products" count={productsNumber} percentage={{
                  color: "success",
                  label: "just updated",
                }}/>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard color="success" icon="people" title="Users" count={usersNumber} percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}/>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard color="warning" icon="message" title="Messages" count={messagesNumber} percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}/>
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid spacing={20}>
            <Grid item xs={12} md={6} lg={3} mb={5}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="success"
                  icon="paid"
                  title="Orders Total Profit"
                  count={`${ordersTotalMoney} $`}
                  percentage={{
                    color: "success",
                    amount: "+10%",
                    label: " Just updated",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={9}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Monthly Orders"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={ordersMonthly}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={4.5}>
          <Grid spacing={20}>
            <Grid item xs={12} md={6} lg={3} mb={5}>
              <OrdersDashboard />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={4.5}>
          <Grid spacing={20}>
            <Grid item xs={12} md={6} lg={3} mb={5}>
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
