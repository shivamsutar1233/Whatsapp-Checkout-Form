import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

/**
 * Custom Order Details Component
 * Displays detailed 3D printing order specifications and costs
 */
const OrderDetailsComponent = ({ orderData, showLabel = true }) => {
  if (!orderData) {
    return (
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography color="text.secondary">
          No order details available
        </Typography>
      </Paper>
    );
  }

  // Helper function to format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value || 0);
  };

  // Helper function to format numbers with 2 decimals
  const formatNumber = (value, decimals = 2) => {
    return Number(value || 0).toFixed(decimals);
  };
  // Extract data with fallbacks
  const [
    orderId = "N/A",
    modelId = "N/A",
    material = "N/A",
    infill = "N/A",
    layerHeight = "N/A",
    modelUrl = "N/A",
    volume = 0,
    dimensions = "N/A",
    supportsNeeded = false,
    printTime = "N/A",
    materialCost = 0,
    serviceCharge = 0,
    totalCost = 0,
  ] = orderData[0];

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      {showLabel && (
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: "bold", color: "text.primary", mb: 3 }}
        >
          📋 Order Details
        </Typography>
      )}

      {/* Summary Cards Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Order ID Card */}
        <Grid size={12} xs={12} sm={12} md={12}>
          <Card
            sx={{ height: "100%", backgroundColor: "#f0f9ff", width: "100%" }}
          >
            <CardContent
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <Typography
                color="text.secondary"
                variant="body2"
                // sx={{ textAlign: "left" }}
              >
                Order ID
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  wordBreak: "break-all",
                  //   textAlign: "left",
                }}
              >
                {orderId}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Model ID Card */}
        <Grid item size={12} xs={12} sm={6} md={4}>
          <Card sx={{ height: "100%", backgroundColor: "#fef3c7" }}>
            <CardContent
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <Typography
                color="text.secondary"
                variant="body2"
                // sx={{ mb: 0.5 }}
              >
                Model ID
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {modelId}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Cost Card (Highlighted) */}
        <Grid item size={12} xs={12} sm={6} md={4}>
          <Card sx={{ height: "100%", backgroundColor: "#dcfce7" }}>
            <CardContent
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <Typography
                color="text.secondary"
                variant="body2"
                // sx={{ mb: 0.5 }}
              >
                Total Cost
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "success.main" }}
              >
                {formatCurrency(totalCost)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Material & Settings Section */}
      <Box sx={{ mb: 3, backgroundColor: "#f8fafc", p: 2, borderRadius: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: "600", mb: 2 }}>
          Material & Print Settings
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Material
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "500" }}>
              {material}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Infill
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "500" }}>
              {infill}%
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Layer Height
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "500" }}>
              {layerHeight} mm
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Supports Needed
            </Typography>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}
            >
              {supportsNeeded ? (
                <>
                  <CheckCircleIcon
                    sx={{ fontSize: "1.25rem", color: "success.main" }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "500", color: "success.main" }}
                  >
                    Yes
                  </Typography>
                </>
              ) : (
                <>
                  <CancelIcon
                    sx={{ fontSize: "1.25rem", color: "error.main" }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "500", color: "error.main" }}
                  >
                    No
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Specifications Section */}
      <Box sx={{ mb: 3, backgroundColor: "#faf5ff", p: 2, borderRadius: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: "600", mb: 2 }}>
          Model Specifications
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Volume
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "500" }}>
              {formatNumber(volume)} cm³
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Dimensions
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "500" }}>
              {dimensions}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Print Time
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "500" }}>
              {printTime}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Model URL
            </Typography>
            {modelUrl && modelUrl !== "N/A" ? (
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "500",
                  color: "primary.main",
                  wordBreak: "break-all",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                component="a"
                href={`https://estimator.div-arch.com/?modelId=${modelId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Model
              </Typography>
            ) : (
              <Typography variant="body1" sx={{ fontWeight: "500" }}>
                {modelUrl}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Cost Breakdown Section */}
      <Box sx={{ backgroundColor: "#f5f3ff", p: 2, borderRadius: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: "600", mb: 2 }}>
          Cost Breakdown
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#e9d5ff" }}>
                <TableCell sx={{ fontWeight: "600" }}>Description</TableCell>
                <TableCell align="right" sx={{ fontWeight: "600" }}>
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Material Cost</TableCell>
                <TableCell align="right" sx={{ fontWeight: "500" }}>
                  {formatCurrency(materialCost)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Service Charge</TableCell>
                <TableCell align="right" sx={{ fontWeight: "500" }}>
                  {formatCurrency(serviceCharge)}
                </TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: "#dcfce7" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Total Cost</TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    color: "success.main",
                  }}
                >
                  {formatCurrency(totalCost)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
};

export default OrderDetailsComponent;
