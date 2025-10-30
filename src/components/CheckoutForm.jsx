import { useState, useEffect } from "react";
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
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
// import { randomUUID } from "crypto";

function CheckoutForm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const BASE_API_URL = "https://whats-form-backend.vercel.app/api";

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Get linkId from URL path
        const path = window.location.pathname;
        const linkId = path.split("/").pop();

        if (!linkId) {
          throw new Error("Invalid checkout link");
        }

        // Fetch order details from the server
        const response = await fetch(`${BASE_API_URL}/order-link/${linkId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        const { data } = await response.json();
        setProductDetails(data);

        // Update form with total amount
        setFormData((prev) => ({
          ...prev,
          totalAmount: data.totalAmount,
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

  const [formData, setFormData] = useState({
    phoneNumber: "",
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
    totalAmount: 0,
    // orderId: randomUUID(),
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "quantity" &&
        productDetails && {
          totalAmount: Number(value) * productDetails.price,
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
        name: "Your Company Name",
        description: "Product Purchase",
        handler: async (response) => {
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
              }),
            });

            if (res.ok) {
              alert("Payment successful and data saved!");
              // Reset form
              setFormData({
                phoneNumber: "",
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
                totalAmount: productDetails ? productDetails.price : 0,
                productId: productDetails ? productDetails.id : "",
                productName: productDetails ? productDetails.name : "",
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

  return (
    <Container maxWidth="sm" className="mt-8 px-4">
      <Paper className="p-4 md:p-6 shadow-lg">
        <Typography
          variant={isMobile ? "h5" : "h4"}
          className="mb-8! text-center text-gray-800"
        >
          WhatsApp Checkout
        </Typography>

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
            {productDetails && (
              <Box className="mb-6">
                <Typography variant="h6" className="text-gray-800 mb-3">
                  Order Summary
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {productDetails.products.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="subtitle2">
                              {product.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              className="text-gray-600"
                            >
                              {product.description}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">₹{product.price}</TableCell>
                          <TableCell align="right">
                            {product.quantity}
                          </TableCell>
                          <TableCell align="right">
                            ₹{product.price * product.quantity}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} align="right">
                          <strong>Total Amount:</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>₹{productDetails.totalAmount}</strong>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

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
                    title: "Please enter a valid 10-digit phone number",
                  }}
                  className="md:col-span-2"
                />

                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />

                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
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
              />
              <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextField
                  fullWidth
                  label="City"
                  name="shippingCity"
                  value={formData.shippingCity}
                  onChange={handleInputChange}
                  required
                />
                <TextField
                  fullWidth
                  label="State"
                  name="shippingState"
                  value={formData.shippingState}
                  onChange={handleInputChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Pincode"
                  name="shippingPincode"
                  value={formData.shippingPincode}
                  onChange={handleInputChange}
                  required
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
                  />
                  <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <TextField
                      fullWidth
                      label="City"
                      name="billingCity"
                      value={formData.billingCity}
                      onChange={handleInputChange}
                      required
                    />
                    <TextField
                      fullWidth
                      label="State"
                      name="billingState"
                      value={formData.billingState}
                      onChange={handleInputChange}
                      required
                    />
                    <TextField
                      fullWidth
                      label="Pincode"
                      name="billingPincode"
                      value={formData.billingPincode}
                      onChange={handleInputChange}
                      required
                    />
                  </Box>
                </>
              )}

              <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mt-4">
                <TextField
                  fullWidth
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  inputProps={{
                    min: 1,
                  }}
                />

                <Typography variant="h6" className="text-right text-gray-800">
                  Total: ₹{formData.totalAmount}
                </Typography>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                className="mt-6 bg-blue-600 hover:bg-blue-700 py-3 text-lg"
                disabled={!productDetails}
              >
                Proceed to Pay
              </Button>
            </form>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default CheckoutForm;
