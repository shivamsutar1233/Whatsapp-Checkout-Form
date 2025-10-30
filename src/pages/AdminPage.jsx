import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Snackbar,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [generatedLink, setGeneratedLink] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const BASE_URL = "https://whats-form-backend.vercel.app/api";

  axios.defaults.baseURL = BASE_URL;
  const BASE_API_URL = BASE_URL;

  useEffect(() => {
    // Check for existing authentication
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsAuthenticated(true);
      fetchProducts(token);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/admin/login", loginForm);
      const data = response.data;

      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        setIsAuthenticated(true);
        setSnackbar({
          open: true,
          message: "Login successful",
          severity: "success",
        });
        fetchProducts(data.token);
      } else {
        setSnackbar({
          open: true,
          message: "Invalid credentials",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error logging in",
        severity: "error",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    setProducts([]);
    setSelectedProducts([]);
    setGeneratedLink("");
  };

  const fetchProducts = async (token) => {
    if (!token) {
      setSnackbar({
        open: true,
        message: "Authentication required",
        severity: "error",
      });
      return;
    }

    try {
      const response = await fetch(`${BASE_API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        setSnackbar({
          open: true,
          message: "Error fetching products",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setSnackbar({
        open: true,
        message: error.message || "Error fetching products",
        severity: "error",
      });
    }
  };

  const handleAddProduct = () => {
    if (!selectedProductId || !quantity || quantity < 1) return;

    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    setSelectedProducts((prev) => [
      ...prev,
      {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: parseInt(quantity),
      },
    ]);

    setSelectedProductId("");
    setQuantity("1");
  };

  const handleRemoveProduct = (index) => {
    setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerateLink = async () => {
    if (selectedProducts.length === 0) {
      setSnackbar({
        open: true,
        message: "Please add at least one product",
        severity: "warning",
      });
      return;
    }

    const token = localStorage.getItem("adminToken");
    if (!token) {
      setSnackbar({
        open: true,
        message: "Please login again",
        severity: "error",
      });
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_API_URL}/generate-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          products: selectedProducts.map((p) => ({
            productId: p.id,
            quantity: p.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (data.success) {
        const checkoutLink = `${window.location.origin}/checkout/${data.linkId}`;
        setGeneratedLink(checkoutLink);
        setSnackbar({ open: true, message: "Link generated successfully!" });
        setSelectedProducts([]); // Clear the selection after successful generation
      } else {
        setSnackbar({
          open: true,
          message: data.message || "Error generating link",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setSnackbar({ open: true, message: "Error generating link" });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setSnackbar({ open: true, message: "Link copied to clipboard!" });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" gutterBottom>
            {isAuthenticated ? "Generate Checkout Link" : "Admin Login"}
          </Typography>
          {isAuthenticated && (
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Box>

        {!isAuthenticated ? (
          <Paper elevation={3} sx={{ p: 3 }}>
            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Username"
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, username: e.target.value })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                Login
              </Button>
            </form>
          </Paper>
        ) : (
          <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Add Products
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  sx={{ flexGrow: 1 }}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select a product
                  </MenuItem>
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name} - ₹{product.price}
                    </MenuItem>
                  ))}
                </Select>
                <TextField
                  label="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  InputProps={{ inputProps: { min: 1 } }}
                  sx={{ width: 100 }}
                />
                <Button variant="contained" onClick={handleAddProduct}>
                  Add
                </Button>
              </Box>

              {selectedProducts.length > 0 && (
                <TableContainer component={Paper} sx={{ mb: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedProducts.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="right">₹{item.price}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">
                            ₹{item.price * item.quantity}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveProduct(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} align="right">
                          <strong>Total Amount:</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>
                            ₹
                            {selectedProducts.reduce(
                              (sum, item) => sum + item.price * item.quantity,
                              0
                            )}
                          </strong>
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              <Button
                fullWidth
                variant="contained"
                onClick={handleGenerateLink}
                disabled={selectedProducts.length === 0}
                sx={{ mt: 2 }}
              >
                Generate Link
              </Button>
            </Box>

            {generatedLink && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom>
                  Generated Link:
                </Typography>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: "grey.100",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ flexGrow: 1, wordBreak: "break-all" }}
                  >
                    {generatedLink}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleCopyLink}
                  >
                    Copy
                  </Button>
                </Paper>
              </Box>
            )}
          </Paper>
        )}
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminPage;
