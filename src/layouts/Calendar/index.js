import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import Axios from "axios";
import Cookies from "js-cookie";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDSnackbar from "components/MDSnackbar";
import "./CalendarStyles.css";
import PropTypes from "prop-types";

const locales = { "en-US": require("date-fns/locale/en-US") };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function Tables() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    severity: "",
    message: "",
    open: false,
  });

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await Axios.get(
        "http://127.0.0.1:3000/api/v1/appointments/allAppointments",
        {
          headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
        }
      );

      // Map appointments to calendar events
      const calendarEvents = response.data.data.Appointments.map((appointment) => ({
        title: `${appointment.patientfirstname} ${appointment.patientlastname} with Dr. ${appointment.doctorfirstname} ${appointment.doctorlastname} (${appointment.specialization})`,
        start: new Date(appointment.appointmentdate),
        end: new Date(appointment.appointmentdate),
        color:
          appointment.appointmentstatus === "Completed"
            ? "#28a745" // Green
            : appointment.appointmentstatus === "Scheduled"
            ? "#ffc107" // Yellow
            : "#dc3545", // Red
      }));

      setAppointments(calendarEvents);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setNotification({
        severity: "error",
        message: "Failed to load appointments.",
        open: true,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Custom event styling based on the color
  const EventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.color,
      borderRadius: "5px",
      opacity: 0.8,
      color: "white",
      display: "block",
      padding: "5px",
    };
    return { style };
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3} marginBottom={5}>
          <Grid item xs={12}>
            <Card>
              {/* Header */}
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="dark"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Appointments Calendar
                </MDTypography>
              </MDBox>

              {/* Legend Section */}
              <MDBox p={2} display="flex" justifyContent="center" flexWrap="wrap">
                <LegendItem color="#28a745" text="Completed" />
                <LegendItem color="#ffc107" text="Scheduled" />
                <LegendItem color="#dc3545" text="Cancelled" />
              </MDBox>

              {/* Calendar */}
              <MDBox p={3} style={{ height: "700px" }}>
                <Calendar
                  localizer={localizer}
                  events={appointments}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: "100%" }}
                  eventPropGetter={EventStyleGetter}
                  views={["month", "week", "day"]}
                  defaultView="month"
                  messages={{
                    today: "Today",
                    previous: "Prev",
                    next: "Next",
                  }}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      {/* Notification Snackbar */}
      <MDSnackbar
        color={notification.severity}
        icon={notification.severity === "success" ? "check" : "error"}
        title={notification.severity === "success" ? "Success" : "Error"}
        content={notification.message}
        open={notification.open}
        onClose={() => setNotification({ ...notification, open: false })}
        close={() => setNotification({ ...notification, open: false })}
        bgWhite
      />
    </DashboardLayout>
  );
}

// Legend Item Component
const LegendItem = ({ color, text }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", marginRight: "20px" }}>
      <div
        style={{
          width: "15px",
          height: "15px",
          backgroundColor: color,
          marginRight: "8px",
          borderRadius: "3px",
        }}
      ></div>
      <MDTypography variant="caption" style={{ fontWeight: "500" }}>
        {text}
      </MDTypography>
    </div>
  );
};

LegendItem.propTypes = {
  color: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default Tables;
