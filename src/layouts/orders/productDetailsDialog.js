import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import DeleteIcon from "@mui/icons-material/Delete";
import MDAvatar from "components/MDAvatar";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";

const ProductDetailsDialog = ({ isOpen, handleClose, fetchProducts }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (isOpen) {
        setLoading(true);
        const productsWithDetails = await fetchProducts();
        setProducts(productsWithDetails);
        console.log(productsWithDetails);   
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [isOpen, fetchProducts]);


const rows = useMemo(() => {
  const flattenedProducts = products.flat(); // Flatten the nested arrays

  return loading
    ? [
        {
          productId: "Loading...",
          productName: "Loading...",
          productDescription: "Loading...",
          category: "Loading...",
          manufacture: "Loading...",
          price: "Loading...",
          stockQuantity: "Loading...",
          releaseDate: "Loading...",
          warrantyPeriod: "Loading...",
          offerPercentage: "Loading...",
          overallRating: "Loading...",
        },
      ]
    : flattenedProducts.map((product) => ({
        productId: product.productid,
        productName: (
          <div className="max-w-[100px] truncate">
            <p className="font-semibold" title={product.productname}>
              {product.productname}
            </p>
          </div>
        ),
        productDescription: (
          <div className="max-w-[100px] truncate">
            <p className="font-semibold" title={product.description}>
              {product.description}
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
        warrantyPeriod: product.warrantyperiod
          ? `${product.warrantyperiod} months`
          : "No Period",
        offerPercentage: product.offerpercentage
          ? `${product.offerpercentage}%`
          : "No Offers",
        overallRating: parseFloat(product.overallrating).toFixed(2),
      }));
}, [loading, products]);

  const columns = [{ Header: "ID", accessor: "productId",  align: "center" },
      { Header: "product Image", accessor: "productimg",  align: "center" },
      { Header: "Product Name", accessor: "productName",   align: "center" },
      { Header: "Description", accessor: "productDescription",  align: "center" },
      { Header: "Category", accessor: "category",  align: "center" },
      { Header: "Manufacture", accessor: "manufacture",  align: "center" },
      { Header: "Price", accessor: "price",  align: "center" },
      { Header: "Stock Quantity", accessor: "stockQuantity",  align: "center" },
      { Header: "Release Date", accessor: "releaseDate",  align: "center" },
      { Header: "Warranty Period", accessor: "warrantyPeriod",  align: "center" },
      { Header: "Offer Percentage", accessor: "offerPercentage",  align: "center" },
      { Header: "Overall Rating", accessor: "overallRating",  align: "center" },
    ];

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="xl" fullWidth>
      <DialogTitle>Products</DialogTitle>
      <DialogContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <CircularProgress />
          </div>
        ) : (
          <MDBox pt={3}>
            <DataTable
              table={{ columns, rows }}
              isSorted={true}
              entriesPerPage={false}
              showTotalEntries
              noEndBorder
            />
          </MDBox>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};
ProductDetailsDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  fetchProducts: PropTypes.func.isRequired,
};

export default ProductDetailsDialog;
