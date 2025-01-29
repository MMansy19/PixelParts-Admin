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

export default function contactTableData() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedMessage, setEditedMessage] = useState(null);

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error"
  });

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const fetchMessages = async () => {
    const token = Cookies.get("authToken");
    try {
      const response = await Axios.get(
        "https://pixelparts-dev-api.up.railway.app/api/v1/message/getAllMessages",
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //make user state to be userState
      const messagesData = response.data.data.messages.map((message) => ({
        ...message,
      }));
      setMessages(messagesData);
      console.log("usersData:", messagesData);
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
    fetchMessages();
  }, []);

  const handleEditClick = (message) => {
    console.log("Editing message:", message);
    setEditedMessage({message});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditedMessage(null);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setEditedMessage((prev) => ({ ...prev, answer: value }));
  };

  const handleSaveChanges = async () => {
    try {
      // Retrieve token from cookies
      const token = Cookies.get("authToken");
      if (!token) {
        throw new Error("No authorization token found. Please log in again.");
      }

      if (!editedMessage) {
        setNotification({
          open: true,
          message: "No changes detected.",
          severity: "info",
        });
        return;
      }

      console.log("Updated fields:", editedMessage);
      // Make the API call with only updated fields
      const response = await Axios.patch(
        `https://pixelparts-dev-api.up.railway.app/api/v1/message/answerMessage/${editedMessage.messageid}`,
        { answer: editedMessage.answer },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token
          },
        }
      );

      // Fetch updated users and close the modal
      fetchMessages();
      setIsModalOpen(false);
      setNotification({
        open: true,
        message: "message updated successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating message:", error);
      setNotification({
        open: true,
        message: "Failed to update message. Please try again.",
        severity: "error",
      });
    }
  }

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
          messageId: "Loading...",
          userId: "Loading...",
          // User: (
          //   <MDBox display="flex" justifyContent="center" alignItems="center" width="100%">
          //     <CircularProgress size={24} />
          //   </MDBox>
          // ),
          message: "Loading...",
          answer: "Loading...",
          createdAt: "Loading...",
          status: (
            <MDBox ml={-1}>
              <MDBadge badgeContent="loading" color="light" variant="gradient" size="sm" />
            </MDBox>
          ),
          action: "Loading...",
        },
      ]
    : messages
    ? messages.map((message) => ({
        key: message.messageid,
        messageId: message.messageid,
        userId: message.userid,
        // User: (
        //   <Author
        //     image={user.userimg || `https://ui-avatars.com/api/?name=${user.firstname}+${user.lastname}`}
        //     name={`${user.firstname} ${user.lastname}`}
        //     username={user.username}
        //     email={user.email}
        //   />
        // ),
        message: message.message,
        answer: message.answer || "No Answer",
        createdAt: new Date(message.createdat).toLocaleDateString(),
        action: (
          <Button variant="text" color="primary" onClick={() => handleEditClick(message)}>
            Edit
          </Button>
        ),
      }))
    : 'No users to display.';
}, [loading, messages]);


  Author.propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  };

  return {
    
  columns : [
    { Header: "Message ID", accessor: "messageId", align: "center" },
    { Header: "User ID", accessor: "userId", align: "center" },
    // { Header: "User", accessor: "User", width: "35%", align: "left" },
  { Header: "Message", accessor: "message", align: "left" },
  { Header: "Answer", accessor: "answer", align: "center" },
  { Header: "Created At", accessor: "createdAt", align: "center" },
  { Header: "Action", accessor: "action", align: "center" },
  ],
  rows: rows,

    // Modal for editing user
    isModalOpen,
    handleCloseModal,
    handleInputChange,
    handleSaveChanges,
    editedMessage,

    // Notification snackbar
    notification,
    handleCloseNotification,

  };
}
