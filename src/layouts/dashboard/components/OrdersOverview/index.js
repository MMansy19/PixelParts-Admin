// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "examples/Timeline/TimelineItem";
import Axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

function OrdersOverview() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    const token = Cookies.get("authToken");
    try {
      const response = await Axios.get(
        "http://127.0.0.1:3000/api/v1/appointments/allAppointments?limit=5&order=appointmentDate",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments(response.data.data.Appointments);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Appointments Overview
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            <MDTypography display="inline" variant="body2" verticalAlign="middle">
              <Icon sx={{ color: ({ palette: { success } }) => success.main }}>arrow_upward</Icon>
            </MDTypography>
            &nbsp;
            <MDTypography variant="button" color="text" fontWeight="medium">
              24%
            </MDTypography>{" "}
            this month
          </MDTypography>
        </MDBox>
      </MDBox>

      {loading ? (
        <MDBox display="flex" justifyContent="center" alignItems="center" height="100%">
          <Icon sx={{ fontSize: 40 }}>hourglass_empty</Icon>
        </MDBox>
      ) : (
        <MDBox p={2}>
          {appointments.map((appointment, index) => (
            <TimelineItem
              key={appointment.appointmentid}
              color={
                appointment.appointmentstatus === "Scheduled"
                  ? "info"
                  : appointment.appointmentstatus === "Completed"
                  ? "success"
                  : "error"
              }
              icon="notifications"
              title={`Appointment with Dr. ${appointment.doctorfirstname} ${appointment.doctorlastname} for ${appointment.patientfirstname} ${appointment.patientlastname}`}
              dateTime={new Date(appointment.appointmentdate).toLocaleString()}
            />
          ))}
        </MDBox>
      )}
    </Card>
  );
}

export default OrdersOverview;
