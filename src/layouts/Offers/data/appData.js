import React, { useEffect, useState, useMemo } from "react";
import MDAvatar from "components/MDAvatar";
import Button from "@mui/material/Button";
import Axios from "axios";
import Cookies from "js-cookie";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (e) => {
    setImagePreview(URL.createObjectURL(e.target.files[0]));
    setSelectedFile(e.target.files[0]);
  };

  const handleOpenFileModal = (productId) => {
    setSelectedId(productId);
    setSelectedFile(null);
    setIsFileModalOpen(true);
  };

  const openDeleteModal = (productId) => {
    setSelectedId(productId);
    setIsDeleteModalOpen(true);
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

  const handleAddOffer = async (newOffer) => {
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        throw new Error("Unauthorized access");
      }

      if (newOffer.offerPercentage < 0 || newOffer.offerPercentage > 100) {
        throw new Error("Invalid offer percentage");
      }

      if (new Date(newOffer.startDate) > new Date(newOffer.endDate)) {
        throw new Error("Invalid date range");
      }

      const response = await Axios.post(
        `https://pixelparts-dev-api.up.railway.app/api/v1/offer/addOffer/${selectedId}`,
        newOffer,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Add offer response:", response.data);

      setNotification({
        open: true,
        message: "Offer added successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error adding offer:", error.response || error.message);
      setNotification({
        open: true,
        message: "Failed to add offer. Please try again.",
        severity: "error",
      });
    } finally {
      closeOfferModal();
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
  const handleOpenOfferModal = (productId) => {
    setSelectedId(productId);
    setIsOfferModalOpen(true);
  };

  const closeFileModal = () => {
    setIsFileModalOpen(false);
    setSelectedFile(null);
  };

  const closeOfferModal = () => {
    setIsOfferModalOpen(false);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
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

  
  const handleDeleteProduct = async () => {
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        throw new Error("Unauthorized access");
      }
      await Axios.delete(
        `https://pixelparts-dev-api.up.railway.app/api/v1/product/deleteProduct/${selectedId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotification({
        open: true,
        message: "Product deleted successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      setNotification({ open: true,
        message: "Failed to delete product. Please try again.",
        severity: "error",
      });
    } finally {
      closeDeleteModal();
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
        message: "Products updated successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating products:", error);
      setNotification({
        open: true,
        message: "Failed to update products. Please try again.",
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
              <Button
                variant="text"
                color="secondary"
                onClick={() => handleOpenOfferModal(product.productid)}
              >
                Add Offer
              </Button>
              <IconButton aria-label="delete" size="small"
                onClick={() => openDeleteModal(product.productid)}   
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>

            </div>
          ),
        }));
  }, [loading, products]);

  return {
    columns: [
      { Header: "Product ID", accessor: "productId", width: "10%", align: "center" },
      { Header: "product Image", accessor: "productimg", width: "10%", align: "center" },
      { Header: "Product Name", accessor: "productName", width: "15%", align: "center" },
      { Header: "Category", accessor: "category", width: "15%", align: "center" },
      { Header: "Manufacture", accessor: "manufacture", width: "15%", align: "center" },
      { Header: "Price", accessor: "price", width: "5%", align: "center" },
      { Header: "Stock Quantity", accessor: "stockQuantity", width: "5%", align: "center" },
      { Header: "Release Date", accessor: "releaseDate", width: "10%", align: "center" },
      { Header: "Warranty Period", accessor: "warrantyPeriod", width: "5%", align: "center" },
      { Header: "Offer Percentage", accessor: "offerPercentage", width: "5%", align: "center" },
      { Header: "Overall Rating", accessor: "overallRating", width: "5%", align: "center" },
      { Header: "Action", accessor: "action", width: "15%", align: "center" },
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
    imagePreview,
    handleDeleteProduct,
    isDeleteModalOpen,
    closeDeleteModal,
    isOfferModalOpen,
    handleAddOffer,
    closeOfferModal,
  };

}
