import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import MDSnackbar from "components/MDSnackbar";
import { useState, useEffect } from "react";
import Axios from "axios";
import Cookies from "js-cookie";
import axios from "axios";
import { Box, FormControl, InputLabel } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// Data
import appData from "layouts/Offers/data/appData";
import { Typography } from "@mui/material";

function Tables() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const [newProduct, setNewProduct] = useState({
    category: "",
    productName: "",
    manufacture: "",
    price: 0,
    stockQuantity: 0,
    specifications: [],
    releaseDate: "",
    warrantyPeriod: 0,
    productImg: "",
  });

  const {
    columns,
    rows,
    editedProduct,
    handleFileChange,
    handleInputChange,
    handleSaveChanges,
    isModalOpen,
    isFileModalOpen,
    closeFileModal,
    isDeleteModalOpen,
    closeDeleteModal,
    handleCloseModal,
    notification,
    setNotification,
    handleCloseNotification,
    handleUploadImage,
    imagePreview,
    handleDeleteProduct,
    selectedId,
  } = appData();
  const handleAddProductClick = () => {
    setIsProductModalOpen(true); // Open modal for adding new product
  };

  const handleAddSpecification = () => {
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      specifications: [...prevProduct.specifications, { key: "", value: "" }],
    }));
  };

  const handleRemoveSpecification = (index) => {
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      specifications: prevProduct.specifications.filter((_, i) => i !== index),
    }));
  };

  const handleSpecificationChange = (e, index, field) => {
    const value = e.target.value;
    setNewProduct((prevProduct) => {
      const updatedSpecifications = [...prevProduct.specifications];
      updatedSpecifications[index][field] = value;
      return { ...prevProduct, specifications: updatedSpecifications };
    });
  };

  const handleCloseAddProductModal = () => {
    setIsProductModalOpen(false); // Close modal
    setNewProduct({
      productName: "",
      productPrice: "",
      productStackQuantity: "",
      productDescription: "",
      productExpiryDate: "",
      productCategory: "",
      manufacture: "",
      activeIngredient: [],
    });
  };
  const handleInputChangeNewProduct = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveProduct = async () => {
    // Construct product data
    // Validate specifications
    const validSpecifications = newProduct.specifications.reduce((acc, spec) => {
      if (spec.key && spec.value) {
        acc[spec.key.trim()] = spec.value.trim();
      }
      return acc;
    }, {});

    const productData = {
      category: newProduct.category,
      productName: newProduct.productName,
      manufacture: newProduct.manufacture,
      price: newProduct.price,
      stockQuantity: newProduct.stockQuantity,
      specifications: validSpecifications,
      releaseDate: newProduct.releaseDate && newProduct.releaseDate,
      warrantyPeriod: newProduct.warrantyPeriod && newProduct.warrantyPeriod,
      productImg: newProduct.productImg && newProduct.productImg,
    };

    try {
      console.log("Sending product data:", productData);

      // Make POST request
      const response = await axios.post(
        "https://pixelparts-dev-api.up.railway.app/api/v1/product/addProduct",
        productData,
        {
          headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
        }
      );

      // Handle response
      if (response.status === 200) {
        setNotification({
          open: true,
          message: "Product added successfully",
          severity: "success",
        });
        handleCloseAddProductModal(); // Close modal on success
      } else {
        setNotification({
          open: true,
          message: "Failed to add product",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setNotification({
        open: true,
        message: "An error occurred while adding the product",
        severity: "error",
      });
    }
  };

  const fetchAppointmentsStats = async () => {
    try {
      setLoading(true);
      const response = await Axios.get(
        // TO DO
        "https://mediportal-api-production.up.railway.app/api/v1/appointments/stats",
        {
          headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
        }
      );
      setLoading(false);
      setStats(response.data.data.stats);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAppointmentsStats();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3} marginBottom={5}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="people"
                title="Total Products"
                count={
                  loading
                    ? "Loading..."
                    : Number(stats.completedappointments) +
                      Number(stats.scheduledappointments) +
                      Number(stats.cancelledappointments)
                }
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="timer"
                title="Scheduled Products"
                count={stats.scheduledappointments}
                color="warning"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="done"
                title="Completed Products"
                count={stats.completedappointments}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="error"
                icon="block"
                title="Canceled Doctors"
                count={stats.cancelledappointments}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="dark"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Products Table
                </MDTypography>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleAddProductClick}
                  sx={{
                    borderRadius: 2,
                    fontSize: 14,
                    padding: "6px 16px",
                    color: "black",
                  }}
                >
                  Add Product
                </Button>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={true}
                  entriesPerPage={false}
                  showTotalEntries
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      {/* Product Modal */}
      <Dialog open={isProductModalOpen} onClose={handleCloseAddProductModal}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          {/* Product Fields */}
          <TextField
            name="productName"
            label="Product Name"
            value={newProduct.productName}
            onChange={handleInputChangeNewProduct}
            fullWidth
            margin="dense"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              style={{ padding: "10px 0" }}
              labelId="category-label"
              name="category"
              value={newProduct.category}
              onChange={handleInputChangeNewProduct}
              fullWidth
            >
              {/* Add all valid categories */}
              <MenuItem value="Cpu">Cpu</MenuItem>
              <MenuItem value="Gpu">Gpu</MenuItem>
              <MenuItem value="Ram">Ram</MenuItem>
              <MenuItem value="Storage">Storage</MenuItem>
              <MenuItem value="Motherboard">Motherboard</MenuItem>
              <MenuItem value="Psu">Psu</MenuItem>
              <MenuItem value="Case">Case</MenuItem>
              <MenuItem value="Cooling">Cooling</MenuItem>
              <MenuItem value="others">others</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="manufacture"
            label="Manufacture"
            value={newProduct.manufacture}
            onChange={handleInputChangeNewProduct}
            fullWidth
            margin="dense"
          />
          <TextField
            name="price"
            label="Price"
            value={newProduct.price}
            onChange={handleInputChangeNewProduct}
            type="number"
            fullWidth
            margin="dense"
          />
          <TextField
            name="stockQuantity"
            label="Stock Quantity"
            value={newProduct.stockQuantity}
            onChange={handleInputChangeNewProduct}
            type="number"
            fullWidth
            margin="dense"
          />

          {/* Dynamic Specifications Field */}
          <div>
            <Typography variant="h6" gutterBottom>
              Specifications
            </Typography>
            {newProduct.specifications?.length > 0 &&
              newProduct.specifications.map((spec, index) => (
                <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  {/* Key Input */}
                  <TextField
                    name={`key-${index}`}
                    label="Specification Key"
                    value={spec.key || ""}
                    onChange={(e) => handleSpecificationChange(e, index, "key")}
                    fullWidth
                  />
                  {/* Value Input */}
                  <TextField
                    name={`value-${index}`}
                    label="Specification Value"
                    value={spec.value || ""}
                    onChange={(e) => handleSpecificationChange(e, index, "value")}
                    fullWidth
                  />
                  {/* Remove Button */}
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleRemoveSpecification(index)}
                    style={{
                      color: "red",
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddSpecification}
              style={{ marginTop: "10px", color: "green" }}
            >
              Add Specification
            </Button>
          </div>

          <TextField
            name="releaseDate"
            label="Release Date"
            value={newProduct.releaseDate || new Date().toISOString().split("T")[0]}
            onChange={handleInputChangeNewProduct}
            type="date"
            fullWidth
            margin="dense"
          />
          <TextField
            name="warrantyPeriod"
            label="Warranty Period (Months)"
            value={newProduct.warrantyPeriod}
            onChange={handleInputChangeNewProduct}
            type="number"
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddProductModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveProduct} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal for editing Products */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
      >
        <DialogTitle>Edit Product Details</DialogTitle>
        <DialogContent>
          {editedProduct && (
            <>
              <TextField
                name="productName"
                label="Product Name"
                value={editedProduct.productName}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
              />
              <TextField
                name="category"
                label="Category"
                value={editedProduct.category}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
              />
              <TextField
                name="manufacture"
                label="Manufacturer"
                value={editedProduct.manufacture}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
              />
              <TextField
                name="price"
                label="Price"
                type="number"
                value={editedProduct.price}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
              />
              <TextField
                name="stockQuantity"
                label="Stock Quantity"
                type="number"
                value={editedProduct.stockQuantity}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
              />
              <TextField
                name="specifications"
                label="Specifications"
                value={editedProduct.specifications}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
                multiline
                rows={3}
              />
              <TextField
                name="releaseDate"
                label="Release Date"
                type="date"
                value={editedProduct.releaseDate}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                name="warrantyPeriod"
                label="Warranty Period (Months)"
                type="number"
                value={editedProduct.warrantyPeriod}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
              />
              <TextField
                name="offerPercentage"
                label="Offer Percentage"
                type="number"
                value={editedProduct.offerPercentage}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
              />
              <TextField
                name="overallRating"
                label="Overall Rating"
                type="number"
                value={editedProduct.overallRating}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
              />
              <TextField
                name="description"
                label="Description"
                value={editedProduct.description}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
                multiline
                rows={4}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* File Modal */}
      <Dialog
        open={isFileModalOpen}
        onClose={closeFileModal}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Product Image</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            {/* Image Preview */}
            {imagePreview && (
              <Box
                component="img"
                src={imagePreview}
                alt="Product Preview"
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: 300,
                  borderRadius: 2,
                  objectFit: "contain",
                  border: "1px solid #ccc",
                }}
              />
            )}
            <Button
              component="label"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              fullWidth
            >
              Upload Product Image
              <input hidden accept="image/*" type="file" name="image" onChange={handleFileChange} />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeFileModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUploadImage} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* Confirm Deletion */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={closeFileModal}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <MDTypography variant="body1" color="textSecondary">
            Are you sure you want to delete this product?
          </MDTypography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => handleDeleteProduct(selectedId)} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <MDSnackbar
        color={notification.severity}
        icon={notification.severity === "success" ? "check" : "error"}
        title={notification.severity === "success" ? "Success" : "Error"}
        content={notification.message}
        open={notification.open}
        onClose={handleCloseNotification}
        close={handleCloseNotification}
        bgWhite
      />
    </DashboardLayout>
  );
}

export default Tables;
