export const isValidProductsList = (key, details) => {
  if (!details || !Array.isArray(details)) {
    return false;
  }

  const getRequiredFields = (sku) => {
    switch (sku) {
      case "KCNP002":
        return [3];
      case "KCNP003":
        return [3, 4];
      case "KCNP004":
        return [3];
      default:
        return [];
    }
  };

  for (const product of details) {
    const requiredFields = getRequiredFields(key);
    for (const field of requiredFields) {
      if (product[field].trim() === "") {
        return false;
      }
    }
  }

  return true;
};
