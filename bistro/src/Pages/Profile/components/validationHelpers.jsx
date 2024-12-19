// validationHelpers.js
export const validateFormData = (formData) => {
  const errors = {};

  if (!formData.firstName.trim()) errors.firstName = "*First name is required";
  if (!formData.lastName.trim()) errors.lastName = "*Last name is required";
  if (!formData.email.trim()) errors.email = "*Email is required";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formData.email && !emailRegex.test(formData.email)) {
    errors.email = "*Invalid email format";
  }

  const egyptianPhoneRegex = /^(010|011|012|015)\d{8}$/;
  if (formData.phone && !egyptianPhoneRegex.test(formData.phone)) {
    errors.phone =
      "*Invalid phone number. Must start with 010, 011, 012, or 015 and be 11 digits long.";
  }

  return errors;
};
