# Given Portfolio

A professional portfolio for **Sitole Rethabile Given**, a
BSc Honours in Computer Science student at the
**University of Limpopo in 2026**.

The portfolio presents my academic background, research,
technical projects, student support experience and certificates
to recruiters and potential collaborators.

## Career interests

- Data analysis and business intelligence
- Database administration
- AI and machine learning
- Software development
- Data engineering

## Education

- **BSc Honours in Computer Science**
  — University of Limpopo, current studies in 2026.
- **BSc in Mathematics and Computer Science**
  — University of Limpopo, completed.

## Featured projects

### Cross-Platform Database Indexing Performance Study

Completed Honours research comparing B-tree, Hash, Composite,
and Clustered/equivalent indexing techniques across PostgreSQL,
Oracle and SQL Server.

My work included database setup, dataset and query preparation,
experiments, execution-time analysis and research documentation.

### DDoS Attack Detection & Botmaster Attribution

Completed Honours group project using CTU-13 network traffic.

My contributions included DDoS detection, attack-burst and
detection-delay analysis, development and testing, and discussions
around identifying potential C2/botmaster infrastructure.

### TimeSlice

An ongoing personal application built using Python and PostgreSQL.

Work includes application functionality, database setup, file
handling, database backups and source control with Git/GitHub.

### Web Application Security Assessment

Completed practical security assessment using DVWA, Docker and
WSL/Ubuntu in a vulnerable testing environment.

Testing covered SQL injection, reflected XSS, weak authentication
and security misconfiguration, with documented findings and
possible mitigations.

### Autonomous RC Racing Car

An ongoing embedded systems prototype involving Arduino Mega,
ESP32, sensors, motors, motor controllers and C++.

Autonomous movement and control are development goals.

## Experience

**SI Leader & Student Assistant**
University of Limpopo, **2023–2025**.

Supported students in Mathematics and Applied Mathematics,
developing communication, leadership, teamwork and
problem-solving skills.

## Certificates

Issued by **IBM SkillsBuild on 21 June 2023**:

- Introduction to Cloud
- Introduction to Containers, Kubernetes, and OpenShift V2

Certificate details and verification links are included.
Certificate images can be added through the configured owner area.

## Website features

- White and warm brown theme
- Responsive desktop and mobile layouts
- Education, skills, projects and experience sections
- Certificate verification links
- Email, GitHub and LinkedIn contact links
- Owner login and upload interface
- Profile picture, certificate and CV upload support through Supabase

The static portfolio works without Supabase.
Owner login and uploads require Supabase configuration.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Main portfolio page |
| `style.css` | Styling and responsive layouts |
| `script.js` | Projects, certificates and public page behaviour |
| `config.js` | Public Supabase configuration |
| `admin.html` | Owner login and upload page |
| `admin.js` | Authentication and upload behaviour |
| `supabase.sql` | Database, storage and owner access policies |
| `README.md` | Repository overview |
| `SETUP.md` | Setup and publishing instructions |

## View the portfolio locally

Keep all website files in the same folder.

Open `index.html` in your browser to view the basic portfolio.

For development with a local server, if Python is installed:

    python -m http.server 8000

Run that command from the portfolio folder, then open:

    http://localhost:8000

No package installation or build is required.

## Publish on GitHub Pages

1. Create a repository named `given-portfolio`.
2. Upload the website files directly to the repository root.
3. Open **Settings → Pages**.
4. Select **Deploy from a branch**.
5. Select **main** and **/ (root)**.
6. Save and wait for GitHub to provide the published site address.

Upload the extracted files, not a ZIP archive.

## Enable owner uploads

Follow `SETUP.md` to configure Supabase authentication,
database access and storage.

Only public client settings belong in `config.js`.
Never commit passwords, secret keys or service-role keys.

Files in the portfolio storage bucket are publicly viewable.
Upload only documents intended for visitors.

## Content still to add

- Profile picture
- Certificate images or PDFs
- CV when available
- Project links and demonstrations when available

The CV button stays hidden until a CV is uploaded.

## Contact

- **Email:** sitolerethabile@gmail.com
- **GitHub:** https://github.com/Given-Sniper
- **LinkedIn:** https://www.linkedin.com/in/rethabile-sitole-97b900252