import React, { useState, useEffect, useMemo } from "react";
import {
  Grid,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDSnackbar from "components/MDSnackbar";
import Axios from "axios";
import Cookies from "js-cookie";
import appData from "layouts/orders/data/appData";
import ProductDetailsDialog from "./productDetailsDialog";

function OrdersDashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const {
    columns,
    rows,
    notification,
    setNotification,
    isModalOpen,
    fetchProducts,
    handleCloseModal,
    handleCloseNotification,
  } = appData();

  useEffect(() => {
    const fetchAppointmentsStats = async () => {
      try {
        const { data } = await Axios.get(
          "https://pixelparts-dev-api.up.railway.app/api/v1/stats/orderStats",
          { headers: { Authorization: `Bearer ${Cookies.get("authToken")}` } }
        );
        setStats(data.data.stats);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointmentsStats();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3} marginBottom={5}>
          {[
            {
              title: "Total Orders",
              count: stats.totalorders,
              color: "info",
              icon: "shopping_cart",
            },
            {
              title: "Paid Orders",
              count: stats.paidorders,
              color: "success",
              icon: "done",
            },
            {
              title: "Pending Orders",
              count: stats.pendingorders,
              color: "warning",
              icon: "hourglass_empty",
            },
            {
              title: "Cancelled Orders",
              count: stats.cancelledorders,
              color: "error",
              icon: "cancel",
            },
          ].map(({ title, count, color, icon }) => (
            <Grid item xs={12} md={6} lg={3} key={title}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color={color}
                  icon={icon}
                  title={title}
                  count={loading ? <CircularProgress size={20} /> : count}
                  percentage={{ color: "success", amount: "", label: "Just updated" }}
                />
              </MDBox>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={6}>
          <Grid item xs={12}>
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
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Orders Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted
                  entriesPerPage={false}
                  showTotalEntries
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      <MDSnackbar
        color={notification.severity}
        icon={notification.severity === "success" ? "check" : "error"}
        title={notification.severity === "success" ? "Success" : "Error"}
        content={notification.message}
        open={notification.open}
        onClose={handleCloseNotification}
        close={handleCloseNotification}
        bgWhite
      />

      <ProductDetailsDialog
        isOpen={isModalOpen}
        handleClose={handleCloseModal}
        fetchProducts={fetchProducts}
      />
    </DashboardLayout>
  );
}

export default OrdersDashboard;
