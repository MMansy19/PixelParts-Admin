import React, { useEffect, useState, useMemo } from "react";
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

export default function productsTableData() {
  const navigate = useNavigate();
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
    productPrice: "",
    productStackQuantity: "",
    productExpiryDate: "",
    manufacture: "",
    productDescription: "",
    activeIngredient: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const handleEditClick = (product) => {
    setEditedProduct({
      productId: product.productid,
      productName: product.productname,
      productPrice: product.productprice,
      productStackQuantity: product.productstackquantity,
      productExpiryDate: product.productexpirydate,
      manufacture: product.manufacture,
      productDescription: product.productdescription,
      activeIngredient: product.activeingredients,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditedProduct({
      productId: "",
      productName: "",
      productPrice: "",
      productStackQuantity: "",
      productExpiryDate: "",
      manufacture: "",
      productDescription: "",
      activeIngredient: [],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChangeActiveIngredients = (e) => {
    const { value } = e.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      activeIngredient: value.split(","),
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        throw new Error("Unauthorized access");
      }

      const originalProduct = products.find((p) => p.productid === editedProduct.productId);
      const updatedFields = Object.keys(editedProduct).reduce((changes, key) => {
        if (editedProduct[key] !== originalProduct[key]) {
          if (key === "productPrice" || key === "productStackQuantity") {
            changes[key] = String(editedProduct[key]);
          } else {
            changes[key] = editedProduct[key];
          }
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
        `https://mediportal-api-production.up.railway.app/api/v1/products/${editedProduct.productId}`,
        updatedFields,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotification({
        open: true,
        message: "Product updated successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating product:", error);
      setNotification({
        open: true,
        message: "Failed to update product. Please try again.",
        severity: "error",
      });
    } finally {
      fetchProducts();
      handleCloseModal();
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await Axios.get(
        "https://mediportal-api-production.up.railway.app/api/v1/products/allProducts"
      );
      const productsData = response.data.data.products;
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
      setNotification({
        open: true,
        message: "Failed to fetch products. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const Author = ({ image, name, description }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
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
            productId: "Loading...",
            Product: (
              <MDBox display="flex" justifyContent="center" alignItems="center" width="100%">
                <CircularProgress size={24} />
              </MDBox>
            ),
            price: "Loading...",
            stock: "Loading...",
            expiryDate: "Loading...",
            manufacture: "Loading...",
            description: "Loading...",
            action: "Loading...",
          },
        ]
      : products.map((product) => ({
          key: product.productid,
          productId: product.productid,
          Product: (
            <Author
              image="https://via.placeholder.com/150"
              name={product.productname}
              description={product.productdescription}
            />
          ),
          price: `$${product.productprice}`,
          stock: product.productstackquantity,
          expiryDate: new Date(product.productexpirydate).toLocaleDateString(),
          manufacture: product.manufacture,
          description: product.productdescription,
          action: (
            <Button variant="text" color="primary" onClick={() => handleEditClick(product)}>
              Edit
            </Button>
          ),
        }));
  }, [loading, products]);

  Author.propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  };

  return {
    columns: [
      { Header: "Product", accessor: "Product", width: "20%", align: "left" },
      { Header: "Product ID", accessor: "productId", width: "10%", align: "center" },
      { Header: "Price", accessor: "price", align: "left" },
      { Header: "Stock Quantity", accessor: "stock", align: "center" },
      { Header: "Expiry Date", accessor: "expiryDate", align: "center" },
      { Header: "Manufacture", accessor: "manufacture", align: "center" },
      { Header: "Description", accessor: "description", align: "left" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows: rows,

    // Edit product modal
    editedProduct,
    handleInputChange,
    handleInputChangeActiveIngredients,
    handleSaveChanges,
    isModalOpen,
    handleCloseModal,

    // Notification snackbar
    notification,
    handleCloseNotification,
  };
}
