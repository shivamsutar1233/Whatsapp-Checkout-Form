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
  CircularProgress,
  Grid,
} from "@mui/material";

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

  if (!products || products.length === 0) return null;

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
      <Box sx={{ mb: 2, width: "100%" }}>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ fontWeight: "600", color: "text.primary" }}
        >
          Shipping Details
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : orderDetails ? (
          <>
            {console.log("Rendering with orderDetails:", orderDetails)}{" "}
            {/* Debug log */}
            {/* Customer Details */}
            <Box sx={{ mb: 2, bgcolor: "#f8fafc", p: 2, borderRadius: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  color: "text.primary",
                  fontWeight: "600",
                  textAlign: "left",
                }}
              >
                Contact Information
              </Typography>
              <Grid
                container
                flex
                direction="column"
                alignItems={"start"}
                justifyContent={"start"}
                textAlign={"left"}
              >
                <Grid item size={12}>
                  <Typography variant="body1">
                    {orderDetails.firstName} {orderDetails.lastName}
                  </Typography>
                </Grid>
                <Grid item size={12}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "500", color: "primary.main" }}
                  >
                    {orderDetails.phoneNumber}
                  </Typography>
                </Grid>
                {orderDetails.email && (
                  <Grid item size={12}>
                    <Typography variant="body1">
                      {orderDetails.email}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
            {/* Shipping Address */}
            <Box sx={{ bgcolor: "#f8fafc", p: 2, borderRadius: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  color: "text.primary",
                  fontWeight: "600",
                  textAlign: "left",
                }}
              >
                Delivery Address
              </Typography>
              {orderDetails.shippingAddress ? (
                <Grid container>
                  <Grid item size={12} textAlign={"left"}>
                    {orderDetails?.shippingAddress?.addressLine1 && (
                      <Typography variant="body2">
                        {orderDetails?.shippingAddress?.addressLine1},
                      </Typography>
                    )}
                  </Grid>
                  <Grid item size={12} textAlign={"left"}>
                    {orderDetails?.shippingAddress?.addressLine2 && (
                      <Typography variant="body2">
                        {orderDetails?.shippingAddress?.addressLine2},
                      </Typography>
                    )}
                  </Grid>
                  <Grid item size={12} textAlign={"left"}>
                    {orderDetails?.shippingAddress?.city && (
                      <Typography variant="body2">
                        {orderDetails?.shippingAddress?.city},
                      </Typography>
                    )}
                  </Grid>
                  <Grid item size={12} textAlign={"left"}>
                    {orderDetails?.shippingAddress?.state && (
                      <Typography variant="body2">
                        {orderDetails?.shippingAddress?.state},
                      </Typography>
                    )}
                  </Grid>
                  <Grid item size={12} textAlign={"left"}>
                    {orderDetails?.shippingAddress?.pincode && (
                      <Typography variant="body2">
                        {orderDetails?.shippingAddress?.pincode}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No address information available
                </Typography>
              )}
            </Box>
            {/* Billing Address */}
            <Box sx={{ bgcolor: "#f8fafc", p: 2, borderRadius: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  color: "text.primary",
                  fontWeight: "600",
                  textAlign: "left",
                }}
              >
                Billing Address
              </Typography>
              {orderDetails.billingAddress ? (
                <Grid container>
                  <Grid item size={12} textAlign={"left"}>
                    {orderDetails?.billingAddress?.addressLine1 && (
                      <Typography variant="body2">
                        {orderDetails?.billingAddress?.addressLine1},
                      </Typography>
                    )}
                  </Grid>
                  <Grid item size={12} textAlign={"left"}>
                    {orderDetails?.billingAddress?.addressLine2 && (
                      <Typography variant="body2">
                        {orderDetails?.billingAddress?.addressLine2},
                      </Typography>
                    )}
                  </Grid>
                  <Grid item size={12} textAlign={"left"}>
                    {orderDetails?.billingAddress?.city && (
                      <Typography variant="body2">
                        {orderDetails?.billingAddress?.city},
                      </Typography>
                    )}
                  </Grid>
                  <Grid item size={12} textAlign={"left"}>
                    {orderDetails?.billingAddress?.state && (
                      <Typography variant="body2">
                        {orderDetails?.billingAddress?.state},
                      </Typography>
                    )}
                  </Grid>
                  <Grid item size={12} textAlign={"left"}>
                    {orderDetails?.billingAddress?.pincode && (
                      <Typography variant="body2">
                        {orderDetails?.billingAddress?.pincode}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No address information available
                </Typography>
              )}
            </Box>
          </>
        ) : (
          <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Shipping details will be available after payment completion.
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body1" color="text.secondary">
            Subtotal
          </Typography>
          <Typography variant="body1">₹{cartTotalAmount}</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="body1" color="text.secondary">
            Delivery Charges
          </Typography>
          <Typography variant="body1">₹{deliveryCharges}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Total Amount
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            ₹{totalAmount}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default OrderSummary;
