import { Container, Box, Typography, Paper } from "@mui/material";
import ImageUpload from "../components/ImageUpload";

const ImageUploadPage = () => {
  //   const handleImageUpload = (blobUrl) => {
  //     setUploadedUrl(blobUrl);
  //   };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Image Upload
        </Typography>
      </Box>

      {/* Main Content */}
      <ImageUpload isAdminImageUpload/>

      {/* Usage Info */}
      <Paper elevation={1} sx={{ p: 3, mt: 3, backgroundColor: "#f0f9ff" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          How to Use
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Drag and drop an image file or click to select from your device
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Supported formats: JPG, PNG, GIF, WebP
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Maximum file size: 5MB
          </Typography>
          <Typography component="li" variant="body2">
            The image will be uploaded to Vercel Blob Storage and you'll receive
            a permanent URL
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ImageUploadPage;
