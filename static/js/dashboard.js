if (!auth.isLoggedIn() || auth.getUser().email != "admin@test.com") {
  window.location.href = "/";
}
document.addEventListener("DOMContentLoaded", (e) => {
  // logout button
  const logoutBtn = document.getElementById("logout");
  logoutBtn.addEventListener("click", () => {
    auth.logout();
    location.location.href = "/";
  });
});

const updateShipmentStatus = async (id, status) => {
  const confirmMethod =
    status === "shipped" ? alerts.confirmToShipped : alerts.confirmToDelivered;
  try {
    const result = await confirmMethod();

    if (result.isConfirmed) {
      await apiRequest(`shipment/${id}/status`, "PATCH", { status });
      window.location.href = "/dashboard";
    }
  } catch (err) {
    await alerts.serverError();
  }
};
document.addEventListener("click", async (e) => {
  const target = e.target;
  // change the status
  if (target.matches("#to_shipped") || target.matches("#to_delivered")) {
    const { shipmentId, status } = target.dataset;
    await updateShipmentStatus(shipmentId, status);
  }
});
