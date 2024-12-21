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

export default function doctorsTableData() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCount, setActiveCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [blockedCount, setBlockedCount] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedDoctor, setEditedDoctor] = useState(null);

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error"
  });

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const fetchDoctors = async () => {
    try {
      const response = await Axios.get(
        "https://mediportal-api-production.up.railway.app/api/v1/doctors/allDoctors"
      );
      const doctorsData = response.data.data.doctors;
      setDoctors(doctorsData);
      setActiveCount(doctorsData.filter((doctor) => doctor.userstate === "Active").length);
      setPendingCount(doctorsData.filter((doctor) => doctor.userstate === "Pending").length);
      setBlockedCount(doctorsData.filter((doctor) => doctor.userstate === "Blocked").length);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setNotification({
        open: true,
        message: "Failed to fetch doctors. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleEditClick = (doctor) => {
    setSelectedDoctor(doctor);
    setEditedDoctor({ ...doctor });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
    setEditedDoctor(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      // Retrieve token from cookies
      const token = Cookies.get("authToken");
      if (!token) {
        throw new Error("No authorization token found. Please log in again.");
      }

      // Determine changed fields by comparing `editedDoctor` with `selectedDoctor`
      const updatedFields = Object.keys(editedDoctor).reduce((changes, key) => {
        if (editedDoctor[key] !== selectedDoctor[key]) {
          changes[key] = editedDoctor[key];
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
        `https://mediportal-api-production.up.railway.app/api/v1/doctors/${editedDoctor.userid}`,
        updatedFields,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token
          },
        }
      );

      // Fetch updated doctors and close the modal
      fetchDoctors();
      setIsModalOpen(false);
      setNotification({
        open: true,
        message: "Doctor updated successfully!",
        severity: "success",
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized access - redirecting to login.");
        navigate("/authentication/sign-in");
      } else {
        console.error("Failed to update doctor:", error);
        setNotification({
          open: true,
          message: error.response?.data?.message || "Failed to update doctor. Please try again.",
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
            doctorId: "Loading...",
            Doctor: (
              <MDBox display="flex" justifyContent="center" alignItems="center" width="100%">
                <CircularProgress size={24} />
              </MDBox>
            ),
            specialization: "Loading...",
            status: (
              <MDBox ml={-1}>
                <MDBadge badgeContent="loading" color="light" variant="gradient" size="sm" />
              </MDBox>
            ),
            employed: "Loading...",
            action: "Loading...",
          },
        ]
      : doctors.map((doctor) => ({
          key: doctor.userid,
          doctorId: doctor.userid,
          Doctor: (
            <Author
              image="https://via.placeholder.com/150"
              name={`${doctor.firstname} ${doctor.lastname}`}
              email={doctor.email}
            />
          ),
          specialization: doctor.specialization,
          status: (
            <MDBadge
              badgeContent={doctor.userstate}
              color={
                doctor.userstate === "Active"
                  ? "success"
                  : doctor.userstate === "Pending"
                  ? "warning"
                  : "error"
              }
              variant="gradient"
              size="sm"
            />
          ),
          employed: new Date(doctor.createdat).toLocaleDateString(),
          action: (
            <Button variant="text" color="primary" onClick={() => handleEditClick(doctor)}>
              Edit
            </Button>
          ),
        }));
  }, [loading, doctors]);

  Author.propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  };

  return {
    columns: [
      { Header: "Doctor", accessor: "Doctor", width: "35%", align: "left" },
      { Header: "Doctor ID", accessor: "doctorId", width: "15%", align: "center" },
      { Header: "Specialization", accessor: "specialization", align: "left" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Employed", accessor: "employed", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows: rows,
    activeCount,
    pendingCount,
    blockedCount,

    // Modal for editing doctor
    isModalOpen,
    handleCloseModal,
    handleInputChange,
    handleSaveChanges,
    editedDoctor,

    // Notification snackbar
    notification,
    handleCloseNotification,
  };
}
