const eyeIconContainer = document.getElementById("toggle-password");
const passwordInput = document.getElementById("password");
const emailInput = document.getElementById("email");
const emailErr = document.getElementById("email-err-msg");

// show password function
eyeIconContainer.addEventListener("click", () => {
  const isPasswordVisible = passwordInput.type === "password";
  passwordInput.type = isPasswordVisible ? "text" : "password";
  eyeIconContainer.innerHTML = isPasswordVisible ? eyeOffSVG : eyeSVG;
});

// show not valid email while typing
emailInput.addEventListener("input", () => {
  const isEmailValid = validateEmail(emailInput.value);
  toggleError(emailInput, emailErr, isEmailValid);
});
