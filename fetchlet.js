(async function () {
  const EXIT_VALUE = "exit";
  const ALLOWED_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
  const METHODS_WTIH_BODY = ["POST", "PUT", "PATCH"];

  function isValidURL(url) {
    try {
      new URL(url);
    } catch (err) {
      return false;
    }
    return true;
  }

  function isValidJSON(json) {
    try {
      JSON.parse(json);
    } catch (e) {
      return false;
    }
    return true;
  }

  async function requestGET(url) {
    const response = await axios.get(url);
    return response.data;
  }

  async function requestPOST(url, body) {
    const response = await axios.post(url, body);
    return response.data;
  }

  async function requestPUT(url, body) {
    const response = await axios.put(url, body);
    return response.data;
  }

  async function requestPATCH(url, body) {
    const response = await axios.patch(url, body);
    return response.data;
  }

  async function requestDELETE(url) {
    const response = await axios.delete(url);
    return response.data;
  }

  function formatJSON(data) {
    data = JSON.stringify(data, null, 2);

    data = data.replace(/"(.*?)":|"(.*?)"/g, (m) => {
      return m.endsWith(":")
        ? `<span style="font-weight:bold">${m.substring(
            0,
            m.length - 1
          )}</span>:`
        : `<span style="color:green;">${m}</span>`;
    });

    data = data.replace(/:\s+\d+/g, (m) => {
      m = m.substring(2);
      return `: <span style="color: blue">${m}</span>`;
    });

    data = data.replace(/\{|\}/g, (m) => {
      return `<span style="color: coral">${m}</span>`;
    });
    return data;
  }

  console.log("Bookmarklet loaded!");

  let axiosScript = document.createElement("script");
  axiosScript.setAttribute(
    "src",
    "https://cdnjs.cloudflare.com/ajax/libs/axios/1.2.1/axios.min.js"
  );
  document.head.appendChild(axiosScript);

  axiosScript.onload = async () => {
    console.log("Axios loaded!");

    let method = "";
    while (ALLOWED_METHODS.indexOf(method) === -1) {
      method = prompt(
        "Please enter API method (GET/POST/PUT/PATCH/DELETE)",
        "GET"
      );
      if (method === EXIT_VALUE) {
        return;
      }
      method = method.toUpperCase();
    }

    let url = "";
    while (!isValidURL(url)) {
      url = prompt("Please enter API URL", "https://example.com/api?id=123");
      if (url === EXIT_VALUE) {
        return;
      }
    }

    let body = "";
    if (METHODS_WTIH_BODY.indexOf(method) !== -1) {
      while (!isValidJSON(body)) {
        body = prompt("Please enter API body (JSON format)", '{"key":"value"}');
        if (body === EXIT_VALUE) {
          return;
        }
        if (body === "") {
          break;
        }
      }

      body = JSON.parse(body);
    }

    let data;
    if (method === "GET") {
      data = await requestGET(url);
    } else if (method === "POST") {
      data = await requestPOST(url, body);
    } else if (method === "PUT") {
      data = await requestPUT(url, body);
    } else if (method === "PATCH") {
      data = await requestPATCH(url, body);
    } else if (method === "DELETE") {
      data = await requestDELETE(url);
    }

    formatData = formatJSON(data);

    let w = window.open("", "_blank");

    w.document.open();
    w.document.write(
      '<!DOCTYPE html><html><head><meta charset="utf‑8"><title>JSON Response</title></head>' +
        `<body><pre>${formatData}</pre><button></button></body></html>`
    );
    w.document.close();
  };
})();
