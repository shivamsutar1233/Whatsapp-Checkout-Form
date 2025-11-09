import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CheckoutForm from "../components/CheckoutForm";
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
  const [error, setError] = React.useState(null);
  const [productDetails, setProductDetails] = React.useState([]);
  const [isPaymentCompleted, setIsPaymentCompleted] = React.useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = React.useState(false);
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
        // console.log(data);

        setProductDetails(data);
        setIsPaymentCompleted(data.paymentStatus === "PAID");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError(error.message);
      }
    };

    fetchOrderDetails();
  }, [isPaymentCompleted]);

  return loading ? (
    <CircularProgress size={24} />
  ) : (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}></Stepper>
      {productDetails?.paymentStatus !== "PAID" ? (
        <CheckoutForm
          activeStep={activeStep}
          setDisabled={setDisabled}
          setIsPaymentCompleted={setIsPaymentCompleted}
          setPaymentSuccessful={setPaymentSuccessful}
          paymentSuccessful={paymentSuccessful}
        />
      ) : (
        <Container
          maxWidth="sm"
          className="mt-8 px-4 p-4 md:p-6  bg-blue-200 border border-blue-800 rounded-4xl items-center flex flex-col"
        >
          <img
            src="https://pxkxayc7bjdy4vc0.public.blob.vercel-storage.com/Divarch%20Studio/Brand/Div-Arch.in%20Brand%20Identity-1.png"
            alt="Divarch Studio Logo"
            style={{ height: 50, marginBottom: 20 }}
          />

          {/* <Paper className="p-4 md:p-6 shadow-lg bg-transparent"> */}
          <Typography
            variant={isMobile ? "h5" : "h4"}
            className="mb-8! text-center text-gray-800"
          >
            Payment Successful
          </Typography>
          <Typography variant="body1" className="text-center text-blue-600">
            Your orderId: {productDetails.linkId}
          </Typography>
          <Typography variant="body1" className="text-center text-green-00">
            Thank you for your purchase! Your payment has already been received.
          </Typography>
          {/* </Paper> */}
        </Container>
      )}
      {productDetails?.paymentStatus !== "PAID" && (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
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
        </React.Fragment>
      )}
    </Box>
  );
}
