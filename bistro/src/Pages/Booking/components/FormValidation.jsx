
export const validateBookingForm = (values) => {
    const errors = {};
  
    if (!values.name) {
      errors.name = "Name is required.";
    }
  
    const egyptPhoneRegex = /^(?:\+20|0)?1[0125][0-9]{8}$/;
    if (!values.phone) {
      errors.phone = "Phone number is required.";
    } else if (!egyptPhoneRegex.test(values.phone)) {
      errors.phone = "Please enter a valid Egyptian phone number.";
    }
  
    const today = new Date().toISOString().split("T")[0]; // Current date
    if (!values.date) {
      errors.date = "Date is required.";
    } else if (values.date < today) {
      errors.date = "Please choose a future date.";
    }
  
    if (!values.time) {
      errors.time = "Time is required.";
    } else {
      const now = new Date();
      const selectedDate = new Date(values.date);
      const selectedTime = values.time.split(":");
      const selectedDateTime = new Date(selectedDate.setHours(selectedTime[0], selectedTime[1]));
  
      if (values.date === today && selectedDateTime < now) {
        errors.time = "Please choose a future time.";
      }
    }
  
    if (!values.numOfPersons || values.numOfPersons === "") {
      errors.numOfPersons = "Please select the total number of Persons.";
    }
  
    return errors;
  };
  