// navigate to login page if not signed in
if (!auth.isLoggedIn()) {
  window.location.href = "/signin";
}
if (auth.getUser().email == "admin@test.com") {
  alerts.notAuthorized();
  setTimeout(() => {
    window.location.href = "/dashboard";
  }, 2500);
}

// get tracking number
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const trackNumber = urlParams.get("num");

document.addEventListener("DOMContentLoaded", () => {
  const trackingBtn = document.getElementById("tracking_btn");
  const trackingInput = document.getElementById("tracking_input");

  const statusSteps = ["pending", "shipped", "delivered"];
  const statusTitles = {
    pending: "Order Pending",
    shipped: "Out for Delivery",
    delivered: "Delivered Successfully",
  };
  const statusHeaderColors = {
    pending: "text-yellow-600",
    shipped: "text-blue-600",
    delivered: "text-green-600",
  };

  // render shipment data in html
  const renderShipment = (data) => {
    document.querySelector("[data-field='shipping_cost']").textContent =
      `EGP ${data.total_price}`;
    document.querySelector("[data-field='address_from']").textContent =
      data.sender_location;
    document.querySelector("[data-field='address_to']").textContent =
      data.recipient_location;
    document.querySelector("[data-field='package_description']").textContent =
      data.package_description;

    // Status header
    const statusHeader = document.querySelector("[data-field='status_header']");
    statusHeader.textContent = statusTitles[data.status];
    statusHeader.classList.remove(
      "text-green-600",
      "text-blue-600",
      "text-yellow-600",
    );
    statusHeader.classList.add(statusHeaderColors[data.status]);

    // Status steps
    const currentIndex = statusSteps.indexOf(data.status);
    statusSteps.forEach((step, i) => {
      const dot = document.querySelector(`[data-dot='${step}']`);
      const line = document.querySelector(`[data-line='${step}']`);
      const isComplete = i <= currentIndex;

      dot.classList.remove("bg-green-600", "bg-gray-300");
      dot.classList.add(isComplete ? "bg-green-600" : "bg-gray-300");

      if (line) {
        line.classList.remove("bg-green-600", "bg-gray-300");
        line.classList.add(i < currentIndex ? "bg-green-600" : "bg-gray-300");
      }
    });

    lucide.createIcons();
  };

  const getShipment = async (shipmentId, userId) => {
    try {
      const data = await apiRequest(`shipment/${shipmentId}?user_id=${userId}`);
      renderShipment(data);
    } catch (err) {
      if (err.status === 403) {
        await alerts.notAccessedtrackingError();
        return;
      }
      if (err.status === 404) {
        await alerts.notFoundShipment();
        return;
      }
      await alerts.serverError();
    }
  };

  // get shipment status when navigating from home page
  if (trackNumber.trim() == "") {
    return;
  } else {
    trackingInput.value = trackNumber;
    const value = trackNumber;
    const userId = auth.getUser().id;

    if (value === "") {
      alerts.trackingError();
      return;
    }
    getShipment(value, userId);
  }
  trackingBtn.addEventListener("click", () => {
    const value = trackingInput.value.trim();
    const userId = auth.getUser().id;

    if (value === "") {
      alerts.trackingError();
      return;
    }
    getShipment(value, userId);
  });
});
