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
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import MDSnackbar from "components/MDSnackbar";
import { useState } from "react";

// Data
import contactTableData from "layouts/contact/data/contactTableData";
import { TextField } from "@mui/material";

function Tables() {
  const [currentPage, setCurrentPage] = useState(0);
  const {
    columns,
    rows,
    isModalOpen,
    handleCloseModal,
    handleInputChange,
    handleSaveChanges,
    editedMessage,
    notification,
    handleCloseNotification,
  } = contactTableData();

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update the current page when it changes
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
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
                  Contact with Users
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

      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Answer to message</DialogTitle>
        <DialogContent>
          {editedMessage && (
            <TextField
              name="message"
              value={editedMessage.answer}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
            />
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
