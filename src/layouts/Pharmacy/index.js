import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
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
import Fade from "@mui/material/Fade";
import MDSnackbar from "components/MDSnackbar";
import axios from "axios"; // Import axios
import Cookies from "js-cookie"; // Import cookie
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
// Data for Products
import productsTableData from "layouts/Pharmacy/data/productsTableData";
import categoriesTableData from "layouts/Pharmacy/data/categoriesDataTable";

function Tables() {
  const [currentPage, setCurrentPage] = useState(0);
  const [newProduct, setNewProduct] = useState({
    productName: "",
    productPrice: "",
    productStackQuantity: "",
    productDescription: "",
    productExpiryDate: "",
    productCategory: "",
    manufacture: "",
    activeIngredient: [],
  });
  const [newCategory, setNewCategory] = useState({
    categoryName: "",
  });

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });

  // Existing Data section
  const {
    columns,
    rows,
    isModalOpen: editModalOpen,
    handleCloseModal: handleCloseEditProductModal,
    handleInputChange: handleInputChangeEditProduct,
    handleSaveChanges: handleSaveEditProduct,
    editedProduct,
    notification: editNotification,
    handleCloseNotification: handleCloseEditNotification,
    handleInputChangeActiveIngredients: handleInputChangeActiveIngredientsEdit,
  } = productsTableData();

  const {
    columns: categoryColumns,
    rows: categoryRows,
    isModalOpen: categoryEditModalOpen,
    handleCloseModal: handleCloseEditCategoryModal,
    handleInputChange: handleInputChangeEditCategory,
    handleSaveChanges: handleSaveEditCategory,
    editedCategory,
    notification: editCategoryNotification,
    handleCloseNotification: handleCloseEditCategoryNotification,
  } = categoriesTableData();

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update the current page when it changes
  };

  const handleInputChangeNewProduct = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  // write a function to handle input change for active ingredients takes the input and puts the values in an array
  const handleInputChangeActiveIngredients = (e) => {
    const { value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      activeIngredient: value.split(","),
    }));
  };

  const handleInputChangeNewCategory = (e) => {
    const { name, value } = e.target;
    setNewCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  const handleAddProductClick = () => {
    setIsProductModalOpen(true); // Open modal for adding new product
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

  const handleAddCategoryClick = () => {
    setIsCategoryModalOpen(true); // Open modal for adding new category
  };

  const handleCloseAddCategoryModal = () => {
    setIsCategoryModalOpen(false); // Close modal
    setNewCategory({
      categoryName: "",
      categoryDescription: "",
    });
  };

  const handleSaveProduct = async () => {
    const productData = {
      productName: newProduct.productName,
      productPrice: newProduct.productPrice,
      productStackQuantity: newProduct.productStackQuantity,
      productDescription: newProduct.productDescription,
      productExpiryDate: newProduct.productExpiryDate,
      productCategory: newProduct.productCategory,
      manufacture: newProduct.manufacture,
      activeIngredient: newProduct.activeIngredient,
    };

    try {
      console.log(productData);
      const response = await axios.post("http://127.0.0.1:3000/api/v1/products/", productData, {
        headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
      });

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
      setNotification({
        open: true,
        message: "An error occurred while adding the product",
        severity: "error",
      });
    }
  };

  const handleSaveCategory = async () => {
    const categoryData = {
      categoryName: newCategory.categoryName,
      categoryDescription: newCategory.categoryDescription,
    };

    try {
      console.log(categoryData);
      const response = await axios.post("http://127.0.0.1:3000/api/v1/categories/", categoryData, {
        headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
      });

      if (response.status === 200) {
        setNotification({
          open: true,
          message: "Category added successfully",
          severity: "success",
        });
        handleCloseAddCategoryModal(); // Close modal on success
      } else {
        setNotification({
          open: true,
          message: "Failed to add category",
          severity: "error",
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: "An error occurred while adding the category",
        severity: "error",
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          {/* Products Table */}
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

          {/* Categories Table */}
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
                coloredShadow="warning"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Categories Table
                </MDTypography>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleAddCategoryClick}
                  sx={{
                    borderRadius: 2,
                    fontSize: 14,
                    padding: "6px 16px",
                    color: "black",
                  }}
                >
                  Add Category
                </Button>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: categoryColumns, rows: categoryRows }}
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
      <Dialog
        open={isProductModalOpen}
        onClose={handleCloseAddProductModal}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
      >
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
          <TextField
            name="productPrice"
            label="Product Price"
            value={newProduct.productPrice}
            onChange={handleInputChangeNewProduct}
            fullWidth
            margin="dense"
          />
          <TextField
            name="productStackQuantity"
            label="Product Stock Quantity"
            value={newProduct.productStackQuantity}
            onChange={handleInputChangeNewProduct}
            fullWidth
            margin="dense"
          />
          <TextField
            name="productDescription"
            label="Product Description"
            value={newProduct.productDescription}
            onChange={handleInputChangeNewProduct}
            fullWidth
            margin="dense"
          />
          <TextField
            name="productExpiryDate"
            label="Product Expiry Date"
            value={newProduct.productExpiryDate}
            onChange={handleInputChangeNewProduct}
            fullWidth
            margin="dense"
          />
          <TextField
            name="productCategory"
            label="Product Category"
            value={newProduct.productCategory}
            onChange={handleInputChangeNewProduct}
            fullWidth
            margin="dense"
          />
          <TextField
            name="manufacture"
            label="Manufacture"
            value={newProduct.manufacture}
            onChange={handleInputChangeNewProduct}
            fullWidth
            margin="dense"
          />
          <TextField
            name="activeIngredient"
            label="Active Ingredients"
            value={newProduct.activeIngredients}
            onChange={handleInputChangeActiveIngredients}
            fullWidth
            margin="dense"
            placeholder="Write Active Ingredients Space Separated"
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

      {/* Edit Product Modal */}
      <Dialog
        open={editModalOpen}
        onClose={handleCloseEditProductModal}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
      >
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          {/* Product Fields */}
          <TextField
            name="productName"
            label="Product Name"
            value={editedProduct.productName}
            onChange={handleInputChangeEditProduct}
            fullWidth
            margin="dense"
          />
          <TextField
            name="productPrice"
            label="Product Price"
            value={editedProduct.productPrice}
            onChange={handleInputChangeEditProduct}
            fullWidth
            margin="dense"
          />
          <TextField
            name="productStackQuantity"
            label="Product Stock Quantity"
            value={editedProduct.productStackQuantity}
            onChange={handleInputChangeEditProduct}
            fullWidth
            margin="dense"
          />
          <TextField
            name="productDescription"
            label="Product Description"
            value={editedProduct.productDescription}
            onChange={handleInputChangeEditProduct}
            fullWidth
            margin="dense"
          />
          <TextField
            name="productExpiryDate"
            label="Product Expiry Date"
            value={editedProduct.productExpiryDate}
            onChange={handleInputChangeEditProduct}
            fullWidth
            margin="dense"
          />
          <TextField
            name="manufacture"
            label="Manufacture"
            value={editedProduct.manufacture}
            onChange={handleInputChangeEditProduct}
            fullWidth
            margin="dense"
          />
          <TextField
            name="activeIngredient"
            label="Active Ingredients"
            value={editedProduct.activeIngredient}
            onChange={handleInputChangeActiveIngredientsEdit}
            fullWidth
            margin="dense"
            placeholder="Write Active Ingredients Space Separated"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditProductModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveEditProduct} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Category Modal */}
      <Dialog
        open={isCategoryModalOpen}
        onClose={handleCloseAddCategoryModal}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
      >
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            name="categoryName"
            label="Category Name"
            value={newCategory.categoryName}
            onChange={handleInputChangeNewCategory}
            fullWidth
            margin="dense"
          />
          <TextField
            name="categoryDescription"
            label="Category Description"
            value={newCategory.categoryDescription}
            onChange={handleInputChangeNewCategory}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddCategoryModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveCategory} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Category Modal */}
      <Dialog
        open={categoryEditModalOpen}
        onClose={handleCloseEditCategoryModal}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
      >
        <DialogTitle>Update Category</DialogTitle>
        <DialogContent>
          <TextField
            name="categoryName"
            label="Category Name"
            value={editedCategory.categoryName}
            onChange={handleInputChangeEditCategory}
            fullWidth
            margin="dense"
          />
          <TextField
            name="categoryDescription"
            label="Category Description"
            value={editedCategory.categoryDescription}
            onChange={handleInputChangeEditCategory}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditCategoryModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveEditCategory} color="primary">
            Save
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

      <MDSnackbar
        color={editNotification?.severity}
        icon={editNotification?.severity === "success" ? "check" : "error"}
        title={editNotification?.severity === "success" ? "Success" : "Error"}
        content={editNotification?.message}
        open={editNotification?.open}
        onClose={handleCloseEditNotification}
        close={handleCloseEditNotification}
        bgWhite
      />

      <MDSnackbar
        color={editCategoryNotification?.severity}
        icon={editCategoryNotification?.severity === "success" ? "check" : "error"}
        title={editCategoryNotification?.severity === "success" ? "Success" : "Error"}
        content={editCategoryNotification?.message}
        open={editCategoryNotification?.open}
        onClose={handleCloseEditCategoryNotification}
        close={handleCloseEditCategoryNotification}
        bgWhite
      />
    </DashboardLayout>
  );
}

export default Tables;
