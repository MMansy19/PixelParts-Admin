import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import MDSnackbar from "components/MDSnackbar";
import { useState, useEffect } from "react";
import Axios from "axios";
import Cookies from "js-cookie";

// Data
import appData from "layouts/Offers/data/appData";

function Tables() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  const {
    columns,
    rows,
    oldOffer,
    notification,
    handleCloseNotification,
    handleDeleteOffer,
    isDeleteModalOpen,
    closeDeleteModal,
    isOfferModalOpen,
    handleEditOffer,
    closeOfferModal,
  } = appData();

  const [newOffer, setNewOffer] = useState({
    offerPercentage: oldOffer,
    startDate: String(new Date()),
    endDate: String(new Date()),
  });
  const fetchAppointmentsStats = async () => {
    try {
      setLoading(true);
      const response = await Axios.get(
        // TO DO
        "https://PixelParts-api-production.up.railway.app/api/v1/appointments/stats",
        {
          headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
        }
      );
      setLoading(false);
      setStats(response.data.data.stats);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAppointmentsStats();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3} marginBottom={5}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="people"
                title="Total Offers"
                count={
                  loading
                    ? "Loading..."
                    : Number(stats.completedappointments) +
                      Number(stats.scheduledappointments) +
                      Number(stats.cancelledappointments)
                }
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="timer"
                title="Scheduled Offers"
                count={stats.scheduledappointments}
                color="warning"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="done"
                title="Completed Offers"
                count={stats.completedappointments}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="error"
                icon="block"
                title="Canceled Offers"
                count={stats.cancelledappointments}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
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
                  Products with Offers
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={true}
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

      {/* Offer Modal */}
      <Dialog
        open={isOfferModalOpen}
        onClose={closeOfferModal}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Offer</DialogTitle>
        <DialogContent>
          <TextField
            name="offerPercentage"
            label="Offer Percentage"
            defaultValue={oldOffer}
            value={newOffer.offerPercentage}
            onChange={(e) => setNewOffer({ ...newOffer, offerPercentage: e.target.value })}
            type="number"
            fullWidth
            margin="dense"
          />
          <TextField
            name="startDate"
            label="Start Date"
            value={newOffer.startDate}
            onChange={(e) => setNewOffer({ ...newOffer, startDate: e.target.value })}
            type="date"
            fullWidth
            margin="dense"
          />
          <TextField
            name="endDate"
            label="End Date"
            value={newOffer.endDate}
            onChange={(e) => setNewOffer({ ...newOffer, endDate: e.target.value })}
            type="date"
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeOfferModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => handleEditOffer(newOffer)} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* Confirm Deletion */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <MDTypography variant="body1" color="textSecondary">
            Are you sure you want to delete this Offer?
          </MDTypography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteOffer} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
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
    </DashboardLayout>
  );
}

export default Tables;
