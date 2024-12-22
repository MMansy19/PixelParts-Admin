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

export default function categoriesTableData() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error"
  });

  const [editedCategory, setEditedCategory] = useState({
    categoryId: "",
    categoryName: "",
    categoryDescription: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleOpenFileModal = (category) => {
    setSelectedId(category.categoryid);
    setSelectedFile(null);
    setIsFileModalOpen(true);
  };

  const closeFileModal = () => {
    setIsFileModalOpen(false);
    setSelectedFile(null);
  };

  const handleUploadImage = async () => {
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        throw new Error("Unauthorized access");
      }
      const formData = new FormData();
      formData.append("image", selectedFile);
      console.log(selectedFile);
      const response = await Axios.patch(
        `https://mediportal-api-production.up.railway.app/api/v1/categories/${selectedId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setNotification({
        open: true,
        message: "Image uploaded successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      setNotification({
        open: true,
        message: "Failed to upload image. Please try again.",
        severity: "error",
      });
    } finally {
      closeFileModal();
    }
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const handleEditClick = (category) => {
    setEditedCategory({
      categoryId: category.categoryid,
      categoryName: category.categoryname,
      categoryDescription: category.categorydescription,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditedCategory({
      categoryId: "",
      categoryName: "",
      categoryDescription: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const token = Cookies.get("authToken");
      if (!token) throw new Error("Unauthorized access");

      await Axios.patch(
        `https://mediportal-api-production.up.railway.app/api/v1/categories/${editedCategory.categoryId}`,
        editedCategory,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsModalOpen(false);
      setNotification({
        open: true,
        message: "Category updated successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating category:", error);
      setNotification({
        open: true,
        message: "Failed to update category. Please try again.",
        severity: "error",
      });
    } finally {
      fetchCategories();
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await Axios.get(
        "https://mediportal-api-production.up.railway.app/api/v1/categories/allCategories"
      );
      const categoriesData = response.data.data.categories;
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setNotification({
        open: true,
        message: "Failed to fetch categories. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const Author = ({ name, description }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src="https://via.placeholder.com/150" name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{description}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const rows = useMemo(() => {
    return loading
      ? [
          {
            categoryId: "Loading...",
            Category: (
              <MDBox display="flex" justifyContent="center" alignItems="center" width="100%">
                <CircularProgress size={24} />
              </MDBox>
            ),
            description: "Loading...",
            action: "Loading...",
          },
        ]
      : categories.map((category) => ({
          key: category.categoryid,
          categoryId: category.categoryid,
          Category: (
            <Author name={category.categoryname} description={category.categorydescription} />
          ),
          description: category.categorydescription,
          action: (
            <div className="flex justify-center">
              <Button variant="text" color="primary" onClick={() => handleEditClick(product)}>
                Edit
              </Button>
              <Button
                variant="text"
                color="secondary"
                onClick={() => handleOpenFileModal(category)}
              >
                Edit Image
              </Button>
            </div>
          ),
        }));
  }, [loading, categories]);

  Author.propTypes = {
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  };

  return {
    columns: [
      { Header: "Category", accessor: "Category", width: "20%", align: "left" },
      { Header: "Category ID", accessor: "categoryId", width: "10%", align: "center" },
      { Header: "Description", accessor: "description", align: "left" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows: rows,

    // Modal state
    isModalOpen,
    editedCategory,
    handleCloseModal,
    handleInputChange,
    handleSaveChanges,

    // File upload modal
    selectedFile,
    handleFileChange,
    handleUploadImage,
    isFileModalOpen,
    closeFileModal,

    // Notification snackbar
    notification,
    handleCloseNotification,
  };
}
