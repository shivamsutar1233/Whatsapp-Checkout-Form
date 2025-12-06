import React from "react";
import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  Grid,
} from "@mui/material";
const ShippingDeliveryDetails = ({
  loading,
  orderDetails,
  cartTotalAmount,
  deliveryCharges,
  totalAmount,
}) => {
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

export default ShippingDeliveryDetails;
