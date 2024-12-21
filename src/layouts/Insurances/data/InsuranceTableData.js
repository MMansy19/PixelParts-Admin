// @mui material components

// Material Dashboard 2 React components
import MDTypography from "components/MDTypography";
import { useEffect, useState } from "react";
import Axios from "axios";
import Cookies from "js-cookie";

export default function data() {
  const [insurances, setInsurances] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInsurances = async () => {
    try {
      const response = await Axios.get("http://127.0.0.1:3000/api/v1/insurances/allInsurances", {
        headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
      });
      console.log(response.data.data.Insurances);
      setInsurances(response.data.data.Insurances); // Adjusted path to fit your sample data
    } catch (error) {
      console.error("Error fetching insurances:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsurances();
  }, []);

  const formatWorkspaces = (workspaces) => {
    if (!workspaces || workspaces.length === 0) return "No Workspaces";
    return workspaces
      .map((ws) =>
        ws.workSpaceId ? `${ws.workSpaceName} (${ws.workSpaceType || "N/A"})` : "No Workspace Data"
      )
      .join(", ");
  };

  if (loading) {
    return {
      columns: [
        { Header: "Insurance ID", accessor: "InsuranceID", align: "center" },
        { Header: "Start Date", accessor: "StartDate", align: "center" },
        { Header: "Provider ID", accessor: "ProviderID", align: "center" },
        { Header: "Workspaces", accessor: "Workspaces", align: "center" },
        { Header: "Duration", accessor: "Duration", align: "center" },
        { Header: "Inurance Name", accessor: "InsuranceName", align: "center" },
      ],
      rows: [
        {
          InsuranceID: "Loading...",
          ProviderID: "Loading...",
          StartDate: "Loading...",
          Duration: "Loading...",
          Workspaces: "Loading...",
          InsuranceName: "Loading...",
        },
      ],
    };
  }

  return {
    columns: [
      { Header: "Insurance ID", accessor: "InsuranceID", align: "center" },
      { Header: "Provider ID", accessor: "ProviderID", align: "center" },
      { Header: "Start Date", accessor: "StartDate", align: "center" },
      { Header: "Duration", accessor: "Duration", align: "center" },
      { Header: "Workspaces", accessor: "Workspaces", align: "left" },
      { Header: "Insurance Name", accessor: "InsuranceName", align: "center" },
    ],

    rows: insurances.map((insurance) => ({
      InsuranceID: (
        <MDTypography
          component="span"
          variant="button"
          color="text"
          fontWeight="medium"
          align="center"
        >
          {insurance.insuranceid}
        </MDTypography>
      ),
      StartDate: (
        <MDTypography
          component="span"
          variant="caption"
          color="text"
          fontWeight="medium"
          align="center"
        >
          {new Date(insurance.startdate).toLocaleDateString()}
        </MDTypography>
      ),
      ProviderID: (
        <MDTypography
          component="span"
          variant="caption"
          color="text"
          fontWeight="medium"
          align="center"
        >
          {insurance.providerid}
        </MDTypography>
      ),
      Duration: (
        <MDTypography
          component="span"
          variant="caption"
          color="text"
          fontWeight="medium"
          align="center"
        >
          {insurance.duration.years}
        </MDTypography>
      ),
      Workspaces: (
        <MDTypography
          component="span"
          variant="caption"
          color="text"
          fontWeight="medium"
          align="left"
        >
          {formatWorkspaces(insurance.workspaces)}
        </MDTypography>
      ),
      InsuranceName: (
        <MDTypography
          component="span"
          variant="caption"
          color="text"
          fontWeight="medium"
          align="center"
        >
          {insurance.insurancename}
        </MDTypography>
      ),
    })),
  };
}
