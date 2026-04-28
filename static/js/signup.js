document.addEventListener("DOMContentLoaded", () => {
  // toggle eye icons to show password
  setupPasswordToggle("toggle-password", "password", "icon-eye");
  setupPasswordToggle(
    "toggle-confirm-password",
    "confirm-password",
    "icon-eye-confirm",
  );

  const signupRules = [
    {
      inputId: "first-name",
      msgId: "fname-msg",
      label: "First name",
      type: "name",
    },
    {
      inputId: "last-name",
      msgId: "lname-msg",
      label: "Last name",
      type: "name",
    },
    {
      inputId: "email",
      msgId: "email-msg",
      label: "Email",
      type: "email",
    },
    {
      inputId: "password",
      msgId: "password-msg",
      label: "Password",
      type: "password",
    },
    {
      inputId: "confirm-password",
      msgId: "confirm-password-msg",
      label: "Confirm password",
      type: "confirmPassword",
      getRef: () => document.getElementById("password").value.trim(),
    },
  ];

  const handleSignup = async (formData) => {
    try {
      const data = await apiRequest("/signup", "POST", {
        full_name: `${formData.first_name} ${formData.last_name}`.trim(),
        email: formData.email,
        password: formData.password,
      });
      auth.setUser(data.user);
      await alerts.signupSuccess();
      window.location.href = "/";
    } catch (err) {
      if (err.message.toLowerCase().includes("exist")) {
        alerts.emailExists();
      } else {
        alerts.serverError();
      }
    }
  };
  // attach the function to each input
  signupRules.forEach(attachLiveValidation);

  // validateForm function will return true or false because the every method
  const form = document.querySelector("form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(e.target));
    const isValid = validateForm(signupRules);

    if (!isValid) return;
    handleSignup(formData);
  });
});

lucide.createIcons();
