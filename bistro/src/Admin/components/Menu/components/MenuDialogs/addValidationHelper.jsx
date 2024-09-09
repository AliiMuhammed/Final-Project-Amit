export const validateFormData = (formData) => {
    const errors = {};
  
    // Validate name
    if (!formData.name.trim()) {
      errors.name = "*Item name is required";
    }
  
    // Validate category
    if (!formData.category.trim()) {
      errors.category = "*Category is required";
    }
  
    // Validate price
    if (!formData.price) {
      errors.price = "*Price is required";
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      errors.price = "*Price must be a positive number";
    }
  
    // Validate description
    if (!formData.description.trim()) {
      errors.description = "*Description is required";
    }
  
    // Validate photo (required and type check)
    if (!formData.photo) {
      errors.photo = "*Photo is required";
    } else if (typeof formData.photo !== "string") { // Check if it's a file, not a URL
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(formData.photo.type)) {
        errors.photo = "*Only JPG, PNG, and GIF images are allowed";
      }
    }
  
    return errors;
  };
  