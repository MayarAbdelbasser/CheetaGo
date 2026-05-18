if (!auth.isLoggedIn()) {
  window.location.href = "/signin";
}
if (auth.getUser().email == "admin@test.com") {
  alerts.notAuthorized();
  setTimeout(() => {
    window.location.href = "/dashboard";
  }, 2500);
}
let km = 0;
// calculate shipping price
const calculateShipping = (distance, type) => {
  const rates = {
    envelope: 0.5,
    bag: 1.2,
    box: 2.5,
  };
  const selectedRate = rates[type] || rates.box;
  const totalCost = distance * selectedRate;
  return totalCost;
};

document.addEventListener("DOMContentLoaded", () => {
  const NOMINATIM = "https://nominatim.openstreetmap.org";
  const DEFAULT_CENTER = [30.0444, 31.2357]; // Cairo location
  const DEFAULT_ZOOM = 11;

  // start initial rendering
  const map = L.map("map", {
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    zoomControl: true,
    attributionControl: true,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);

  // instead of using the default leaflet maker, we create new one
  function makeIcon(color) {
    return L.divIcon({
      className: "",
      html: `
      <div style="
        width: 28px; height: 28px;
        background: ${color};
        border: 3px solid #fff;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 8px rgba(0,0,0,0.35);
      "></div>`,
      // important values that tells the marker where to mark
      iconSize: [28, 28],
      iconAnchor: [14, 28],
      popupAnchor: [0, -30],
    });
  }

  const senderIcon = makeIcon("#1e3a8a"); // blue mark icon
  const recipientIcon = makeIcon("#f3ba1a"); // primary mark icon

  let senderMarker = null;
  let recipientMarker = null;
  let routeLine = null;

  //  Geocode a free-text address
  const geocode = async function (query, containerId) {
    const url = `${NOMINATIM}/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=eg`;
    const res = await fetch(url, { headers: { "Accept-Language": "ar,en" } });
    const data = await res.json();

    const dataContainer = document.getElementById(containerId);
    // clean old data
    dataContainer.innerHTML = "";
    // if there is no data
    if (!data.length) {
      dataContainer.classList.add("hidden");
      throw new Error("Can't find the address");
    }

    dataContainer.classList.remove("hidden");
    return new Promise((resolve) => {
      for (const d of data) {
        dataContainer.insertAdjacentHTML(
          "beforeend",
          `<p onclick="void(0)">${d.display_name}</p>`,
        );

        dataContainer.lastElementChild.addEventListener("click", () => {
          dataContainer.classList.add("hidden");
          dataContainer.innerHTML = "";
          resolve({
            lat: parseFloat(d.lat),
            lon: parseFloat(d.lon),
            label: d.display_name,
          });
        });
      }
    });
  };

  //  Geocode on Enter / Blur
  async function handleAddressInput(role) {
    const id = role === "sender" ? "sender_location" : "recipient_location";
    const containerId = role === "sender" ? "sender_data" : "recipient_data";
    const input = document.getElementById(id);
    const query = input.value.trim();
    if (!query) return;

    setInputState(input, "loading");
    try {
      const result = await geocode(query, containerId);
      placeMarker(role, result.lat, result.lon, result.label);
      input.value = result.label; // fill full address back
      setInputState(input, "ok");
    } catch (e) {
      setInputState(input, "error");
      input.placeholder = e.message;
    }
  }

  // Place or move a marker, update state, redraw line //
  function placeMarker(role, lat, lon, label) {
    const isS = role === "sender";
    state[role] = { lat, lon, label };

    if (isS) {
      if (senderMarker) map.removeLayer(senderMarker);
      senderMarker = L.marker([lat, lon], { icon: senderIcon })
        .addTo(map)
        .bindPopup(`<b>Send from</b><br>${label}`);
    } else {
      if (recipientMarker) map.removeLayer(recipientMarker);
      recipientMarker = L.marker([lat, lon], { icon: recipientIcon })
        .addTo(map)
        .bindPopup(`<b>Sent to</b><br>${label}`);
    }

    drawRoute();
  }
  // location coordinates
  const state = {
    sender: null, // { lat, lon, label }
    recipient: null, // { lat, lon, label }
  };
  //  Haversine distance in km
  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // Reverse-geocode coordinates → display_name
  async function reverseGeocode(lat, lon) {
    const url = `${NOMINATIM}/reverse?lat=${lat}&lon=${lon}&format=json`;
    const res = await fetch(url, { headers: { "Accept-Language": "ar,en" } });
    const data = await res.json();
    return data.display_name || `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  }

  // Draw dashed polyline between the two markers if both exist
  function drawRoute() {
    if (routeLine) {
      map.removeLayer(routeLine);
      routeLine = null;
    }
    if (!state.sender || !state.recipient) return;

    const pts = [
      [state.sender.lat, state.sender.lon],
      [state.recipient.lat, state.recipient.lon],
    ];

    routeLine = L.polyline(pts, {
      color: "#6366f1",
      weight: 3,
      dashArray: "10 6",
      opacity: 0.85,
    }).addTo(map);

    // Fit map to show both points
    map.fitBounds(L.latLngBounds(pts), { padding: [60, 60] });

    // Distance
    km = haversine(
      state.sender.lat,
      state.sender.lon,
      state.recipient.lat,
      state.recipient.lon,
    ).toFixed(1);
  }

  // Show a temporary loading/error state on the input
  function setInputState(input, state) {
    const base = "p-3 pl-2 border rounded-md text-sm flex-1 transition-colors";
    if (state === "loading") {
      input.style.borderColor = "#a5b4fc";
      input.disabled = true;
    } else if (state === "error") {
      input.style.borderColor = "#f87171";
      input.disabled = false;
    } else {
      input.style.borderColor = "";
      input.disabled = false;
    }
  }

  function bindInput(role) {
    const id = role === "sender" ? "sender_location" : "recipient_location";
    const input = document.getElementById(id);

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddressInput(role);
      }
    });
    input.addEventListener("blur", () => handleAddressInput(role));
  }

  bindInput("sender");
  bindInput("recipient");

  // "Use My Location" buttons
  function createLocBtn(role) {
    const color = role === "sender" ? "#3b82f6" : "#ef4444";
    const inputId =
      role === "sender" ? "sender_location" : "recipient_location";
    const label = "Get my location";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = label;
    btn.title = "Getting your location";
    btn.style.cssText = `
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 600;
    color: ${color};
    background: transparent;
    border: 1.5px solid ${color};
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    white-space: nowrap;
  `;

    btn.addEventListener("mouseenter", () => {
      btn.style.background = color;
      btn.style.color = "#fff";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.background = "transparent";
      btn.style.color = color;
    });

    btn.addEventListener("click", () => {
      if (!navigator.geolocation) {
        alert("Your browser doesn't support maps");
        return;
      }
      btn.textContent = "Processing";
      btn.disabled = true;

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude: lat, longitude: lon } = pos.coords;
          try {
            const label = await reverseGeocode(lat, lon);
            document.getElementById(inputId).value = label;
            placeMarker(role, lat, lon, label);
          } catch {
            document.getElementById(inputId).value =
              `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
            placeMarker(role, lat, lon, `${lat.toFixed(5)}, ${lon.toFixed(5)}`);
          }
          btn.textContent = "Location selected";
          setTimeout(() => {
            btn.textContent = label;
            btn.disabled = false;
          }, 2000);
        },
        (err) => {
          btn.textContent = label;
          btn.disabled = false;
          const msgs = {
            1: "Location permission denied. Please allow access in your browser.",
            2: "We couldn't determine your location.",
            3: "Location request timed out. Please try again.",
          };
          alert(msgs[err.code] || "Unknown Error");
        },
        { timeout: 10000, enableHighAccuracy: true },
      );
    });

    return btn;
  }

  // Inject buttons after the input rows
  function injectLocButtons() {
    const rows = [
      { role: "sender", inputId: "sender_location" },
      { role: "recipient", inputId: "recipient_location" },
    ];

    rows.forEach(({ role, inputId }) => {
      const input = document.getElementById(inputId);
      if (!input) return;
      const row = input.closest("div.flex"); // the flex wrapper
      if (!row) return;

      const wrap = document.createElement("div");
      wrap.style.cssText =
        "display:flex;justify-content:flex-end;margin-top:2px;";
      wrap.appendChild(createLocBtn(role));

      // Insert right after the row
      row.parentNode.insertBefore(wrap, row.nextSibling);
    });
  }

  injectLocButtons();

  //  Map height (responsive)
  function syncMapHeight() {
    const mapEl = document.getElementById("map");
    const detailEl = mapEl
      .closest(".grid")
      ?.querySelector(".border-l-\\[0\\.5px\\]");
    if (detailEl && window.innerWidth >= 768) {
      mapEl.style.height = detailEl.offsetHeight + "px";
    } else {
      mapEl.style.height = "300px";
    }
    map.invalidateSize();
  }

  window.addEventListener("resize", syncMapHeight);
  // Run after a tick so the DOM is fully laid out
  setTimeout(syncMapHeight, 100);
});
