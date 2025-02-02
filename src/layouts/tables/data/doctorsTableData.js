import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import MDSnackbar from "components/MDSnackbar";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useMemo } from "react";

export default function usersTableData() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCount, setActiveCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [blockedCount, setBlockedCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedUser, setEditedUser] = useState(null);

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error"
  });

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const fetchusers = async () => {
    const token = Cookies.get("authToken");
    try {
      const response = await Axios.get(
        "https://pixelparts-dev-api.up.railway.app/api/v1/user/getAllUsers",
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //make user state to be userState
      const usersData = response.data.data.users.map((user) => ({
        ...user,
        userState: user.userstate,
      }));
      setUsers(usersData);
      console.log("usersData:", usersData);
      setActiveCount(usersData.filter((user) => user.userState === "Active").length);
      setPendingCount(usersData.filter((user) => user.userState === "Pending").length);
      setBlockedCount(usersData.filter((user) => user.userState === "Blocked").length);
    } catch (error) {
      console.error("Error fetching users:", error);
      setNotification({
        open: true,
        message: "Failed to fetch users. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchusers();
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditedUser({
      userid: user.userid,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phonenumber: user.phonenumber,
      birthdate: user.birthdate,
      userState: user.userState,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setEditedUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSaveChanges = async () => {
    try {
      // Retrieve token from cookies
      const token = Cookies.get("authToken");
      if (!token) {
        throw new Error("No authorization token found. Please log in again.");
      }

      // Determine changed fields by comparing `editedUser` with `selectedUser`
      const updatedFields = Object.keys(editedUser).reduce((changes, key) => {
        if (editedUser[key] !== selectedUser[key]) {
          changes[key] = editedUser[key];
        }
        return changes;
      }, {});

      if (Object.keys(updatedFields).length === 0) {
        setNotification({
          open: true,
          message: "No changes detected.",
          severity: "info",
        });
        return;
      }

      console.log("Updated fields:", updatedFields);
      // Make the API call with only updated fields
      const response = await Axios.patch(
        `https://pixelparts-dev-api.up.railway.app/api/v1/user/updateUser/${editedUser.userid}`,
        updatedFields,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token
          },
        }
      );

      // Fetch updated users and close the modal
      fetchusers();
      setIsModalOpen(false);
      setNotification({
        open: true,
        message: "user updated successfully!",
        severity: "success",
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized access - redirecting to login.");
        navigate("/authentication/sign-in");
      } else {
        console.error("Failed to update user:", error);
        setNotification({
          open: true,
          message: error.response?.data?.message || "Failed to update user. Please try again.",
          severity: "error",
        });
      }
    }
  };

  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const rows = useMemo(() => {
    return loading
      ? [
          {
            userId: "Loading...",
            User: (
              <MDBox display="flex" justifyContent="center" alignItems="center" width="100%">
                <CircularProgress size={24} />
              </MDBox>
            ),
            phoneNumber: "Loading...",
            email: "Loading...",
            birthdate: "Loading...",
            createdAt: "Loading...",
            status: (
              <MDBox ml={-1}>
                <MDBadge badgeContent="loading" color="light" variant="gradient" size="sm" />
              </MDBox>
            ),
            action: "Loading...",
          },
        ]
      : users
      ? users.map((user) => ({
          key: user.userid,
          userId: user.userid,
          User: (
            <Author
              image={
                user.userimg ||
                `https://ui-avatars.com/api/?name=${user.firstname}+${user.lastname}`
              }
              name={`${user.firstname} ${user.lastname}`}
              username={user.username}
              email={user.email}
            />
          ),
          phoneNumber: user.phonenumber,
          email: user.email,
          birthdate: new Date(user.birthdate).toLocaleDateString(),
          createdAt: new Date(user.createdat).toLocaleDateString(),
          status: (
            <MDBadge
              badgeContent={user.userState}
              color={
                user.userState === "Active"
                  ? "success"
                  : user.userState === "Pending"
                  ? "warning"
                  : "error"
              }
              variant="gradient"
              size="sm"
            />
          ),
          action: (
            <Button variant="text" color="primary" onClick={() => handleEditClick(user)}>
              Edit
            </Button>
          ),
        }))
      : "No users to display.";
  }, [loading, users]);

  Author.propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  };

  return {
    columns: [
      { Header: "User", accessor: "User", width: "35%", align: "left" },
      { Header: "User ID", accessor: "userId", width: "15%", align: "center" },
      { Header: "Phone Number", accessor: "phoneNumber", align: "left" },
      { Header: "Email", accessor: "email", align: "left" },
      { Header: "Birthdate", accessor: "birthdate", align: "center" },
      { Header: "Created At", accessor: "createdAt", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows: rows,
    activeCount,
    pendingCount,
    blockedCount,

    // Modal for editing user
    isModalOpen,
    handleCloseModal,
    handleInputChange,
    handleSaveChanges,
    editedUser,

    // Notification snackbar
    notification,
    handleCloseNotification,
  };
}
