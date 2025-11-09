import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CheckoutForm from "../components/CheckoutForm";
import OrderSummary from "../components/OrderSummary";
import {
  CircularProgress,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const steps = ["Customize products", "Checkout details"];

export default function CheckoutFlow() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [loading, setLoading] = React.useState(true);
  const [productDetails, setProductDetails] = React.useState([]);
  const [isPaymentCompleted, setIsPaymentCompleted] = React.useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = React.useState(false);
  const [orderDetails, setOrderDetails] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [disabled, setDisabled] = React.useState(true);

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // const BASE_API_URL = "http://localhost:5000/api";
  const BASE_API_URL = "https://whats-form-backend.vercel.app/api";
  // Get linkId from URL path
  const path = window.location.pathname;
  const linkId = path.split("/").pop();

  React.useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!linkId) {
          throw new Error("Invalid checkout link");
        }

        // Fetch order details from the server
        const response = await fetch(`${BASE_API_URL}/order-link/${linkId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        const { data } = await response.json();

        // Fetch shipping details if payment is completed
        if (data.paymentStatus === "PAID") {
          try {
            const orderResponse = await fetch(
              `${BASE_API_URL}/order/${linkId}`
            );
            if (orderResponse.ok) {
              const orderData = await orderResponse.json();
              setOrderDetails(orderData.data);
            }
          } catch (orderError) {
            console.error("Error fetching order details:", orderError);
          }
        }

        setProductDetails(data);
        setIsPaymentCompleted(data.paymentStatus === "PAID");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [linkId, isPaymentCompleted]);

  return (
    <Container sx={{ py: 4 }}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <Stepper activeStep={activeStep}></Stepper>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}></Stepper>

          {productDetails?.paymentStatus === "PAID" || paymentSuccessful ? (
            <Container
              sx={{
                p: 4,
                backgroundColor: "#dde9f8",
                border: "1px solid #1E40AF",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src="https://pxkxayc7bjdy4vc0.public.blob.vercel-storage.com/Divarch%20Studio/Brand/Div-Arch.in%20Brand%20Identity-1.png"
                alt="Divarch Studio Logo"
                style={{ height: 50, marginBottom: 20 }}
              />
              <Typography
                variant={isMobile ? "h5" : "h4"}
                sx={{ mb: 2, textAlign: "center", color: "#1F2937" }}
              >
                Payment Successful
              </Typography>
              <Typography
                variant="body1"
                sx={{ textAlign: "center", color: "#2563EB", mb: 1 }}
              >
                Your orderId: {productDetails.linkId}
              </Typography>
              <Typography
                variant="body1"
                sx={{ textAlign: "center", color: "#047857" }}
              >
                Thank you for your purchase! Your payment has been received.
              </Typography>
              <Box sx={{ position: { md: "sticky" }, top: 24 }}>
                <OrderSummary
                  products={productDetails?.products || []}
                  cartTotalAmount={productDetails?.totalAmount || 0}
                  deliveryCharges={50}
                  orderDetails={orderDetails}
                />
              </Box>
            </Container>
          ) : (
            <Box>
              <CheckoutForm
                activeStep={activeStep}
                setDisabled={setDisabled}
                setIsPaymentCompleted={setIsPaymentCompleted}
                setPaymentSuccessful={setPaymentSuccessful}
                paymentSuccessful={paymentSuccessful}
              />

              <Box sx={{ mt: 4 }}>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  Step {activeStep + 1}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button onClick={handleNext} disabled={disabled}>
                    {activeStep === steps.length - 1 ? "" : "Next"}
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
}
