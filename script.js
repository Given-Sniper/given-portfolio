"use strict";

/* Your projects */
const projects = [
  {
    title: "Cross-Platform Database Indexing Performance Study",
    status: "Completed · Honours research",
    description:
      "Designed and conducted a study comparing B-tree, Hash, " +
      "Composite, and Clustered/equivalent indexing techniques " +
      "across PostgreSQL, Oracle and SQL Server. Set up the " +
      "databases, prepared datasets and queries, ran experiments, " +
      "collected execution-time results, analysed performance " +
      "differences and documented the findings in a research report.",
    technologies: [
      "PostgreSQL",
      "Oracle",
      "SQL Server",
      "Performance analysis"
    ]
  },
  {
    title: "DDoS Attack Detection & Botmaster Attribution",
    status: "Completed · Honours group project",
    description:
      "Contributed to the DDoS detection component using CTU-13 " +
      "network traffic. Analysed attack bursts and detection delays " +
      "and contributed to developing and testing the detection " +
      "approach. Also contributed to project design and discussion " +
      "of identifying and ranking potential Command-and-Control " +
      "(C2) and botmaster infrastructure.",
    technologies: [
      "CTU-13",
      "Network traffic analysis",
      "Attack detection",
      "Cybersecurity"
    ]
  },
  {
    title: "TimeSlice",
    status: "Ongoing · Personal project",
    description:
      "Developing an application using Python and PostgreSQL. " +
      "Worked on database setup, application functionality, file " +
      "handling and database backup functionality. Managing the " +
      "source code with Git and GitHub while continuing to improve " +
      "and expand the application.",
    technologies: [
      "Python",
      "PostgreSQL",
      "Git / GitHub",
      "Database backups"
    ]
  },
  {
    title: "Web Application Security Assessment",
    status: "Completed · Computer Security practical",
    description:
      "Set up DVWA using Docker and WSL/Ubuntu and performed " +
      "vulnerability testing in the testing environment. Tested " +
      "SQL injection, reflected XSS, weak authentication and " +
      "security misconfiguration. Collected evidence, explained " +
      "security impacts and documented findings and possible " +
      "mitigations.",
    technologies: [
      "DVWA",
      "Docker",
      "WSL / Ubuntu",
      "Security testing"
    ]
  },
  {
    title: "Autonomous RC Racing Car",
    status: "Ongoing · Prototype stage",
    description:
      "Involved in planning and developing a prototype with " +
      "Arduino Mega, ESP32, sensors, motors and motor controllers. " +
      "The project uses C++ to integrate hardware components, " +
      "with autonomous movement and control as development goals.",
    technologies: [
      "C++",
      "Arduino Mega",
      "ESP32",
      "Embedded systems"
    ]
  }
];

/* Certificate details from the images you supplied */
const initialCertificates = [
  {
    title: "Introduction to Cloud",
    issuer: "IBM SkillsBuild",
    issued_on: "2023-06-21",
    verification_url:
      "https://courses.skillsbuild.skillsnetwork.site/certificates/" +
      "1ada362b9c3e4064a69b01691fe7b0b6"
  },
  {
    title: "Introduction to Containers, Kubernetes, and OpenShift V2",
    issuer: "IBM SkillsBuild",
    issued_on: "2023-06-21",
    verification_url:
      "https://courses.skillsbuild.skillsnetwork.site/certificates/" +
      "657cd52d652843a2ac70479cd75b8673"
  }
];

/* Helpers */
function createElement(tag, text, className) {
  const element = document.createElement(tag);

  if (text) {
    element.textContent = text;
  }

  if (className) {
    element.className = className;
  }

  return element;
}

function safeHttpsUrl(value) {
  try {
    const url = new URL(value);

    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function publicAssetUrl(filePath) {
  const config = window.PORTFOLIO_CONFIG;

  const encodedPath = filePath
    .split("/")
    .map(encodeURIComponent)
    .join("/");

  return (
    config.supabaseUrl.replace(/\/+$/, "") +
    "/storage/v1/object/public/portfolio/" +
    encodedPath
  );
}

function formatDate(value) {
  const date = new Date(value + "T12:00:00");

  if (Number.isNaN(date.getTime())) {
    return "Date not available";
  }

  return date.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function externalLink(label, url) {
  const link = createElement("a", label);

  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  return link;
}

/* Display projects */
function renderProjects() {
  const container = document.getElementById("projectList");

  projects.forEach((project, index) => {
    const article = createElement("article", null, "project");

    const number = createElement(
      "span",
      String(index + 1).padStart(2, "0"),
      "number"
    );

    const content = createElement("div");

    content.append(
      createElement("span", project.status, "tag"),
      createElement("h3", project.title),
      createElement("p", project.description)
    );

    const chips = createElement("div", null, "chips");

    project.technologies.forEach((technology) => {
      chips.append(createElement("span", technology));
    });

    content.append(chips);
    article.append(number, content);
    container.append(article);
  });
}

/* Display certificates */
function renderCertificates(certificates) {
  const container = document.getElementById("certificateList");

  container.replaceChildren();

  certificates.forEach((certificate) => {
    const article = createElement("article");

    let fileUrl = null;

    if (certificate.file_path) {
      fileUrl = publicAssetUrl(certificate.file_path);

      const isPdf = certificate.file_path
        .toLowerCase()
        .endsWith(".pdf");

      if (!isPdf) {
        const image = createElement("img");

        image.src = fileUrl;
        image.alt = certificate.title + " certificate";
        image.loading = "lazy";

        article.append(image);
      }
    }

    article.append(
      createElement("span", "CERTIFICATE", "tag"),
      createElement("h3", certificate.title),
      createElement(
        "p",
        certificate.issuer + " · " + formatDate(certificate.issued_on)
      )
    );

    const actions = createElement(
      "div",
      null,
      "certificate-actions"
    );

    if (fileUrl) {
      actions.append(
        externalLink("View certificate ↗", fileUrl)
      );
    }

    const verificationUrl = safeHttpsUrl(
      certificate.verification_url
    );

    if (verificationUrl) {
      actions.append(
        externalLink("Verification ↗", verificationUrl)
      );
    }

    article.append(actions);
    container.append(article);
  });
}

/* Mobile navigation */
function setupNavigation() {
  const menuButton = document.getElementById("menu");
  const navigation = document.getElementById("navigation");

  function closeMenu() {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }

  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

/* Load manually uploaded content when Supabase is connected */
async function loadUploadedAssets() {
  const config = window.PORTFOLIO_CONFIG;

  if (
    !config ||
    !config.supabaseUrl ||
    !config.supabasePublishableKey
  ) {
    return;
  }

  const status = document.getElementById("assetStatus");

  try {
    const baseUrl = config.supabaseUrl.replace(/\/+$/, "");

    const response = await fetch(
      baseUrl +
        "/rest/v1/portfolio_assets?select=*&order=created_at.desc",
      {
        headers: {
          apikey: config.supabasePublishableKey
        }
      }
    );

    if (!response.ok) {
      throw new Error("The uploaded content could not be loaded.");
    }

    const assets = await response.json();

    if (!Array.isArray(assets)) {
      throw new Error("Unexpected content response.");
    }

    const certificates = assets.filter(
      (asset) => asset.kind === "certificate"
    );

    /*
      Once you upload certificates, the uploaded catalogue replaces
      the initial two entries. Upload both IBM certificates to keep
      both in your managed catalogue.
    */
    if (certificates.length > 0) {
      renderCertificates(certificates);
    }

    const profile = assets.find(
      (asset) => asset.kind === "profile"
    );

    if (profile && profile.file_path) {
      const image = document.getElementById("profile");
      const placeholder = document.getElementById(
        "portraitPlaceholder"
      );

      image.addEventListener(
        "load",
        () => {
          image.hidden = false;
          placeholder.hidden = true;
        },
        { once: true }
      );

      image.addEventListener(
        "error",
        () => {
          image.hidden = true;
          placeholder.hidden = false;
        },
        { once: true }
      );

      image.src = publicAssetUrl(profile.file_path);
    }

    const cv = assets.find(
      (asset) => asset.kind === "cv"
    );

    if (cv && cv.file_path) {
      const link = document.getElementById("cv");

      link.href = publicAssetUrl(cv.file_path);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.hidden = false;
    }
  } catch (error) {
    status.textContent =
      "Uploaded documents are temporarily unavailable. " +
      "Existing certificate details remain visible.";
  }
}

/* Start the page */
document.getElementById("year").textContent =
  new Date().getFullYear();

setupNavigation();
renderProjects();
renderCertificates(initialCertificates);
loadUploadedAssets();