import { useState, useEffect, useMemo } from "react";
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import _ from "lodash";
import Customize_KCKR001 from "./Customize_KCKR001";
import Customize_KCNP002 from "./Customize_KCNP002";
import Customize_KCNP003 from "./Customize_KCNP003";
import Customize_KCKR005 from "./Customize_KCKR005";
import { isValidProductsList } from "../utils/validationFunctions";
// import { randomUUID } from "crypto";

function CheckoutForm({ activeStep, setIsPaymentCompleted, setDisabled }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  // const BASE_API_URL = "http://localhost:5000/api";
  const BASE_API_URL = "https://whats-form-backend.vercel.app/api";
  // Get linkId from URL path
  const path = window.location.pathname;
  const linkId = path.split("/").pop();
  const [customizationDetails, setCustomizationDetails] = useState({});
  const [formData, setFormData] = useState({
    phoneNumber: "",
    email: "",
    firstName: "",
    lastName: "",
    // Shipping Address
    shippingAddressLine1: "",
    shippingAddressLine2: "",
    shippingCity: "",
    shippingState: "",
    shippingPincode: "",
    // Billing Address
    billingAddressLine1: "",
    billingAddressLine2: "",
    billingCity: "",
    billingState: "",
    billingPincode: "",
    // Product details
    productId: "",
    productName: "",
    quantity: 1,
    cartTotalAmount: 0,
    totalAmount: 0,
    deliveryCharges: 50,
    // orderId: randomUUID(),
  });
  useEffect(() => {
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

        // Update form with total amount
        setFormData((prev) => ({
          ...prev,
          cartTotalAmount: data.totalAmount,
          totalAmount: data.totalAmount + prev.deliveryCharges,
        }));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, []);

  const [sameAsShipping, setSameAsShipping] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "quantity" &&
        productDetails && {
          cartTotalAmount: Number(value) * productDetails.price,
        }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare final form data including billing address
      const finalFormData = {
        ...formData,
        billingAddressLine1: sameAsShipping
          ? formData.shippingAddressLine1
          : formData.billingAddressLine1,
        billingAddressLine2: sameAsShipping
          ? formData.shippingAddressLine2
          : formData.billingAddressLine2,
        billingCity: sameAsShipping
          ? formData.shippingCity
          : formData.billingCity,
        billingState: sameAsShipping
          ? formData.shippingState
          : formData.billingState,
        billingPincode: sameAsShipping
          ? formData.shippingPincode
          : formData.billingPincode,
      };

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: formData.totalAmount * 100, // Razorpay expects amount in paise
        currency: "INR",
        name: "Divarch Studio",
        description: "Product Purchase",
        image:
          "https://pxkxayc7bjdy4vc0.public.blob.vercel-storage.com/Divarch%20Studio/Brand/Div-Arch.in%20Brand%20Identity-1.png", // You can add your logo URL here
        handler: async (response) => {
          setPaymentInProgress(true);

          try {
            // Send data to backend
            const res = await fetch(`${BASE_API_URL}/saveToSheet`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...finalFormData,
                paymentId: response.razorpay_payment_id,
                timestamp: new Date().toISOString(),
                unitPrice: productDetails
                  ? productDetails.products[0].price
                  : 0,
                SKU: productDetails ? productDetails.products[0].SKU : "",
                weightOfShipment: productDetails
                  ? productDetails.products[0].weight
                  : 0,
                lengthOfShipment: productDetails
                  ? productDetails.products[0].length
                  : 0,
                breadthOfShipment: productDetails
                  ? productDetails.products[0].breadth
                  : 0,
                heightOfShipment: productDetails
                  ? productDetails.products[0].height
                  : 0,
                isThisMultipleProductOrder: productDetails
                  ? productDetails.products.length > 1
                  : false,
                productName: productDetails
                  ? productDetails.products[0].name
                  : "",
                orderId: linkId,
                customizationDetails: customizationDetails,
              }),
            }).then(() =>
              fetch(`${BASE_API_URL}/update-payment-status`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  paymentStatus: "PAID",
                  linkId: linkId,
                }),
              })
            );

            if (res.ok) {
              // alert("Payment successful and data saved!");
              // Reset form
              setPaymentSuccessful(true);
              setPaymentInProgress(false);
              setIsPaymentCompleted(true);
              setFormData({
                phoneNumber: "",
                email: "",
                firstName: "",
                lastName: "",
                shippingAddressLine1: "",
                shippingAddressLine2: "",
                shippingCity: "",
                shippingState: "",
                shippingPincode: "",
                billingAddressLine1: "",
                billingAddressLine2: "",
                billingCity: "",
                billingState: "",
                billingPincode: "",
                quantity: 1,
                cartTotalAmount: productDetails ? productDetails.price : 0,
                productId: productDetails ? productDetails.id : "",
                productName: productDetails ? productDetails.name : "",
                totalAmount: 0,
              });
              setSameAsShipping(true);
            } else {
              throw new Error("Failed to save data");
            }
          } catch (error) {
            console.error("Error saving data:", error);
            alert("Error saving data. Please contact support.");
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          contact: formData.phoneNumber,
        },
        theme: {
          color: "#3B82F6",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Error initiating payment. Please try again.");
    }
  };

  if (productDetails?.paymentStatus === "PAID" || paymentSuccessful) {
    return (
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
    );
  }

  const groupedProductDetails = () => {
    if (!productDetails) return null;
    return _.groupBy(productDetails.products, (product) => product.SKU);
  };
  const getCustomizeComponent = (sku, product) => {
    if (!productDetails) return null;
    switch (sku) {
      case "KCKR001":
        return (
          <Customize_KCKR001
            product={product}
            orderId={productDetails.linkId}
            setCustomizationDetails={setCustomizationDetails}
            customizationDetails={customizationDetails}
          />
        );

      case "KCNP002":
      case "KCNP004":
        return (
          <Customize_KCNP002
            product={product}
            orderId={productDetails.linkId}
            setCustomizationDetails={setCustomizationDetails}
            customizationDetails={customizationDetails}
          />
        );

      case "KCNP003":
        return (
          <Customize_KCNP003
            product={product}
            orderId={productDetails.linkId}
            setCustomizationDetails={setCustomizationDetails}
            customizationDetails={customizationDetails}
          />
        );

      case "KCKR005":
        return (
          <Customize_KCKR005
            product={product}
            orderId={productDetails.linkId}
            setCustomizationDetails={setCustomizationDetails}
            customizationDetails={customizationDetails}
          />
        );

      default:
        return null;
    }
  };
  useMemo(() => {
    console.log("customizationDetails:", customizationDetails);
    setDisabled(() => {
      if (
        Object.keys(customizationDetails).length !==
        Object.keys(groupedProductDetails() || {}).length
      ) {
        return true;
      }
      return !Object.entries(customizationDetails).some(
        ([sku, details]) =>
          (["KCNP002", "KCNP004", "KCNP003"].includes(sku) &&
            isValidProductsList(sku, details)) ||
          ["KCKR001", "KCKR005"].includes(sku)
      );
    });
  }, [customizationDetails, setDisabled, groupedProductDetails]);

  return (
    <Container maxWidth="sm" className="mt-8 px-4">
      <Paper className="p-4 md:p-6 shadow-lg">
        <div className="flex flex-col items-center">
          <img
            src="https://pxkxayc7bjdy4vc0.public.blob.vercel-storage.com/Divarch%20Studio/Brand/Div-Arch.in%20Brand%20Identity-1.png"
            alt="Divarch Studio Logo"
            style={{ height: 50, marginBottom: 20 }}
          />
          <Typography
            variant={isMobile ? "h5" : "h4"}
            className="mb-8! text-center text-gray-800"
          >
            WhatsApp Checkout
          </Typography>
        </div>

        {loading ? (
          <Box className="flex justify-center items-center py-8">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        ) : (
          <>
            {productDetails && activeStep === 0 && (
              <Box className="mb-6">
                {Object.entries(groupedProductDetails()).map(([sku, product]) =>
                  getCustomizeComponent(sku, product)
                )}
              </Box>
            )}

            {activeStep === 1 && (
              <form
                onSubmit={handleSubmit}
                className="space-y-4 flex flex-col gap-4"
              >
                <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    inputProps={{
                      pattern: "[0-9]{10}",
                      maxLength: 10,
                      title: "Please enter a valid 10-digit phone number",
                    }}
                    className="md:col-span-2"
                    disabled={paymentInProgress}
                  />
                  <TextField
                    fullWidth
                    label="Email(optional)"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    type="email"
                    className="md:col-span-2"
                    disabled={paymentInProgress}
                  />

                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    disabled={paymentInProgress}
                  />

                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    disabled={paymentInProgress}
                  />
                </Box>

                {/* Shipping Address Section */}
                <Typography variant="h6" className="text-gray-700 mt-4">
                  Shipping Address
                </Typography>
                <TextField
                  fullWidth
                  label="Address Line 1"
                  name="shippingAddressLine1"
                  value={formData.shippingAddressLine1}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={1}
                  className="mt-4"
                  disabled={paymentInProgress}
                />
                <TextField
                  fullWidth
                  label="Address Line 2"
                  name="shippingAddressLine2"
                  value={formData.shippingAddressLine2}
                  onChange={handleInputChange}
                  multiline
                  rows={1}
                  className="mt-4"
                  disabled={paymentInProgress}
                />
                <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <TextField
                    fullWidth
                    label="City"
                    name="shippingCity"
                    value={formData.shippingCity}
                    onChange={handleInputChange}
                    required
                    disabled={paymentInProgress}
                  />
                  <TextField
                    fullWidth
                    label="State"
                    name="shippingState"
                    value={formData.shippingState}
                    onChange={handleInputChange}
                    required
                    disabled={paymentInProgress}
                  />
                  <TextField
                    fullWidth
                    label="Pincode"
                    name="shippingPincode"
                    value={formData.shippingPincode}
                    onChange={handleInputChange}
                    required
                    inputProps={{
                      maxLength: 6,
                      pattern: "[0-9]{6}",
                      title: "Please enter a valid pincode",
                    }}
                    disabled={paymentInProgress}
                  />
                </Box>

                {/* Billing Address Section */}
                <Box className="flex items-center mt-6 mb-4">
                  <Typography variant="h6" className="text-gray-700">
                    Billing Address
                  </Typography>
                  <Box className="ml-4 flex items-center">
                    <input
                      type="checkbox"
                      id="sameAsShipping"
                      checked={sameAsShipping}
                      onChange={(e) => {
                        setSameAsShipping(e.target.checked);
                        if (e.target.checked) {
                          setFormData((prev) => ({
                            ...prev,
                            billingAddressLine1: prev.shippingAddressLine1,
                            billingAddressLine2: prev.shippingAddressLine2,
                            billingCity: prev.shippingCity,
                            billingState: prev.shippingState,
                            billingPincode: prev.shippingPincode,
                          }));
                        }
                      }}
                      className="w-4 h-4 mr-2"
                    />
                    <label
                      htmlFor="sameAsShipping"
                      className="text-sm text-gray-600"
                    >
                      Same as shipping address
                    </label>
                  </Box>
                </Box>

                {!sameAsShipping && (
                  <>
                    <TextField
                      fullWidth
                      label="Billing Address Line 1"
                      name="billingAddressLine1"
                      value={formData.billingAddressLine1}
                      onChange={handleInputChange}
                      required
                      multiline
                      rows={1}
                      className="mt-4"
                      disabled={paymentInProgress}
                    />
                    <TextField
                      fullWidth
                      label="Billing Address Line 2"
                      name="billingAddressLine2"
                      value={formData.billingAddressLine2}
                      onChange={handleInputChange}
                      multiline
                      rows={1}
                      className="mt-4"
                      disabled={paymentInProgress}
                    />
                    <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <TextField
                        fullWidth
                        label="City"
                        name="billingCity"
                        value={formData.billingCity}
                        onChange={handleInputChange}
                        required
                        disabled={paymentInProgress}
                      />
                      <TextField
                        fullWidth
                        label="State"
                        name="billingState"
                        value={formData.billingState}
                        onChange={handleInputChange}
                        required
                        disabled={paymentInProgress}
                      />
                      <TextField
                        fullWidth
                        label="Pincode"
                        name="billingPincode"
                        value={formData.billingPincode}
                        onChange={handleInputChange}
                        required
                        disabled={paymentInProgress}
                        inputProps={{
                          maxLength: 6,
                          pattern: "[0-9]{6}",
                          title: "Please enter a valid pincode",
                        }}
                      />
                    </Box>
                  </>
                )}

                <Typography variant="h6" className="text-right text-gray-800">
                  Cart Total: ₹{formData.cartTotalAmount}
                </Typography>
                <Typography variant="h6" className="text-right text-gray-800">
                  Delivery Charges: ₹{formData.deliveryCharges}
                </Typography>

                <Divider fullWidth />

                <Typography variant="h6" className="text-right text-gray-800">
                  Grand Total: ₹{formData.totalAmount}
                </Typography>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  className="mt-6 bg-blue-600 hover:bg-blue-700 py-3 text-lg"
                  disabled={!productDetails}
                >
                  {paymentInProgress ? (
                    <CircularProgress size={24} color="white" />
                  ) : (
                    "Proceed to Pay"
                  )}
                </Button>
              </form>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
}

export default CheckoutForm;
