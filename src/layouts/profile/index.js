import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import Header from "layouts/profile/components/Header";

import Cookies from "js-cookie";
import Axios from "axios";
import MDSnackbar from "components/MDSnackbar";

function Overview() {
  const [userData, setUserData] = useState({});
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
    oldPassword: "",
    newPassword: "",
  });

  // Fetch user data from cookies
  useEffect(() => {
    const user = Cookies.get("userData");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserData(parsedUser);
      setFormData(parsedUser);
    }
  }, []);

  // Handle input changes in the modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle modal visibility
  const handleEditButtonClick = () => {
    console.log("Button Clicked");
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Handle closing notification
  const handleCloseNotification = () => {
    setNotification((prevState) => ({ ...prevState, open: false }));
  };

  // Handle saving changes
  const handleSaveChanges = () => {
    setUserData(formData);
    try {
      console.log(formData);
      const response = Axios.patch(
        "https://mediportal-api-production.up.railway.app/api/v1/auth/updateMe",
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        }
      );
      console.log(response);
      Cookies.set("userData", JSON.stringify(formData)); // Update cookie data
      setNotification({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to update profile. Please try again.",
        severity: "error",
      });
    } finally {
      setOpenModal(false);
    }
  };

  const handleSavePassword = () => {
    try {
      Axios.patch(
        "https://mediportal-api-production.up.railway.app/api/v1/auth/updatePassword", // Update password
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
        }
      );
      setNotification({
        open: true,
        message: "Password updated successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to update password. Please try again.",
        severity: "error",
      });
    } finally {
      setOpenModal(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header userData={userData}>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              <ProfileInfoCard
                title="Profile Information"
                description="Hi, I’m Alec Thompson. Update your details below."
                info={{
                  fullName: `${userData.firstname} ${userData.lastname}`,
                  mobile: `${userData.phonenumber}`,
                  email: `${userData.email}`,
                }}
                social={[
                  {
                    link: "https://www.facebook.com/CreativeTim/",
                    icon: <FacebookIcon />,
                    color: "facebook",
                  },
                  {
                    link: "https://twitter.com/creativetim",
                    icon: <TwitterIcon />,
                    color: "twitter",
                  },
                  {
                    link: "https://www.instagram.com/creativetimofficial/",
                    icon: <InstagramIcon />,
                    color: "instagram",
                  },
                ]}
                action={{ route: "", tooltip: "Edit Profile", onClick: handleEditButtonClick }}
                shadow={false}
              />
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
          </Grid>
        </MDBox>
      </Header>

      {/* Edit Profile Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="First Name"
            name="firstname"
            value={formData.firstname}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Last Name"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Phone Number"
            name="phonenumber"
            value={formData.phonenumber}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Old Password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="New Password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} color="primary">
            Save
          </Button>
          <Button onClick={handleSavePassword} color="primary">
            Update Password
          </Button>
        </DialogActions>
      </Dialog>

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

      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
