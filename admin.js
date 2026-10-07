"use strict";

const config = window.PORTFOLIO_CONFIG || {};

const statusElement = document.getElementById("status");
const loginForm = document.getElementById("login");
const dashboard = document.getElementById("dashboard");
const uploadForm = document.getElementById("upload");
const uploadsList = document.getElementById("uploads");
const certificateFields = document.getElementById(
  "certificateFields"
);

const configured = Boolean(
  config.supabaseUrl && config.supabasePublishableKey
);

/*
  Keep the login session in memory.
  Refreshing or closing this page requires signing in again.
*/
let session = null;

function showMessage(text) {
  statusElement.textContent = text;
}

function showDashboard() {
  loginForm.hidden = Boolean(session);
  dashboard.hidden = !session;
}

function field(form, name) {
  return form.elements.namedItem(name);
}

/* Make a request to your Supabase project */
async function request(path, options = {}) {
  const baseUrl = config.supabaseUrl.replace(/\/+$/, "");

  const headers = {
    apikey: config.supabasePublishableKey,
    ...(session
      ? { Authorization: "Bearer " + session.access_token }
      : {}),
    ...(options.headers || {})
  };

  const response = await fetch(baseUrl + path, {
    ...options,
    headers
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        "Login failed or your session expired. Sign in again."
      );
    }

    if (response.status === 403) {
      throw new Error(
        "Access denied. Check the owner permissions in Supabase."
      );
    }

    throw new Error(
      "The request failed. Check your details, connection " +
      "and Supabase settings."
    );
  }

  const text = await response.text();

  return text ? JSON.parse(text) : null;
}

/* Remove a file from storage */
async function removeStorageFile(filePath) {
  await request("/storage/v1/object/portfolio", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prefixes: [filePath]
    })
  });
}

/* Show uploaded entries */
async function loadUploads() {
  const rows = await request(
    "/rest/v1/portfolio_assets?select=*&order=created_at.desc"
  );

  if (!Array.isArray(rows)) {
    throw new Error("Could not read the upload list.");
  }

  uploadsList.replaceChildren();

  if (rows.length === 0) {
    const item = document.createElement("li");
    item.textContent = "No uploads yet.";
    uploadsList.append(item);
    return;
  }

  rows.forEach((row) => {
    const item = document.createElement("li");
    const title = document.createElement("span");
    const removeButton = document.createElement("button");

    title.textContent = row.title + " (" + row.kind + ")";

    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.setAttribute(
      "aria-label",
      "Remove " + row.title
    );

    removeButton.addEventListener("click", async () => {
      const confirmed = window.confirm(
        'Remove "' + row.title + '" from your portfolio?'
      );

      if (!confirmed) {
        return;
      }

      removeButton.disabled = true;

      try {
        await request(
          "/rest/v1/portfolio_assets?id=eq." +
            encodeURIComponent(row.id),
          {
            method: "DELETE"
          }
        );

        let message = "Entry and file removed.";

        try {
          await removeStorageFile(row.file_path);
        } catch {
          message =
            "The entry was removed, but its public file " +
            "could not be deleted. Remove the file from " +
            "Supabase Storage.";
        }

        await loadUploads();
        showMessage(message);
      } catch (error) {
        showMessage(error.message);
        removeButton.disabled = false;
      }
    });

    item.append(title, removeButton);
    uploadsList.append(item);
  });
}

/* Initial setup state */
if (!configured) {
  showMessage(
    "Uploads need a connected Supabase project. " +
    "We will configure this after creating the website files."
  );

  loginForm
    .querySelectorAll("input, button")
    .forEach((element) => {
      element.disabled = true;
    });
} else {
  showMessage("Sign in with your owner account.");
}

/* Login */
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!configured) {
    return;
  }

  const button = loginForm.querySelector("button");
  button.disabled = true;
  showMessage("Signing in…");

  try {
    const result = await request(
      "/auth/v1/token?grant_type=password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: field(loginForm, "email").value.trim(),
          password: field(loginForm, "password").value
        })
      }
    );

    if (!result || !result.access_token || !result.user) {
      throw new Error("Could not establish a login session.");
    }

    session = result;

    loginForm.reset();
    showDashboard();

    await loadUploads();

    showMessage(
      "Signed in. Uploaded files will be publicly visible."
    );
  } catch (error) {
    showMessage(error.message);
  } finally {
    button.disabled = false;
  }
});

/* Logout */
document.getElementById("logout").addEventListener(
  "click",
  async () => {
    const button = document.getElementById("logout");
    button.disabled = true;

    try {
      if (session) {
        await request("/auth/v1/logout", {
          method: "POST"
        });
      }
    } catch {
      /*
        Clear this page's session even if the server
        cannot be reached.
      */
    } finally {
      session = null;
      uploadForm.reset();
      uploadsList.replaceChildren();
      updateUploadFields();
      showDashboard();
      showMessage("Signed out of this page.");
      button.disabled = false;
    }
  }
);

/* Certificate-specific fields */
function updateUploadFields() {
  const kind = field(uploadForm, "kind").value;
  const isCertificate = kind === "certificate";

  certificateFields.hidden = !isCertificate;

  field(uploadForm, "issuer").required = isCertificate;
  field(uploadForm, "issued_on").required = isCertificate;

  field(uploadForm, "file").accept =
    kind === "profile"
      ? "image/jpeg,image/png,image/webp"
      : "image/jpeg,image/png,image/webp,application/pdf";
}

field(uploadForm, "kind").addEventListener(
  "change",
  updateUploadFields
);

updateUploadFields();

/* Upload a certificate, profile image or CV */
uploadForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!session) {
    showMessage("Sign in before uploading.");
    return;
  }

  const button = uploadForm.querySelector("button");
  const file = field(uploadForm, "file").files[0];
  const kind = field(uploadForm, "kind").value;
  const title = field(uploadForm, "title").value.trim();

  const issuer = field(uploadForm, "issuer").value.trim();
  const issuedOn = field(uploadForm, "issued_on").value;
  const verificationUrl = field(
    uploadForm,
    "verification_url"
  ).value.trim();

  const extensions = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "application/pdf": "pdf"
  };

  if (!title) {
    showMessage("Please add a title.");
    return;
  }

  if (
    !file ||
    !extensions[file.type] ||
    file.size > 10 * 1024 * 1024
  ) {
    showMessage(
      "Choose a JPEG, PNG, WebP or PDF no larger than 10 MB."
    );
    return;
  }

  if (kind === "profile" && file.type === "application/pdf") {
    showMessage("Choose an image for your profile picture.");
    return;
  }

  if (kind === "certificate" && (!issuer || !issuedOn)) {
    showMessage("Add the certificate issuer and date.");
    return;
  }

  if (kind === "certificate" && verificationUrl) {
    try {
      const url = new URL(verificationUrl);

      if (url.protocol !== "https:") {
        throw new Error("HTTPS required");
      }
    } catch {
      showMessage("Enter a valid HTTPS verification link.");
      return;
    }
  }

  if (!window.crypto || !window.crypto.randomUUID) {
    showMessage(
      "Open the owner page through HTTPS, such as " +
      "your GitHub Pages site, to upload files."
    );
    return;
  }

  const filePath =
    session.user.id +
    "/" +
    window.crypto.randomUUID() +
    "." +
    extensions[file.type];

  let fileUploaded = false;
  let entrySaved = false;

  button.disabled = true;
  showMessage("Uploading…");

  try {
    /* Upload the actual file */
    await request(
      "/storage/v1/object/portfolio/" + filePath,
      {
        method: "POST",
        headers: {
          "Content-Type": file.type
        },
        body: file
      }
    );

    fileUploaded = true;

    /* Save the information displayed on the portfolio */
    await request("/rest/v1/portfolio_assets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        kind,
        title,
        issuer: kind === "certificate" ? issuer : null,
        issued_on: kind === "certificate" ? issuedOn : null,
        verification_url:
          kind === "certificate"
            ? verificationUrl || null
            : null,
        file_path: filePath
      })
    });

    entrySaved = true;

    uploadForm.reset();
    updateUploadFields();

    await loadUploads();

    showMessage(
      "Uploaded successfully. Refresh your portfolio " +
      "to see the new content."
    );
  } catch (error) {
    if (entrySaved) {
      showMessage(
        "Your upload was saved, but the list could not " +
        "refresh. Reload this page and sign in again."
      );
      return;
    }

    if (fileUploaded) {
      try {
        await removeStorageFile(filePath);
      } catch {
        showMessage(
          "The upload could not be registered. A file " +
          "may remain in Supabase Storage; remove it there."
        );
        return;
      }
    }

    showMessage(error.message);
  } finally {
    button.disabled = false;
  }
});