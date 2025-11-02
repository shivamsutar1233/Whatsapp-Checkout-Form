import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

const Customize_KCKR001 = ({ product, orderId, setCustomizationDetails }) => {
  const productDetails = product[0];
  const [customizationData, setCustomizationData] = React.useState([]);
  React.useEffect(() => {
    const initialCustomizationData = [];
    for (let i = 0; i < productDetails.quantity; i++) {
      initialCustomizationData.push([
        orderId,
        productDetails.SKU,
        `#${i + 1}`,
        "white",
        "white",
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
                  <FormControl fullWidth className="flex-1 flex">
                    <InputLabel id={`custom-color-${productDetail[1]}`}>
                      Color
                    </InputLabel>
                    <Select
                      labelId={`custom-color-${productDetail[1]}`}
                      id={`custom-select-${productDetail[1]}`}
                      value={productDetail[3] || ""}
                      label="Customization"
                      className="flex-1 flex "
                      onChange={(e) => {
                        const newCustomizationData = [...customizationData];
                        newCustomizationData[index][3] = e.target.value;
                        newCustomizationData[index][4] = e.target.value;
                        setCustomizationData(newCustomizationData);
                        setCustomizationDetails((prev) => ({
                          ...prev,
                          [`${productDetails.id}`]: newCustomizationData,
                        }));
                      }}
                    >
                      {productDetails?.colors?.split(",").map((color) => (
                        <MenuItem
                          key={color}
                          value={color}
                          className="flex items-center justify-between w-full gap-2"
                        >
                          <div className="flex items-center  gap-2">
                            <div
                              className={`bg-${
                                color.toString().toLowerCase() === "black" ||
                                color.toString().toLowerCase() === "white"
                                  ? color.toString().toLowerCase()
                                  : color.toString().toLowerCase() + "-500"
                              }  border border-gray-200 w-4 h-4 rounded-full ml-2`}
                            />
                            <Typography variant="body2">{color}</Typography>{" "}
                          </div>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          {(customizationData?.length === 1 || !selectMultiCustom) && (
            <TableRow key={"single-customization"}>
              <TableCell colSpan={4}>
                <FormControl fullWidth>
                  <InputLabel id={`single-custom-color-${productDetails.id}`}>
                    Color
                  </InputLabel>
                  <Select
                    labelId={`single-custom-color-${productDetails.id}`}
                    id={`single-custom-select-${productDetails.id}`}
                    value={customizationData[0]?.[3] || ""}
                    label="Customization"
                    onChange={(e) => {
                      const newCustomizationData = [...customizationData];

                      if (customizationData.length === 1) {
                        newCustomizationData[0][3] = e.target.value;
                        newCustomizationData[0][4] = e.target.value;
                        setCustomizationData(newCustomizationData);
                      } else {
                        for (let i = 0; i < newCustomizationData.length; i++) {
                          newCustomizationData[i][3] = e.target.value;
                          newCustomizationData[i][4] = e.target.value;
                        }
                      }
                      setCustomizationDetails((prev) => ({
                        ...prev,
                        [`${productDetails.id}`]: newCustomizationData,
                      }));
                      setCustomizationData(newCustomizationData);
                    }}
                  >
                    {productDetails?.colors?.split(",").map((color) => (
                      <MenuItem key={color} value={color}>
                        <div className="flex items-center  gap-2">
                          <div
                            className={`bg-${
                              color.toString().toLowerCase() === "black" ||
                              color.toString().toLowerCase() === "white"
                                ? color.toString().toLowerCase()
                                : color.toString().toLowerCase() + "-500"
                            }  border border-gray-200 w-4 h-4 rounded-full ml-2`}
                          />
                          <Typography variant="body2">{color}</Typography>{" "}
                        </div>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Customize_KCKR001;
