const validateForm = (values) => {
  const error = {
    petName: "",
    description: "",
    breed: "",
    age: "",
    price: "",
  };

  if (values.petName === "") {
    error.petName = "Pet Name is Required!";
  }
  if (values.description === "") {
    error.description = "Description is Required!";
  }
  if (values.breed === "") {
    error.breed = "Breed is Required!";
  }
  if (values.age === "") {
    error.age = "Age is Required!";
  }
  if (values.price === "") {
    error.price = "Price is Required!";
  }

  return error;
};

export { validateForm };
