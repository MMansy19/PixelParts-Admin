import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

// @mui material components
import { MenuItem, Select, FormControl, InputLabel, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

export default function AddUser() {
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    birthDate: "",
    password: "",
    userRole: "",
    adminId: JSON.parse(Cookies.get("userData")).userid,
  });

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error" | "info" | "warning"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleCloseNotification = () => {
    setNotification((prevState) => ({ ...prevState, open: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://mediportal-api-production.up.railway.app/api/v1/auth/register",
        userData
      );
      setLoading(false);
      console.log(response);
      if (response.status === 200) {
        setNotification({
          open: true,
          message: "User added successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      setLoading(false);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to add user. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <MDBox display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={3}>
      <MDTypography
        variant="h4"
        color="text"
        mb={3}
        style={{ fontWeight: "bold", textAlign: "center" }}
      >
        Add New User
      </MDTypography>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: "20px",
          width: "100%",
          maxWidth: "800px",
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        {/* First Name */}
        <TextField
          name="firstName"
          value={userData.firstName}
          onChange={handleInputChange}
          label="First Name"
          variant="outlined"
          fullWidth
        />

        {/* Last Name */}
        <TextField
          name="lastName"
          value={userData.lastName}
          onChange={handleInputChange}
          label="Last Name"
          variant="outlined"
          fullWidth
        />

        {/* Email */}
        <TextField
          name="email"
          value={userData.email}
          onChange={handleInputChange}
          label="Email"
          variant="outlined"
          type="email"
          fullWidth
        />

        {/* Phone Number */}
        <TextField
          name="phoneNumber"
          value={userData.phoneNumber}
          onChange={handleInputChange}
          label="Phone Number"
          variant="outlined"
          type="tel"
          fullWidth
        />

        {/* Gender */}
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Gender</InputLabel>
          <Select
            name="gender"
            value={userData.gender}
            onChange={handleInputChange}
            label="Gender"
            style={{ marginTop: "1px", padding: "11px" }}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>

        {/* Birth Date */}
        <TextField
          name="birthDate"
          value={userData.birthDate}
          onChange={handleInputChange}
          label="Birth Date"
          variant="outlined"
          type="date"
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        {/* Password */}
        <TextField
          name="password"
          value={userData.password}
          onChange={handleInputChange}
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
        />

        {/* User Role */}
        <FormControl variant="outlined" fullWidth>
          <InputLabel>User Role</InputLabel>
          <Select
            name="userRole"
            value={userData.userRole}
            onChange={handleInputChange}
            label="User Role"
            style={{ marginTop: "1px", padding: "11px" }}
          >
            <MenuItem value="Admin">Admin</MenuItem>
          </Select>
        </FormControl>

        {/* Submit Button */}
        <MDBox gridColumn="span 2">
          <MDButton
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{
              backgroundColor: "#242426",
              padding: "10px 0",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
            }}
          >
            {loading ? "Loading..." : "Add User"}
          </MDButton>
        </MDBox>
      </form>

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
    </MDBox>
  );
}
