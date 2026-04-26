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
  if (!toggle || !inputEl || !iconEl) return;

  toggle.addEventListener("click", () => {
    const isPassword = inputEl.type === "password";
    inputEl.type = isPassword ? "text" : "password";

    if (isPassword) {
      // eye-off
      iconEl.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="eye-off" aria-hidden="true" class="lucide lucide-eye-off text-(--text) absolute right-4 top-9.25 w-5 lg:w-5.5 cursor-pointer hover:text-(--primary) transition duration-300" id="icon-eye-confirm"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"></path><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"></path><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"></path><path d="m2 2 20 20"></path></svg>`;
    } else {
      // eye
      iconEl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="eye" aria-hidden="true" class="lucide lucide-eye text-(--text) absolute right-4 top-9.25 w-5 lg:w-5.5 cursor-pointer hover:text-(--primary) transition duration-300" id="icon-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    }
  });
}
