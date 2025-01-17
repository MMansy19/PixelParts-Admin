import React, { useEffect, useState, useMemo } from "react";
import MDAvatar from "components/MDAvatar";
import Button from "@mui/material/Button";
import Axios from "axios";
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleOpenFileModal = (productId) => {
    setSelectedId(productId);
    setSelectedFile(null);
    setIsFileModalOpen(true);
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };
  const handleUploadImage = async () => {
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        throw new Error("Unauthorized access");
      }

      if (!selectedFile) {
        throw new Error("No file selected");
      }

      const formData = new FormData();
      formData.append("image", selectedFile);

      console.log("FormData entries:", [...formData.entries()]); // Log form data

      const response = await Axios.patch(
        `https://pixelparts-dev-api.up.railway.app/api/v1/product/editProduct/${selectedId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Upload response:", response.data);

      setNotification({
        open: true,
        message: "Image uploaded successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error uploading image:", error.response || error.message);
      setNotification({
        open: true,
        message: "Failed to upload image. Please try again.",
        severity: "error",
      });
    } finally {
      closeFileModal();
    }
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
      offerPercentage: product.offerpercentage,
      overallRating: product.overallrating,
      description: product.description,
    });
    setIsModalOpen(true);
  };

  const closeFileModal = () => {
    setIsFileModalOpen(false);
    setSelectedFile(null);
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
    setEditedProduct((prev) => ({ ...prev, [name]: value }));
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

  const handleSaveChanges = async () => {
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        throw new Error("Unauthorized access");
      }

      const originalProduct = products.find((p) => p.productid === editedProduct.productId);
      const updatedFields = Object.keys(editedProduct).reduce((changes, key) => {
        if (editedProduct[key] !== originalProduct[key]) {
          changes[key] = editedProduct[key];
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
        `https://pixelparts-dev-api.up.railway.app/api/v1/product/editProduct/${editedProduct.productId}`,
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
      fetchProducts();
      handleCloseModal();
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
          productimg: (
            <MDAvatar
              src={product.productimg || "https://via.placeholder.com/150"}
              name={product.productname}
              size="xl"
            />
          ),
          category: product.category,
          manufacture: product.manufacture,
          price: `$${product.price}`,
          stockQuantity: product.stockquantity,
          releaseDate: new Date(product.releasedate).toLocaleDateString(),
          warrantyPeriod: product.warrantyperiod ? `${product.warrantyperiod} months` : "No Period",
          offerPercentage: product.offerpercentage ? `${product.offerpercentage}%` : "No Offers",
          overallRating: parseFloat(product.overallrating).toFixed(2),
          action: (
            <div className="flex justify-center">
              <Button variant="text" color="primary" onClick={() => handleEditClick(product)}>
                Edit
              </Button>
              <Button
                variant="text"
                color="secondary"
                onClick={() => handleOpenFileModal(product.productid)}
              >
                Edit Image
              </Button>
            </div>
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
    setNotification,
    handleSaveChanges,
    handleCloseNotification,
    handleInputChange,
    handleUploadImage,
    handleFileChange,
    isFileModalOpen,
    closeFileModal,
  };
}
