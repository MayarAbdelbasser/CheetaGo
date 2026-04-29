document.addEventListener("DOMContentLoaded", () => {
  const getPriceBtn = document.getElementById("get_price");
  const confirmBtn = document.getElementById("confirm_shipment");
  const distanceSpan = document.getElementById("distance");
  const userId = auth.getUser().id;

  // get price
  getPriceBtn.addEventListener("click", () => {
    if (!km || parseFloat(km) === 0) {
      alerts.missingLocations();
      return;
    }

    const packageType = document.getElementById("package_type").value;
    if (!packageType) {
      alerts.missingPackageType();
      return;
    }

    const price = calculateShipping(parseFloat(km), packageType);
    distanceSpan.textContent = price.toFixed(2);
  });

  confirmBtn.addEventListener("click", async () => {
    // Validate all required fields
    const senderLocation = document
      .getElementById("sender_location")
      .value.trim();
    const recipientLocation = document
      .getElementById("recipient_location")
      .value.trim();
    const packageDescription = document
      .getElementById("package_description")
      .value.trim();
    const packageType = document.getElementById("package_type").value;

    // check all inputs are valid and not empty
    if (!senderLocation || !recipientLocation) {
      alerts.missingLocations();
      return;
    }
    if (!packageDescription) {
      alerts.missingPackageDescription();
      return;
    }
    if (!packageType) {
      alerts.missingPackageType();
      return;
    }
    if (!km || parseFloat(km) === 0) {
      alerts.notValidDistance();
      return;
    }

    const price = calculateShipping(parseFloat(km), packageType);

    // get the info from inputs
    const payload = {
      sender_location: senderLocation,
      recipient_location: recipientLocation,
      package_description: packageDescription,
      package_type: packageType,
      distance_km: parseFloat(km),
      total_price: parseFloat(price.toFixed(2)),
      user_id: userId,
    };

    // Disable button while request is in flight
    confirmBtn.disabled = true;
    confirmBtn.textContent = "Confirming...";

    try {
      const data = await apiRequest("/shipment/confirm", "POST", payload);

      distanceSpan.textContent = price.toFixed(2);
      await alerts.shipmentConfirmSuccess(data.shipment_id);
      setTimeout(() => {
        window.location.href = "/";
      }, 2500);
    } catch (err) {
      await alerts.serverError();
    }
  });
});
