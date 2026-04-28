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

//  Geocode a free-text address → first Nominatim result
const geocode = async function (query) {
  const url = `${NOMINATIM}/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=eg`;
  const res = await fetch(url, { headers: { "Accept-Language": "ar,en" } });
  const data = await res.json();
  if (!data.length) throw new Error("Can't find the address");
  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
    label: data[0].display_name,
  };
};

// Reverse-geocode coordinates → display_name //
async function reverseGeocode(lat, lon) {
  const url = `${NOMINATIM}/reverse?lat=${lat}&lon=${lon}&format=json`;
  const res = await fetch(url, { headers: { "Accept-Language": "ar,en" } });
  const data = await res.json();
  return data.display_name || `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
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

// Draw dashed polyline between the two markers if both exist //
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
  const km = haversine(
    state.sender.lat,
    state.sender.lon,
    state.recipient.lat,
    state.recipient.lon,
  ).toFixed(1);

  // *estimate the shipping value
}

// Show a temporary loading/error state on the input //
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
