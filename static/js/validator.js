// the patterns to validate the inputs
const patterns = {
  name: /^[a-zA-Z\u0600-\u06FF\s]{2,30}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password: /^.{8,}$/,
  phone: /^\+?[\d\s\-().]{7,20}$/,
};

// error messages to be shown
const messages = {
  required: (label) => `${label} is required.`,
  name: (label) => `${label} must be 2-30 letters.`,
  email: () => "Please enter a valid email address.",
  password: () => "Password must contain at least 8 characters",
  confirmPassword: () => "Passwords do not match.",
  phone: () => "Please enter a valid phone number.",
};

const showError = (inputEl, msgEl, message) => {
  msgEl.textContent = message;
  msgEl.classList.remove("hidden");
  inputEl.classList.add("border-red-500");
};

const clearError = (inputEl, msgEl) => {
  msgEl.textContent = "";
  msgEl.classList.add("hidden");
  inputEl.classList.remove("border-red-500");
};

// validate
const validateField = (rule) => {
  const inputEl = document.getElementById(rule.inputId);
  const msgEl = document.getElementById(rule.msgId);

  // stop executing if there no input or message element
  if (!inputEl || !msgEl) {
    return true;
  }

  const value = inputEl.value.trim();
  const isRequired = rule.required !== false;

  // early return pattern
  // check every case by its own , and not to check all of them together, !value, required, pattern

  //empty check
  if (!value) {
    // required check
    if (isRequired) {
      showError(inputEl, msgEl, messages.required(rule.label));
      return false;
    }
    clearError(inputEl, msgEl);
    return true;
  }

  // type check
  switch (rule.type) {
    case "name":
      if (!patterns.name.test(value)) {
        showError(inputEl, msgEl, messages.name(rule.label));
        return false;
      }
      break;
    case "email":
      if (!patterns.email.test(value)) {
        showError(inputEl, msgEl, messages.email());
        return false;
      }
      break;
    case "password":
      if (!patterns.password.test(value)) {
        showError(inputEl, msgEl, messages.password());
        return false;
      }
      break;
    case "confirmPassword":
      const ref = rule.getRef ? rule.getRef() : "";
      if (value !== ref) {
        showError(inputEl, msgEl, messages.confirmPassword());
        return false;
      }
      break;
    case "phone":
      if (!patterns.phone.test(value)) {
        showError(inputEl, msgEl, messages.phone());
        return false;
      }
      break;
  }
  clearError(inputEl, msgEl);
  return true;
};

// validate every rule in an array.
// returns true only if all fields pass
const validateForm = (rules) => {
  return rules.map(validateField).every(Boolean);
};

// attach events to the input
const attachLiveValidation = (rule) => {
  const inputEl = document.getElementById(rule.inputId);
  inputEl.addEventListener("blur", () => validateField(rule));
  inputEl.addEventListener("input", () => validateField(rule));
};

// show password
function setupPasswordToggle(toggleId, inputId, iconId) {
  const toggle = document.getElementById(toggleId);
  const inputEl = document.getElementById(inputId);
  const iconEl = document.getElementById(iconId);
  if (!toggle || !inputEl) return;

  toggle.addEventListener("click", () => {
    const isPassword = inputEl.type === "password";
    inputEl.type = isPassword ? "text" : "password";
    if (iconEl) {
      iconEl.setAttribute("data-lucide", isPassword ? "eye-off" : "eye");
      // rerender the Lucide icon if the library is present
      if (window.lucide) window.lucide.createIcons();
    }
  });
}
