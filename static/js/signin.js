lucide.createIcons();

document.addEventListener("DOMContentLoaded", () => {
  // toggle eye icons to show password
  setupPasswordToggle("toggle-password", "password", "icon-eye");

  const signupRules = [
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
  ];

  const handleSignin = async (formData) => {
    try {
      const data = await apiRequest("/signin", "POST", {
        email: formData.email,
        password: formData.password,
      });
      console.log(data.message);
    } catch (err) {
      console.log(err);
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

    if (isValid) {
      handleSignin(formData);
    }
  });
});
