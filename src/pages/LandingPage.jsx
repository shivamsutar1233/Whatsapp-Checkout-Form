import { Container, Typography, Box } from "@mui/material";

const LandingPage = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          py: 8,
        }}
      >
        <img
          src="https://pxkxayc7bjdy4vc0.public.blob.vercel-storage.com/Divarch%20Studio/Brand/Div-Arch.in%20Brand%20Identity-1.png"
          alt="Divarch Studio"
          style={{
            width: "120px",
            height: "120px",
            marginBottom: "2rem",
            objectFit: "contain",
          }}
        />

        <Typography
          variant="h3"
          component="h1"
          sx={{
            mb: 3,
            fontWeight: "bold",
            color: "text.primary",
          }}
        >
          Welcome to WhatsApp Checkout
        </Typography>

        <Typography
          variant="h6"
          sx={{
            mb: 4,
            color: "text.secondary",
            maxWidth: "600px",
          }}
        >
          Streamline your payments and orders through WhatsApp with our simple
          checkout system
        </Typography>
      </Box>
    </Container>
  );
};

export default LandingPage;
