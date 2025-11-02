import {
  Checkbox,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

const Customize_KCNP002 = ({ product, orderId, setCustomizationDetails }) => {
  const productDetails = product[0];
  const [customizationData, setCustomizationData] = React.useState([]);
  React.useEffect(() => {
    const initialCustomizationData = [];
    for (let i = 0; i < productDetails.quantity; i++) {
      initialCustomizationData.push([
        orderId,
        productDetails.SKU,
        `#${i + 1}`,
        "",
      ]);
    }
    setCustomizationData(initialCustomizationData);
  }, [productDetails.quantity, orderId]);
  const [selectMultiCustom, setSelectMultiCustom] = React.useState(false);

  return (
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
          {/* {productDetails.map((product, index) => ( */}
          <TableRow key={productDetails.id}>
            <TableCell>
              <Typography variant="subtitle2">{productDetails.name}</Typography>
              <Typography
                variant="body2"
                className="text-gray-600 overflow-clip max-h-10"
              >
                {productDetails.description}
              </Typography>
            </TableCell>
            <TableCell align="right">₹{productDetails.price}</TableCell>
            <TableCell align="right">{productDetails.quantity}</TableCell>
            <TableCell align="right">
              ₹{productDetails.price * productDetails.quantity}
            </TableCell>
          </TableRow>
          {/* ))} */}
          {customizationData?.length > 1 && (
            <TableRow>
              <TableCell colSpan={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) => setSelectMultiCustom(e.target.checked)}
                    />
                  }
                  label="I want to customize my each product"
                />
              </TableCell>
            </TableRow>
          )}
          {selectMultiCustom &&
            customizationData?.length > 1 &&
            customizationData.map((productDetail, index) => (
              <TableRow key={index}>
                <TableCell colSpan={4}>
                  <Typography variant="subtitle2" className="max-w-4 bgbl">
                    #{index + 1}
                  </Typography>

                  <TextField
                    id={`custom-title-input-${productDetail[1]}-${index}`}
                    value={productDetail[3] || ""}
                    label="Customization Title"
                    onChange={(e) => {
                      const newCustomizationData = [...customizationData];
                      newCustomizationData[index][3] = e.target.value;
                      setCustomizationData(newCustomizationData);
                      setCustomizationDetails((prev) => ({
                        ...prev,
                        [`${productDetails.id}`]: newCustomizationData,
                      }));
                    }}
                    fullWidth
                    inputProps={{
                      maxLength: 13,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          {(customizationData?.length === 1 || !selectMultiCustom) && (
            <TableRow key={"single-customization"}>
              <TableCell colSpan={4}>
                {/* <FormControl fullWidth> */}
                <TextField
                  id={`single-custom-title-input-${productDetails.id}`}
                  value={customizationData[0]?.[3] || ""}
                  label="Customization Title"
                  inputProps={{
                    maxLength: 13,
                  }}
                  fullWidth
                  onChange={(e) => {
                    const newCustomizationData = [...customizationData];
                    newCustomizationData[0][3] = e.target.value;
                    setCustomizationData(newCustomizationData);
                    setCustomizationDetails((prev) => ({
                      ...prev,
                      [`${productDetails.id}`]: newCustomizationData,
                    }));
                  }}
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Customize_KCNP002;
