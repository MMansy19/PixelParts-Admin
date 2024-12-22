import React, { useEffect, useState, useMemo } from "react";
import Axios from "axios";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDAvatar from "components/MDAvatar";
import MDTypography from "components/MDTypography";
import Button from "@mui/material/Button";
import MDBadge from "components/MDBadge";
import CircularProgress from "@mui/material/CircularProgress";

export default function patientsTableData() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedPatient, setEditedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error"
  });

  const fetchPatients = async () => {
    try {
      const response = await Axios.get(
        "https://mediportal-api-production.up.railway.app/api/v1/patients/allPatients",
        {
          headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
        }
      );
      setPatients(response.data.data.patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setNotification({
        open: true,
        message: "Failed to fetch patients. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleEditClick = (patient) => {
    setEditedPatient({ ...patient });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditedPatient(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        throw new Error("No authorization token found. Please log in again.");
      }

      // Detect changed fields
      const updatedFields = Object.keys(editedPatient).reduce((changes, key) => {
        if (editedPatient[key] !== patients.find((p) => p.userid === editedPatient.userid)[key]) {
          changes[key] = editedPatient[key];
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

      // Make API call to update patient
      await Axios.patch(
        `https://mediportal-api-production.up.railway.app/api/v1/patients/${editedPatient.userid}`,
        updatedFields,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotification({
        open: true,
        message: "Patient updated successfully!",
        severity: "success",
      });

      fetchPatients(); // Refresh patients
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update patient:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to update patient. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const Patient = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" variant="rounded" />
      <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  Patient.propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  };

  const rows = useMemo(() => {
    return loading
      ? [
          {
            Patient: (
              <MDBox display="flex" justifyContent="center" alignItems="center" width="100%">
                <CircularProgress size={24} />
              </MDBox>
            ),
            ID: "Loading...",
            Gender: "Loading...",
            Email: "Loading...",
            Wallet: "Loading...",
            Birthdate: "Loading...",
            BloodType: "Loading...",
            ChronicDisease: "Loading...",
            action: "Loading...",
          },
        ]
      : patients.map((patient) => ({
          Patient: (
            <Patient
              image={patient.userimg || "https://via.placeholder.com/150"} // Placeholder for patient image
              name={`${patient.firstname} ${patient.lastname}`}
            />
          ),
          ID: patient.userid,
          Gender: patient.gender,
          Email: patient.email,
          Wallet: `$${patient.wallet}`,
          status: (
            <MDBadge
              badgeContent={patient.userstate}
              color={
                patient.userstate === "Active"
                  ? "success"
                  : patient.userstate === "Pending"
                  ? "warning"
                  : "error"
              }
              variant="gradient"
              size="sm"
            />
          ),
          Birthdate: new Date(patient.birthdate).toLocaleDateString(),
          BloodType: patient.bloodtype,
          ChronicDisease: patient.chronicdisease || "None",
          action: (
            <Button variant="text" color="primary" onClick={() => handleEditClick(patient)}>
              Edit
            </Button>
          ),
        }));
  }, [patients, loading]);

  return {
    columns: [
      { Header: "Patient", accessor: "Patient", width: "25%", align: "left" },
      { Header: "ID", accessor: "ID", align: "center" },
      { Header: "Gender", accessor: "Gender", align: "center" },
      { Header: "Email", accessor: "Email", align: "center" },
      { Header: "Wallet", accessor: "Wallet", align: "center" },
      { Header: "Birthdate", accessor: "Birthdate", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Blood Type", accessor: "BloodType", align: "center" },
      { Header: "Chronic Disease", accessor: "ChronicDisease", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows,

    // State and handlers for editing
    isModalOpen,
    handleCloseModal,
    handleInputChange,
    handleSaveChanges,
    editedPatient,

    // Notification snackbar
    notification,
    handleCloseNotification,
  };
}
