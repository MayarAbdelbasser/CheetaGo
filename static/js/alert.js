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
};
