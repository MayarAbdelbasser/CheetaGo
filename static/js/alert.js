const alerts = {
  signinSuccess: () =>
    Swal.fire({
      icon: "success",
      title: "Welcome Back!",
      text: "Successfully signed in",
      confirmButtonText: "Continue",
      confirmButtonColor: "var(--primary)",
      timer: 2500,
      timerProgressBar: true,
    }),
  signupSuccess: () =>
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Your account has been created",
      confirmButtonText: "Continue",
      confirmButtonColor: "var(--primary)",
    }),
  wrongCredentials: () =>
    Swal.fire({
      icon: "error",
      title: "Wrong Credentials",
      text: "Invalid email or password",
      confirmButtonText: "Try again",
      confirmButtonColor: "var(--blue)",
    }),
  emailExists: () =>
    Swal.fire({
      icon: "warning",
      title: "Email already exists",
      text: "An account with this email address already exists",
      confirmButtonText: "Use another email",
      confirmButtonColor: "var(--blue)",
    }),
  serverError: () =>
    Swal.fire({
      icon: "error",
      title: "An error occurred",
      text: "Please try again later",
      confirmButtonText: "Okay",
      confirmButtonColor: "var(--blue)",
    }),
  missingLocations: () => {
    Swal.fire({
      icon: "warning",
      title: "Missing information",
      text: "Please select both sender and recipient locations first.",
      confirmButtonText: "Ok",
      confirmButtonColor: "var(--blue)",
    });
  },
  missingPackageType: () => {
    Swal.fire({
      icon: "warning",
      title: "Missing information",
      text: "Please select a package type.",
      confirmButtonText: "Ok",
      confirmButtonColor: "var(--blue)",
    });
  },
  missingPackageDescription: () => {
    Swal.fire({
      icon: "warning",
      title: "Missing information",
      text: "Please enter a package description.",
      confirmButtonText: "Ok",
      confirmButtonColor: "var(--blue)",
    });
  },
  notValidDistance: () => {
    Swal.fire({
      icon: "warning",
      title: "Missing information",
      text: "Could not calculate distance. Please re-select your locations.",
      confirmButtonText: "Ok",
      confirmButtonColor: "var(--blue)",
    });
  },
  shipmentConfirmSuccess: (id) => {
    Swal.fire({
      icon: "success",
      title: "Shipment Confirmed!",
      text: `Shipment id: ${id}`,
      confirmButtonText: "Continue",
      confirmButtonColor: "var(--primary)",
      timer: 2500,
      timerProgressBar: true,
    });
  },
  notAuthorized: () => {
    Swal.fire({
      icon: "warning",
      title: "Not authorized",
      text: "You cannot make a shipment with admin accout.",
      confirmButtonText: "Ok",
      confirmButtonColor: "var(--blue)",
    });
  },
  confirmToDelivered: () => {
    return Swal.fire({
      title: "Are you sure?",
      text: "Change status to 'Shipped'",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    });
  },
  confirmToShipped: () => {
    return Swal.fire({
      title: "Are you sure?",
      text: "Change status to 'Delivered'",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    });
  },
};
