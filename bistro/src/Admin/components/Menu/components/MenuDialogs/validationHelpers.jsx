export const validateFormData = (formData) => {
  const errors = {};

  if (!formData.name.trim()) {
    errors.name = "*Item name is required";
  }

  if (!formData.category.trim()) {
    errors.category = "*Category is required";
  }

  if (!formData.price) {
    errors.price = "*Price is required";
  } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
    errors.price = "*Price must be a positive number";
  }

  if (!formData.description.trim()) {
    errors.description = "*Description is required";
  }

  // Validate the photo if it's a new upload (optional, depending on use case)
  if (formData.photo && typeof formData.photo !== "string") { // Check if it's a file, not a URL
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validImageTypes.includes(formData.photo.type)) {
      errors.photo = "*Only JPG, PNG, and GIF images are allowed";
    }
  }

  return errors;
};
