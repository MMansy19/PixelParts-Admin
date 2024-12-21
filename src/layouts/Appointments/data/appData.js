import React, { useEffect, useState, useMemo } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import MDSnackbar from "components/MDSnackbar";
import Axios from "axios";
import PropTypes from "prop-types";
import Cookies from "js-cookie";

export default function appointmentsTableData() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error"
  });

  const [editedAppointment, setEditedAppointment] = useState({
    appointmentId: "",
    appointmentDate: "",
    appointmentStatus: "",
    fees: "",
    bookingDate: "",
    paymentStatus: "",
    doctorId: "",
    doctorFirstName: "",
    doctorLastName: "",
    specialization: "",
    patientId: "",
    patientFirstName: "",
    patientLastName: "",
    locationId: "",
    workspaceId: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const handleEditClick = (appointment) => {
    setEditedAppointment({
      appointmentId: appointment.appointmentid,
      appointmentDate: appointment.appointmentdate,
      appointmentStatus: appointment.appointmentstatus,
      fees: appointment.fees,
      bookingDate: appointment.bookingdate,
      paymentStatus: appointment.paymentstatus,
      doctorId: appointment.doctorid,
      doctorFirstName: appointment.doctorfirstname,
      doctorLastName: appointment.doctorlastname,
      specialization: appointment.specialization,
      patientId: appointment.patientid,
      patientFirstName: appointment.patientfirstname,
      patientLastName: appointment.patientlastname,
      locationId: appointment.locationid,
      workspaceId: appointment.workspaceid,
    });
    console.log(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditedAppointment({
      appointmentId: "",
      appointmentDate: "",
      appointmentStatus: "",
      fees: "",
      bookingDate: "",
      paymentStatus: "",
      doctorId: "",
      doctorFirstName: "",
      doctorLastName: "",
      specialization: "",
      patientId: "",
      patientFirstName: "",
      patientLastName: "",
      locationId: "",
      workspaceId: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        throw new Error("Unauthorized access");
      }

      const originalAppointment = appointments.find(
        (a) => a.appointmentid === editedAppointment.appointmentId
      );
      const updatedFields = Object.keys(editedAppointment).reduce((changes, key) => {
        if (editedAppointment[key] !== originalAppointment[key]) {
          changes[key] = editedAppointment[key];
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

      await Axios.patch(
        `https://mediportal-api-production.up.railway.app/api/v1/appointments/${editedAppointment.appointmentId}`,
        updatedFields,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotification({
        open: true,
        message: "Appointment updated successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating appointment:", error);
      setNotification({
        open: true,
        message: "Failed to update appointment. Please try again.",
        severity: "error",
      });
    } finally {
      fetchAppointments();
      handleCloseModal();
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await Axios.get(
        "https://mediportal-api-production.up.railway.app/api/v1/appointments/allAppointments",
        {
          headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
        }
      );
      setAppointments(response.data.data.Appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const rows = useMemo(() => {
    return loading
      ? [
          {
            appointmentId: "Loading...",
            appointmentDate: "Loading...",
            appointmentStatus: "Loading...",
            fees: "Loading...",
            bookingDate: "Loading...",
            paymentStatus: "Loading...",
            doctorName: "Loading...",
            specialization: "Loading...",
            patientName: "Loading...",
            locationId: "Loading...",
            workspaceId: "Loading...",
            action: "Loading...",
          },
        ]
      : appointments.map((appointment) => ({
          appointmentId: appointment.appointmentid,
          appointmentDate: new Date(appointment.appointmentdate).toLocaleDateString(),
          appointmentStatus: appointment.appointmentstatus,
          fees: `$${appointment.fees}`,
          bookingDate: new Date(appointment.bookingdate).toLocaleDateString(),
          paymentStatus: appointment.paymentstatus,
          doctorName: `${appointment.doctorfirstname} ${appointment.doctorlastname}`,
          specialization: appointment.specialization,
          patientName: `${appointment.patientfirstname} ${appointment.patientlastname}`,
          locationId: appointment.locationid,
          workspaceId: appointment.workspaceid,
          action: (
            <Button variant="text" color="primary" onClick={() => handleEditClick(appointment)}>
              Edit
            </Button>
          ),
        }));
  }, [loading, appointments]);

  return {
    columns: [
      { Header: "Appointment ID", accessor: "appointmentId", width: "10%", align: "center" },
      { Header: "Appointment Date", accessor: "appointmentDate", width: "15%", align: "center" },
      { Header: "Status", accessor: "appointmentStatus", width: "10%", align: "center" },
      { Header: "Fees", accessor: "fees", width: "10%", align: "center" },
      { Header: "Booking Date", accessor: "bookingDate", width: "15%", align: "center" },
      { Header: "Payment Status", accessor: "paymentStatus", width: "10%", align: "center" },
      { Header: "Doctor", accessor: "doctorName", width: "15%", align: "center" },
      { Header: "Specialization", accessor: "specialization", width: "10%", align: "center" },
      { Header: "Patient", accessor: "patientName", width: "15%", align: "center" },
      { Header: "Location ID", accessor: "locationId", width: "10%", align: "center" },
      { Header: "Workspace ID", accessor: "workspaceId", width: "10%", align: "center" },
      { Header: "Action", accessor: "action", width: "10%", align: "center" },
    ],
    rows: rows,
    editedAppointment,
    handleInputChange,
    handleSaveChanges,
    isModalOpen,
    handleCloseModal,
    notification,
    handleCloseNotification,
  };
}
