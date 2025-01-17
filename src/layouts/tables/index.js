import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import MDSnackbar from "components/MDSnackbar";
import { useState } from "react";

// Data
import doctorsTableData from "layouts/tables/data/doctorsTableData";
import patientsTableData from "layouts/tables/data/patientsTableData";

function Tables() {
  const [currentPage, setCurrentPage] = useState(0);
  const {
    columns,
    rows,
    activeCount,
    pendingCount,
    blockedCount,
    isModalOpen,
    handleCloseModal,
    handleInputChange,
    handleSaveChanges,
    editedUser,
    notification,
    handleCloseNotification,
  } = doctorsTableData();
  const {
    columns: pColumns,
    rows: pRows,
    isModalOpen: isModalOpenPatients,
    handleCloseModal: handleCloseModalPatients,
    handleInputChange: handleInputChangePatients,
    handleSaveChanges: handleSaveChangesPatients,
    editedPatient,
    notification: notificationPatients,
    handleCloseNotification: handleCloseNotificationPatients,
  } = patientsTableData();

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update the current page when it changes
  };

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
                title="All Users"
                count={activeCount + pendingCount + blockedCount}
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
                title="Pending Users"
                count={pendingCount}
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
                title="Active Users"
                count={activeCount}
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
                title="Blocked Users"
                count={blockedCount}
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
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Users Table
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
          <Grid item xs={12}>
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
                  Patients Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: pColumns, rows: pRows }}
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

      {/* Modal for editing doctor */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {editedUser && (
            <>
              <TextField
                name="firstname"
                label="First Name"
                value={editedUser.firstname || ""}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
              />
              <TextField
                name="lastname"
                label="Last Name"
                value={editedUser.lastname || ""}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
              />
              <TextField
                name="specialization"
                label="Specialization"
                value={editedUser.specialization || ""}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
              />
              <TextField
                name="yearsofexperience"
                label="Years of Experience"
                type="number"
                value={editedUser.yearsofexperience || ""}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
              />
              {/* Select box for status */}
              <Select
                name="userstate"
                value={editedUser.userstate || ""}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
                style={{ marginTop: "1px", padding: "11px" }}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Blocked">Blocked</MenuItem>
              </Select>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal for editing patients */}
      <Dialog
        open={isModalOpenPatients}
        onClose={handleCloseModalPatients}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
      >
        <DialogTitle>Edit Patient</DialogTitle>
        <DialogContent>
          {editedPatient && (
            <>
              <TextField
                name="firstname"
                label="First Name"
                value={editedPatient.firstname || ""}
                onChange={handleInputChangePatients}
                fullWidth
                margin="dense"
              />
              <TextField
                name="lastname"
                label="Last Name"
                value={editedPatient.lastname || ""}
                onChange={handleInputChangePatients}
                fullWidth
                margin="dense"
              />
              <TextField
                name="email"
                label="Email"
                value={editedPatient.email || ""}
                onChange={handleInputChangePatients}
                fullWidth
                margin="dense"
              />
              <TextField
                name="phonenumber"
                label="Phone Number"
                value={editedPatient.phonenumber || ""}
                onChange={handleInputChangePatients}
                fullWidth
                margin="dense"
              />
              {/* Select box for status */}
              <Select
                name="userstate"
                value={editedPatient.userstate || ""}
                onChange={handleInputChangePatients}
                fullWidth
                margin="dense"
                style={{ marginTop: "1px", padding: "11px" }}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Blocked">Blocked</MenuItem>
              </Select>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModalPatients} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveChangesPatients} color="primary">
            Save
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
      <MDSnackbar
        color={notificationPatients.severity}
        icon={notificationPatients.severity === "success" ? "check" : "error"}
        title={notificationPatients.severity === "success" ? "Success" : "Error"}
        content={notificationPatients.message}
        open={notificationPatients.open}
        onClose={handleCloseNotificationPatients}
        close={handleCloseNotificationPatients}
        bgWhite
      />
    </DashboardLayout>
  );
}

export default Tables;
