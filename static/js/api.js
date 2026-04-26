async function apiRequest(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };

  if (body) options.body = JSON.stringify(body);

  const response = await fetch(endpoint, options);
  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.error || "Something went wrong",
    };
  }

  return data;
}
