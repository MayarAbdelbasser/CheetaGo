const eyeIconContainer = document.getElementById("toggle-password");
const passwordInput = document.getElementById("password");
const emailInput = document.getElementById("email");
const emailErr = document.getElementById("email-err-msg");

// eye icon tag
const eyeSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="eye" aria-hidden="true" class="lucide lucide-eye text-(--text) absolute right-4 top-9.25 w-5 lg:w-5.5 cursor-pointer hover:text-(--primary) transition duration-300" id="icon-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
`;

const eyeOffSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="eye-off" aria-hidden="true" class="lucide lucide-eye-off text-(--text) absolute right-4 top-9.25 w-5 lg:w-5.5 cursor-pointer hover:text-(--primary) transition duration-300" id="icon-eye"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"></path><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"></path><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"></path><path d="m2 2 20 20"></path></svg>
`;

// show password function
eyeIconContainer.addEventListener("click", () => {
  const isPasswordVisible = passwordInput.type === "password";
  passwordInput.type = isPasswordVisible ? "text" : "password";
  eyeIconContainer.innerHTML = isPasswordVisible ? eyeOffSVG : eyeSVG;
});

// show not valid email while typing
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const validateEmail = (email) => {
  return emailRegex.test(email);
};
const toggleError = (input, errorElement, isValid) => {
  if (!isValid) {
    input.classList.add("outline", "outline-2", "outline-red-500", "border-0");
    errorElement.classList.remove("hidden");
  } else if (isValid) {
    input.classList.remove(
      "outline",
      "outline-2",
      "outline-red-500",
      "border-0",
    );
    errorElement.classList.add("hidden");
  }
};

emailInput.addEventListener("input", () => {
  const isEmailValid = validateEmail(emailInput.value);
  toggleError(emailInput, emailErr, isEmailValid);
});
