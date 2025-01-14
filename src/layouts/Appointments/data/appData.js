import React, { useEffect, useState, useMemo } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import Button from "@mui/material/Button";
import MDSnackbar from "components/MDSnackbar";
import CircularProgress from "@mui/material/CircularProgress";
import Axios from "axios";
import PropTypes from "prop-types";
import Cookies from "js-cookie";

export default function productsTableData() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error"
  });
  const [editedProduct, setEditedProduct] = useState({
    productId: "",
    productName: "",
    category: "",
    manufacture: "",
    price: "",
    stockQuantity: "",
    specifications: "",
    releaseDate: "",
    warrantyPeriod: "",
    productImg: "",
    description: "",
    offerPercentage: "",
    overallRating: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const handleEditClick = (product) => {
    setEditedProduct({
      productId: product.productid,
      productName: product.productname,
      category: product.category,
      manufacture: product.manufacture,
      price: product.price,
      stockQuantity: product.stockquantity,
      specifications: product.specifications,
      releaseDate: product.releasedate,
      warrantyPeriod: product.warrantyperiod,
      productImg: product.productimg,
      description: product.description,
      offerPercentage: product.offerpercentage,
      overallRating: product.overallrating,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditedProduct({
      productId: "",
      productName: "",
      category: "",
      manufacture: "",
      price: "",
      stockQuantity: "",
      specifications: "",
      releaseDate: "",
      warrantyPeriod: "",
      productImg: "",
      description: "",
      offerPercentage: "",
      overallRating: "",
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

  const fetchProducts = async () => {
    try {
      const response = await Axios.get(
        "https://pixelparts-dev-api.up.railway.app/api/v1/product/allProducts",
        {
          headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
        }
      );
      setProducts(response.data.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const rows = useMemo(() => {
    return loading
      ? [
          {
            productId: "Loading...",
            productName: "Loading...",
            category: "Loading...",
            manufacture: "Loading...",
            price: "Loading...",
            stockQuantity: "Loading...",
            releaseDate: "Loading...",
            warrantyPeriod: "Loading...",
            offerPercentage: "Loading...",
            overallRating: "Loading...",
            action: "Loading...",
          },
        ]
      : products.map((product) => ({
          productId: product.productid,
          productName: product.productname, 
          productimg: <MDAvatar src={product.productimg || "https://via.placeholder.com/150"} name={product.productname} size="lg" />,
          category: product.category,
          manufacture: product.manufacture,
          price: `$${product.price}`,
          stockQuantity: product.stockquantity,
          releaseDate: new Date(product.releasedate).toLocaleDateString(),
          warrantyPeriod: `${product.warrantyperiod} months`,
          offerPercentage: `${product.offerpercentage}%`,
          overallRating: product.overallrating,
          action: (
            <Button variant="text" color="primary" onClick={() => handleEditClick(product)}>
              Edit
            </Button>
          ),
        }));
  }, [loading, products]);

  return {
    columns: [
      { Header: "Product ID", accessor: "productId", width: "10%", align: "center" },
      { Header: "product Image", accessor: "productimg", width: "10%", align: "center" },
      { Header: "Product Name", accessor: "productName", width: "20%", align: "center" },
      { Header: "Category", accessor: "category", width: "15%", align: "center" },
      { Header: "Manufacture", accessor: "manufacture", width: "15%", align: "center" },
      { Header: "Price", accessor: "price", width: "10%", align: "center" },
      { Header: "Stock Quantity", accessor: "stockQuantity", width: "10%", align: "center" },
      { Header: "Release Date", accessor: "releaseDate", width: "15%", align: "center" },
      { Header: "Warranty Period", accessor: "warrantyPeriod", width: "15%", align: "center" },
      { Header: "Offer Percentage", accessor: "offerPercentage", width: "10%", align: "center" },
      { Header: "Overall Rating", accessor: "overallRating", width: "10%", align: "center" },
      { Header: "Action", accessor: "action", width: "10%", align: "center" },
    ],
    rows,
    editedProduct,
    handleCloseModal,
    isModalOpen,
    notification,
    handleSaveChanges,
    handleCloseNotification,
  };
}
