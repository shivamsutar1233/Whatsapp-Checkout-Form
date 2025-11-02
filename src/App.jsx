import { ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import "./App.css";
import CheckoutFlow from "./pages/CheckoutFlow";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3B82F6",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="min-h-screen bg-gray-50 py-8">
          <Routes>
            <Route path="/admin" element={<AdminPage />} />
            {/* <Route path="/checkout/:linkId" element={<CheckoutForm />} /> */}
            <Route path="/checkout/:linkId" element={<CheckoutFlow />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
