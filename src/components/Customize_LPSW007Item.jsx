import React, { useState } from "react";
import ImageUpload from "./ImageUpload";
import { Box, Checkbox, FormControlLabel } from "@mui/material";

const Customize_LPSW007Item = ({
  productId,
  index,
  customizationData,
  setCustomizationData,
  //   customizationDetails,
  setCustomizationDetails,
}) => {
  const [haveLandscapeImage, setHaveLandscapeImage] = useState(true);
  const defualtImageIndex = 3;
  return (
    <Box>
      <FormControlLabel
        control={
          <Checkbox
            checked={!haveLandscapeImage}
            onChange={(e) => setHaveLandscapeImage(!e.target.checked)}
          />
        }
        label="I want to customize my each image"
      />
      {haveLandscapeImage ? (
        <ImageUpload
          key={productId}
          onImageUpload={(url) => {
            const newCustomizationData = [...customizationData];
            newCustomizationData[index][defualtImageIndex] = url;
            newCustomizationData[index][4] = url;
            newCustomizationData[index][5] = url;
            setCustomizationData(newCustomizationData);
            setCustomizationDetails((prev) => ({
              ...prev,
              [`${productId}`]: newCustomizationData,
            }));
          }}
          uploadedImageURL={
            customizationData[index]?.length > 0
              ? customizationData[index][3]
              : null
          }
        />
      ) : (
        <React.Fragment>
          <ImageUpload
            key={`imageIndex#1`}
            onImageUpload={(url) => {
              const newCustomizationData = [...customizationData];
              newCustomizationData[index][3] = url;
              setCustomizationData(newCustomizationData);
              setCustomizationDetails((prev) => ({
                ...prev,
                [`${productId}`]: newCustomizationData,
              }));
            }}
            uploadedImageURL={customizationData[index][3]}
          />
          <ImageUpload
            key={`imageIndex#2`}
            onImageUpload={(url) => {
              const newCustomizationData = [...customizationData];
              newCustomizationData[index][4] = url;
              setCustomizationData(newCustomizationData);
              setCustomizationDetails((prev) => ({
                ...prev,
                [`${productId}`]: newCustomizationData,
              }));
            }}
            uploadedImageURL={customizationData[index][4]}
          />
          <ImageUpload
            key={`imageIndex#3`}
            onImageUpload={(url) => {
              const newCustomizationData = [...customizationData];
              newCustomizationData[index][5] = url;
              setCustomizationData(newCustomizationData);
              setCustomizationDetails((prev) => ({
                ...prev,
                [`${productId}`]: newCustomizationData,
              }));
            }}
            uploadedImageURL={customizationData[index][5]}
          />
        </React.Fragment>
      )}
    </Box>
  );
};

export default Customize_LPSW007Item;
