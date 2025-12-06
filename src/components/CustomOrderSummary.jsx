import { Box, Typography, Divider } from "@mui/material";
import ShippingDeliveryDetails from "./ShippingDeliveryDetails";
import OrderDetailsComponent from "./OrderDetailsComponent";

// const BASE_API_URL = "http://localhost:5000/api";
const BASE_API_URL = "https://whats-form-backend.vercel.app/api";

const CustomOrderSummary = ({
  orderData,
  orderDetails,
  loading,
  cartTotalAmount,
  deliveryCharges,
  totalAmount,
}) => {
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
      <OrderDetailsComponent orderData={orderData} showLabel={false} />

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

export default CustomOrderSummary;
