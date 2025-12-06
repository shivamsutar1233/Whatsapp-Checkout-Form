import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ShippingDeliveryDetails from "./ShippingDeliveryDetails";

// const BASE_API_URL = "http://localhost:5000/api";
const BASE_API_URL = "https://whats-form-backend.vercel.app/api";

const OrderSummary = ({ products, cartTotalAmount, deliveryCharges }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        // Get linkId from URL path
        const path = window.location.pathname;
        const linkId = path.split("/").pop();
        if (!linkId) return;

        const response = await fetch(`${BASE_API_URL}/order/${linkId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        const data = await response.json();
        // console.log("Order API Response:", data); // Debug log

        if (data.success) {
          const orderData = data.data;
          //   console.log("Order Details:", orderData); // Debug log

          // Log specific fields we're trying to access
          console.log("Address fields in response:", {
            directFields: {
              shippingAddressLine1: orderData.shippingAddressLine1,
              shippingCity: orderData.shippingCity,
              shippingState: orderData.shippingState,
              shippingPincode: orderData.shippingPincode,
            },
            nestedAddress: orderData.address,
            allFields: orderData,
          });

          setOrderDetails(orderData);
        } else {
          console.error("API returned success: false", data);
          throw new Error(data.message || "Failed to fetch order details");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, []); // Run once when component mounts
  if ((!products || products.length === 0) && !orderDetails?.isCustomOrder)
    return null;

  const totalAmount = cartTotalAmount + deliveryCharges;

  return (
    <Box
      elevation={1}
      sx={{ p: 3, mb: 3 }}
      className="flex-1 flex flex-col"
      flexGrow={1}
      bgcolor={"white"}
      width={"100%"}
      flexDirection={"column"}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold", color: "text.primary" }}
      >
        Order Summary
      </Typography>

      <TableContainer component={Box} sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell align="right">{product.quantity}</TableCell>
                <TableCell align="right">₹{product.price}</TableCell>
                <TableCell align="right">
                  ₹{product.price * product.quantity}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 2 }} />
      <ShippingDeliveryDetails
        loading={loading}
        orderDetails={orderDetails}
        cartTotalAmount={cartTotalAmount}
        deliveryCharges={deliveryCharges}
        totalAmount={totalAmount}
      />
    </Box>
  );
};

export default OrderSummary;
