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
  Typography,
} from "@mui/material";
import React from "react";
import Customize_LPSW007Item from "./Customize_LPSW007Item";

const Customize_LPSW007 = ({
  product,
  orderId,
  setCustomizationDetails,
  customizationDetails,
}) => {
  const productDetails = product[0];
  const [customizationData, setCustomizationData] = React.useState([]);
  React.useEffect(() => {
    const initialCustomizationData = [];
    if (customizationDetails && customizationDetails[`${productDetails.id}`]) {
      setCustomizationData(customizationDetails[`${productDetails.id}`]);
      return;
    }

    for (let i = 0; i < productDetails.quantity; i++) {
      initialCustomizationData.push([
        orderId,
        productDetails.SKU,
        `#${i + 1}`,
        "",
        "",
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
                  <Customize_LPSW007Item
                    productId={productDetails.id}
                    index={index}
                    setCustomizationDetails={setCustomizationDetails}
                    customizationDetails={customizationDetails}
                    setCustomizationData={setCustomizationData}
                    customizationData={customizationData}
                    key={productDetails.id + index}
                  />
                </TableCell>
              </TableRow>
            ))}
          {(customizationData?.length === 1 || !selectMultiCustom) && (
            <TableRow key={"single-customization"}>
              <TableCell colSpan={4}>
                <Customize_LPSW007Item
                  key={productDetails.id}
                  productId={productDetails.id}
                  index={0}
                  setCustomizationDetails={setCustomizationDetails}
                  customizationDetails={customizationDetails}
                  setCustomizationData={setCustomizationData}
                  customizationData={customizationData}
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Customize_LPSW007;
