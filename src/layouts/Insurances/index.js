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
import Card from "@mui/material/Card";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import MDSnackbar from "components/MDSnackbar";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { useState } from "react";
import Axios from "axios";
import Cookies from "js-cookie";

// Data
import ProvidersTableData from "layouts/Insurances/data/ProvidersTableData";
import InsuranceTableData from "layouts/Insurances/data/InsuranceTableData";
import { Iron } from "@mui/icons-material";

function Insurances() {
  const {
    columns: pColumns,
    rows: pRows,
    editedProvider,
    isModalOpen,
    notification: editNotification,
    handleInputChange,
    handleCloseModal,
    handleSaveChanges,
    handleCloseNotification,
  } = ProvidersTableData();

  const { columns: iColumns, rows: iRows } = InsuranceTableData();

  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [isInuranceModalOpen, setIsInsuranceModalOpen] = useState(false);
  const [providerId, setProviderIs] = useState(null);
  const [newProvider, setNewProvider] = useState({
    providerName: "",
    providerLocation: "",
    providerPhone: "",
  });
  const [newInsurance, setNewInsurance] = useState({
    insuranceName: "",
    startDate: "",
    duration: "",
    providerId: "",
  });

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error"
  });

  const handleOpenModal = () => {
    setIsProviderModalOpen(true);
  };

  const handleOpenInsuranceModal = () => {
    setIsInsuranceModalOpen(true);
  };

  const handleInoutChangeNewProvider = (e) => {
    const { name, value } = e.target;
    setNewProvider({
      ...newProvider,
      [name]: value,
    });
  };

  const handleInoutChangeNewInsurance = (e) => {
    const { name, value } = e.target;
    setNewInsurance({
      ...newInsurance,
      [name]: value,
    });
  };

  const handleCloseAddProviderModal = () => {
    setIsProviderModalOpen(false);
    setNewProvider({
      providerName: "",
      providerLocation: "",
      providerPhone: "",
    });
  };

  const handleCloseAddInsuranceModal = () => {
    setIsInsuranceModalOpen(false);
    setNewInsurance({
      insuranceName: "",
      startDate: "",
      duration: "",
      providerId: "",
    });
  };

  const handleSaveProvider = async () => {
    try {
      const response = await Axios.post(
        "http://127.0.0.1:3000/api/v1/insurances/provider",
        newProvider,
        {
          headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
        }
      );

      // fetchProviders();
      if (response.status === 200) {
        setNotification({
          open: true,
          message: "Provider added successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error adding provider:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to add provider. Please try again.",
        severity: "error",
      });
    } finally {
      handleCloseAddProviderModal();
    }
  };

  const handleSaveInsurance = async () => {
    try {
      const response = await Axios.post(
        `http://127.0.0.1:3000/api/v1/insurances/${providerId}`,
        newInsurance,
        {
          headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
        }
      );
      setNotification({
        open: true,
        message: "Insurance added successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error adding insurance:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to add Insurance. Please try again.",
        severity: "error",
      });
    } finally {
      handleCloseAddInsuranceModal();
    }
  };

  const handleCloseAddNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleCloseAddInsurance = () => {
    setIsInsuranceModalOpen(false);
    setNotification({ ...notification, open: false });
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
                bgColor="dark"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Insurance Providers
                </MDTypography>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleOpenModal}
                  sx={{
                    borderRadius: 2,
                    fontSize: 14,
                    padding: "6px 16px",
                    color: "black",
                  }}
                >
                  Add Provider
                </Button>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: pColumns, rows: pRows }}
                  isSorted={true}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={6} marginTop={3}>
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
                  Available Insurances
                </MDTypography>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleOpenInsuranceModal}
                  sx={{
                    borderRadius: 2,
                    fontSize: 14,
                    padding: "6px 16px",
                    color: "black",
                  }}
                >
                  Add Insurance
                </Button>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: iColumns, rows: iRows }}
                  isSorted={true}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      {/* Add Provider Modal */}
      <Dialog
        open={isProviderModalOpen}
        onClose={handleCloseAddProviderModal}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
      >
        <DialogTitle>Add New Provider</DialogTitle>
        <DialogContent>
          {/* Product Fields */}
          <TextField
            name="providerName"
            label="Provider Name"
            value={newProvider.providerName}
            onChange={handleInoutChangeNewProvider}
            fullWidth
            margin="dense"
          />
          <TextField
            name="providerLocation"
            label="Provider Location"
            value={newProvider.providerLocation}
            onChange={handleInoutChangeNewProvider}
            fullWidth
            margin="dense"
          />
          <TextField
            name="providerPhone"
            label="Provider Phone"
            value={newProvider.providerPhone}
            onChange={handleInoutChangeNewProvider}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddProviderModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveProvider} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal for editing Provider */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
      >
        <DialogTitle>Edit Provider</DialogTitle>
        <DialogContent>
          {editedProvider && (
            <>
              <TextField
                name="providerName"
                label="Provider Name"
                value={editedProvider.providerName || ""}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
              />
              <TextField
                name="providerLocation"
                label="Provider Location"
                value={editedProvider.providerLocation || ""}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
              />
              <TextField
                name="providerPhone"
                label="Phone Number"
                value={editedProvider.providerPhone || ""}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
              />
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

      {/* Add Insurance Modal */}
      <Dialog
        open={isInuranceModalOpen}
        onClose={handleCloseAddInsuranceModal}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
      >
        <DialogTitle>Add New Insurance</DialogTitle>
        <DialogContent>
          {/* Product Fields */}
          <TextField
            name="insuranceName"
            label="Insurance Name"
            value={newInsurance.insuranceName}
            onChange={handleInoutChangeNewInsurance}
            fullWidth
            margin="dense"
          />
          <TextField
            name="duration"
            label="Duration"
            placeholder="Write in format x years y months z days"
            value={newInsurance.duration}
            onChange={handleInoutChangeNewInsurance}
            fullWidth
            margin="dense"
          />
          <TextField
            name="workspaceId"
            label="WorkSpace Id"
            value={newInsurance.workspaceId}
            onChange={handleInoutChangeNewInsurance}
            fullWidth
            margin="dense"
          />
          {/* date Field */}
          <TextField
            name="startDate"
            value={newInsurance.startDate}
            onChange={handleInoutChangeNewInsurance}
            fullWidth
            margin="dense"
            type="date"
          />
          <TextField
            name="providerId"
            label="Provider ID"
            value={providerId}
            onChange={(e) => {
              setProviderIs(e.target.value);
            }}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddInsurance} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveInsurance} color="primary">
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
        onClose={handleCloseAddNotification}
        close={handleCloseAddNotification}
        bgWhite
      />

      <MDSnackbar
        color={editNotification?.severity}
        icon={editNotification?.severity === "success" ? "check" : "error"}
        title={editNotification?.severity === "success" ? "Success" : "Error"}
        content={editNotification?.message}
        open={editNotification?.open}
        onClose={handleCloseNotification}
        close={handleCloseNotification}
        bgWhite
      />
    </DashboardLayout>
  );
}

export default Insurances;
