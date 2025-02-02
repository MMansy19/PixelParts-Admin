import React, { useEffect, useState, useMemo } from "react";
import Axios from "axios";
import Cookies from "js-cookie";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function appData() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error"
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await Axios.get(
        "https://pixelparts-dev-api.up.railway.app/api/v1/order/allOrders",
        {
          headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
        }
      );
      const ordersData = response.data.data.orders;

      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    if (selectedProducts.length === 0) return [];
    const productIds = selectedProducts.map((product) => product.productId);
    const productsWithDetails = await Promise.all(
      productIds.map(async (productId) => {
        try {
          const productResponse = await Axios.get(
            `https://pixelparts-dev-api.up.railway.app/api/v1/product/getProduct/${productId}`
          );
          const productData = productResponse.data.data.product;
          return productData;
        } catch (error) {
          console.error(`Error fetching product ${productId}:`, error);
        }
      })
    );
    return productsWithDetails;
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewProducts = (products) => {
    setSelectedProducts(products);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProducts([]);
  };

  const rows = useMemo(() => {
    return loading
      ? [
          {
            orderId: "Loading...",
            userId: "Loading...",
            username: "Loading...",
            email: "Loading...",
            totalPrice: "Loading...",
            orderDate: "Loading...",
            paymentMethod: "Loading...",
            paymentStatus: "Loading...",
            products: "Loading...",
            actions: "Loading...",
          },
        ]
      : orders.map((order) => ({
          orderId: order.orderid,
          userId: order.userid,
          username: order.username,
          email: order.email,
          totalPrice: `$${order.totalprice}`,
          orderDate: new Date(order.orderdate).toLocaleDateString(),
          paymentMethod: order.paymentmethod,
          paymentStatus: order.paymentstatus,
          products: (
            <ul>
              {order.products.map((product) => (
                <li key={product.productId}>
                  {product.name} (ID: {product.productId}, Qty: {product.quantity})
                </li>
              ))}
            </ul>
          ),
          actions: (
            <IconButton color="secondary" onClick={() => handleViewProducts(order.products)}>
              <VisibilityIcon />
            </IconButton>
          ),
        }));
  }, [loading, orders]);

  return {
    columns: [
      { Header: "Order ID", accessor: "orderId", align: "center" },
      { Header: "User ID", accessor: "userId", align: "center" },
      { Header: "Username", accessor: "username", align: "center" },
      { Header: "Email", accessor: "email", align: "center" },
      { Header: "Total Price", accessor: "totalPrice", align: "center" },
      { Header: "Order Date", accessor: "orderDate", align: "center" },
      { Header: "Payment Method", accessor: "paymentMethod", align: "center" },
      { Header: "Payment Status", accessor: "paymentStatus", align: "center" },
      { Header: "Products", accessor: "products", align: "center" },
      { Header: "Actions", accessor: "actions", align: "center" },
    ],
    rows,
    isModalOpen,
    handleCloseModal,
    fetchProducts,
    notification,
    setNotification,
  };
}
