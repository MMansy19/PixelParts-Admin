// @mui material components

// Material Dashboard 2 React components
import MDTypography from "components/MDTypography";
import { useEffect, useState } from "react";
import Axios from "axios";
import Cookies from "js-cookie";
import Button from "@mui/material/Button";

export default function data() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedProvider, setEditedProvider] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error"
  });

  const fetchProviders = async () => {
    try {
      const response = await Axios.get(
        "https://mediportal-api-production.up.railway.app/api/v1/providers/allProviders",
        {
          headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
        }
      );
      console.log(response.data.data.providers);
      setProviders(response.data.data.providers); // Assuming the providers' array is at this path
    } catch (error) {
      console.error("Error fetching providers:", error);
    } finally {
      setLoading(false); // Stop loading after fetching data
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleEditClick = (provider) => {
    setEditedProvider({
      providerName: provider.providername,
      providerLocation: provider.providerlocation,
      providerPhone: provider.providerphone,
      providerid: provider.providerid,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditedProvider(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProvider((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      // Retrieve token from cookies
      const token = Cookies.get("authToken");
      if (!token) {
        throw new Error("Unauthorized access");
      }

      // Compare editedProvider with selectedProvider and store only changed fields
      const updatedFields = Object.keys(editedProvider).reduce((changes, key) => {
        if (
          editedProvider[key] !==
          providers.find((p) => p.providerid === editedProvider.providerid)[key]
        ) {
          changes[key] = editedProvider[key];
        }
        return changes;
      }, {}); // Initialize an empty object as the accumulator

      // If no changes are detected, notify the user and exit
      if (Object.keys(updatedFields).length === 0) {
        setNotification({
          open: true,
          message: "No changes detected.",
          severity: "info",
        });
        return;
      }

      // Send the PATCH request with the updated fields
      await Axios.patch(
        `https://mediportal-api-production.up.railway.app/api/v1/insurances/provider/${editedProvider.providerid}`,
        updatedFields,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Notify user of success
      setNotification({
        open: true,
        message: "Provider updated successfully.",
        severity: "success",
      });

      // Refresh provider list and close modal
      fetchProviders();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating provider:", error);

      // Notify user of error
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to update provider. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    // Loader until data is fetched
    return {
      columns: [
        { Header: "Provider ID", accessor: "ProviderID", align: "center" },
        { Header: "Provider Name", accessor: "ProviderName", align: "center" },
        { Header: "Location", accessor: "Location", align: "center" },
        { Header: "Phone", accessor: "Phone", align: "center" },
      ],
      rows: [
        {
          ProviderID: "Loading...",
          ProviderName: "Loading...",
          Location: "Loading...",
          Phone: "Loading...",
        },
      ],
    };
  }

  return {
    columns: [
      { Header: "Provider ID", accessor: "ProviderID", align: "center" },
      { Header: "Provider Name", accessor: "ProviderName", align: "center" },
      { Header: "Location", accessor: "Location", align: "center" },
      { Header: "Phone", accessor: "Phone", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ],

    rows: providers.map((provider) => ({
      ProviderID: (
        <MDTypography component="span" variant="button" color="text" fontWeight="medium">
          {provider.providerid}
        </MDTypography>
      ),
      ProviderName: (
        <MDTypography component="span" variant="button" color="text" fontWeight="medium">
          {provider.providername}
        </MDTypography>
      ),
      Location: (
        <MDTypography component="span" variant="caption" color="text" fontWeight="medium">
          {provider.providerlocation}
        </MDTypography>
      ),
      Phone: (
        <MDTypography component="span" variant="caption" color="text" fontWeight="medium">
          {provider.providerphone || "N/A"}
        </MDTypography>
      ),
      action: (
        <Button variant="text" color="primary" onClick={() => handleEditClick(provider)}>
          Edit
        </Button>
      ),
    })),

    editedProvider,
    isModalOpen,
    notification,
    handleInputChange,
    handleCloseModal,
    handleSaveChanges,
    handleCloseNotification,
    fetchProviders,
  };
}
