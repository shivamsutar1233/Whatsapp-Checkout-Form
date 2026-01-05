import { useState, useEffect, useId } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
  Alert,
  Card,
  CardMedia,
  Snackbar,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { uploadImageGetUrl, checkBlobConfiguration } from "../utils/blobUpload";

const ImageUpload = ({
  onImageUpload,
  isAdminImageUpload = false,
  uploadedImageURL,
  key,
}) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [configError, setConfigError] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const imageUploadId = useId();
  // Check if Vercel Blob is configured on component mount
  useEffect(() => {
    const checkConfig = async () => {
      const config = await checkBlobConfiguration();
      if (!config.configured) {
        setConfigError(true);
        setError(config.message);
      }
    };
    checkConfig();
  }, []);

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Check configuration
    if (configError) {
      setError("Vercel Blob is not configured. Please set up the token.");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("File size must be less than 5MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result);
    };
    reader.readAsDataURL(file);

    // Upload to Vercel Blob
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const url = await uploadImageGetUrl(file);

      if (url) {
        setBlobUrl(url);
        setSuccess(true);
        onImageUpload?.(url);

        // Clear preview after 3 seconds
        setTimeout(() => {
          setPreview(null);
        }, 3000);
      } else {
        setError("Failed to upload image. Please try again.");
      }
    } catch (err) {
      setError(`Upload error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer?.files?.[0];
    if (file) {
      // Trigger file select logic
      const event = { target: { files: [file] } };
      handleFileSelect(event);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(blobUrl);
      setToast({
        open: true,
        message: "URL copied to clipboard!",
        type: "success",
      });
    } catch (err) {
      setToast({ open: true, message: "Failed to copy URL", type: "error" });
    }
  };

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToast({ ...toast, open: false });
  };

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }} key={key}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold", color: "text.primary" }}
      >
        Upload Image
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && blobUrl && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Image uploaded successfully!
          {isAdminImageUpload && (
            <Typography variant="caption" component="div" sx={{ mt: 1 }}>
              URL: <code>{blobUrl}</code>
            </Typography>
          )}
        </Alert>
      )}

      <Box
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        sx={{
          border: "2px dashed",
          borderColor: "primary.main",
          borderRadius: 2,
          p: 3,
          textAlign: "center",
          backgroundColor: "action.hover",
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: "primary.dark",
            backgroundColor: "action.selected",
          },
        }}
      >
        <input
          accept="image/*"
          hidden
          id={imageUploadId}
          type="file"
          onChange={handleFileSelect}
          disabled={loading}
        />

        <label
          htmlFor={imageUploadId}
          style={{ cursor: "pointer", width: "100%" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: "primary.main" }} />
            <Typography variant="body1" sx={{ fontWeight: "500" }}>
              Drag and drop your image here
            </Typography>
            <Typography variant="body2" color="text.secondary">
              or click to select a file
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Supported formats: JPG, PNG, GIF, WebP (Max 5MB)
            </Typography>

            {loading && (
              <Box
                sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <CircularProgress size={20} />
                <Typography variant="body2">Uploading...</Typography>
              </Box>
            )}
          </Box>
        </label>
      </Box>

      {isAdminImageUpload && blobUrl && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "600" }}>
            Uploaded Image URL
          </Typography>
          <Box
            sx={{
              p: 2,
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
              wordBreak: "break-all",
              fontFamily: "monospace",
              fontSize: "0.85rem",
            }}
          >
            {blobUrl}
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={handleCopyUrl}
            sx={{ mt: 1 }}
          >
            Copy URL
          </Button>
        </Box>
      )}
      {(preview || blobUrl || uploadedImageURL) && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "600" }}>
            Preview
          </Typography>
          <Card sx={{ maxWidth: 300 }}>
            <CardMedia
              component="img"
              height="200"
              image={preview || blobUrl || uploadedImageURL}
              alt="Preview"
            />
          </Card>
        </Box>
      )}

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.type}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ImageUpload;
