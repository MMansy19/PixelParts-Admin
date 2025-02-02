import React, { useEffect, useState, useMemo } from "react";
import MDAvatar from "components/MDAvatar";
import Axios from "axios";
import Cookies from "js-cookie";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

export default function productsTableData() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error"
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [oldOffer, setOldOffer] = useState(null);

  const openDeleteModal = (productId) => {
    setSelectedId(productId);
    setIsDeleteModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const handleEditOffer = async (newOffer) => {
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

      const response = await Axios.patch(
        `https://pixelparts-dev-api.up.railway.app/api/v1/offer/editOffer/${selectedId}`,
        newOffer,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Edit offer response:", response.data);

      setNotification({
        open: true,
        message: "Offer edited successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error edditing offer:", error.response || error.message);
      setNotification({
        open: true,
        message: "Failed to eddit offer. Please try again.",
        severity: "error",
      });
    } finally {
      closeOfferModal();
    }
  };

  const handleOpenOfferModal = (productId) => {
    // get old offer by product id
    setOldOffer(products.find((product) => product.productid === productId).offerpercentage);
    setSelectedId(productId);
    setIsOfferModalOpen(true);
  };

  const closeOfferModal = () => {
    setIsOfferModalOpen(false);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteOffer = async () => {
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        throw new Error("Unauthorized access");
      }
      await Axios.delete(
        `https://pixelparts-dev-api.up.railway.app/api/v1/offer/deleteOffer/${selectedId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotification({
        open: true,
        message: "Offer deleted successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting Offer:", error);
      setNotification({
        open: true,
        message: "Failed to delete Offer. Please try again.",
        severity: "error",
      });
    } finally {
      closeDeleteModal();
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await Axios.get(
        "https://pixelparts-dev-api.up.railway.app/api/v1/product/allProducts?offerPercentage=>0",
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
          productName: (
            <div className="max-w-[100px] truncate">
              <p className="font-semibold" title={product.productname}>
                {product.productname}
              </p>
            </div>
          ),
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
            <div className="flex justify-center space-x-2">
              <IconButton
                color="default"
                size="medium"
                onClick={() => handleOpenOfferModal(product.productid)}
              >
                <LocalOfferIcon fontSize="medium" />
              </IconButton>
              <IconButton
                color="error"
                size="medium"
                onClick={() => openDeleteModal(product.productid)}
              >
                <DeleteIcon fontSize="medium" />
              </IconButton>
            </div>
          ),
        }));
  }, [loading, products]);
  return {
    columns: [
      { Header: "ID", accessor: "productId", align: "center" },
      { Header: "product Image", accessor: "productimg", align: "center" },
      { Header: "Product Name", accessor: "productName", align: "center" },
      // { Header: "Description", accessor: "productDescription",  align: "center" },
      { Header: "Category", accessor: "category", align: "center" },
      { Header: "Manufacture", accessor: "manufacture", align: "center" },
      { Header: "Price", accessor: "price", align: "center" },
      { Header: "Stock Quantity", accessor: "stockQuantity", align: "center" },
      { Header: "Release Date", accessor: "releaseDate", align: "center" },
      { Header: "Warranty Period", accessor: "warrantyPeriod", align: "center" },
      { Header: "Offer Percentage", accessor: "offerPercentage", align: "center" },
      { Header: "Overall Rating", accessor: "overallRating", align: "center" },
      { Header: "Actions", accessor: "action", align: "center" },
    ],
    rows,
    products,
    oldOffer,
    handleCloseModal,
    isModalOpen,
    notification,
    setNotification,
    handleCloseNotification,
    handleDeleteOffer,
    isDeleteModalOpen,
    closeDeleteModal,
    isOfferModalOpen,
    handleEditOffer,
    closeOfferModal,
  };
}
