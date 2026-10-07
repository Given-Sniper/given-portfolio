# Portfolio Setup Guide

## 1. Check your files

Your folder should contain:

    given-portfolio/
    ├── index.html
    ├── style.css
    ├── script.js
    ├── config.js
    ├── admin.html
    ├── admin.js
    ├── supabase.sql
    ├── README.md
    └── SETUP.md

On Windows, enable **View → Show → File name extensions**
in File Explorer.

Make sure filenames do not end in `.txt`.
For example, use `index.html`, not `index.html.txt`.

## 2. Preview the portfolio

Double-click `index.html` to view the basic website.

Check that:

- The white and warm brown styling appears.
- All five projects are displayed.
- Both IBM certificates are displayed.
- The mobile menu opens and closes on a narrow screen.
- Your email, GitHub and LinkedIn links are correct.

Your profile picture initially uses a placeholder.
The CV button is hidden until a CV is uploaded.

Owner uploads need the Supabase setup below.

## 3. Upload to GitHub

1. Create a repository named `given-portfolio`.
2. Choose **Add file → Upload files**.
3. Upload the files inside your local folder.
4. Keep `index.html` at the repository root.
5. Click **Commit changes**.

Do not upload a ZIP instead of the website files.

## 4. Publish with GitHub Pages

1. Open your repository's **Settings**.
2. Select **Pages**.
3. Under **Build and deployment**, choose
   **Deploy from a branch**.
4. Select branch **main**.
5. Select folder **/ (root)**.
6. Click **Save**.

Wait for GitHub to display the published website address.

For the account Given-Sniper and repository given-portfolio,
the expected address is:

    https://given-sniper.github.io/given-portfolio/

Confirm deployment succeeded in GitHub before sharing the link.

The public portfolio can be published before configuring uploads.

## 5. Create your Supabase project

Supabase provides authentication, database storage and file uploads.

1. Create a Supabase account at https://supabase.com.
2. Create a new project.
3. Keep the database password securely.
4. Wait for the project to finish provisioning.

Do not put the database password in any website file.

## 6. Create your owner account

In the Supabase dashboard:

1. Open **Authentication**.
2. In the authentication settings, disable new user signups.
3. Open **Users** and manually create your owner account.
4. Use your email and a strong password.
5. Ensure the account is confirmed using the dashboard's
   confirmation option if available.
6. Copy the account's **User UID / UUID**.

The UUID identifies the account permitted to manage your uploads.

Disabling signups does not replace the database access policies.

## 7. Prepare and run the SQL

1. Open your local `supabase.sql` file in Notepad.
2. Replace every occurrence of:

       OWNER_USER_UUID

   with the UUID of your owner account.

3. Save the file.
4. Open **SQL Editor** in Supabase.
5. Paste the entire SQL file into a new query.
6. Run it.

Run this setup once in a new project.
If it reports an error, resolve the error before continuing.
Do not repeatedly rerun it against an existing setup.

The SQL creates:

- The `portfolio_assets` table
- Public read access for portfolio entries
- Owner-only entry management
- A public `portfolio` storage bucket
- Owner-only file management
- A 10 MB upload limit

Your owner UUID is not a password.
Never paste your password into the SQL.

## 8. Connect the website

Find your project's URL and public API key in the Supabase
project settings or Connect panel.

Use a **publishable key**, or the legacy **anon key**.

Edit `config.js`:

    window.PORTFOLIO_CONFIG = {
      supabaseUrl: "https://YOUR-PROJECT.supabase.co",
      supabasePublishableKey: "YOUR-PUBLIC-KEY"
    };

Replace the examples with your real public settings.

Never use a secret key or service-role key.
Those keys must not be included in browser code.

Upload the updated `config.js` to GitHub and commit the change.
Wait for GitHub Pages to redeploy.

## 9. Upload your content

Open your published portfolio and select **Owner login**.

1. Sign in with the owner account created in Supabase.
2. Choose an upload type:
   - Certificate
   - Profile picture
   - CV
3. Enter a title.
4. For certificates, enter the issuer and date received.
5. Optionally enter an HTTPS verification link.
6. Select a file and upload it.
7. Refresh the public portfolio to check the result.

Accepted files:

- JPEG
- PNG
- WebP
- PDF

Maximum size: 10 MB.

Profile pictures must be images.

The login session is held in memory.
Reloading the owner page requires signing in again.
If the session expires, sign out and sign in again.

## 10. Add your two IBM certificates

Upload both certificates with these details:

### Introduction to Cloud

- Issuer: IBM SkillsBuild
- Date: 2023-06-21
- Verification link:

https://courses.skillsbuild.skillsnetwork.site/certificates/1ada362b9c3e4064a69b01691fe7b0b6

### Introduction to Containers, Kubernetes, and OpenShift V2

- Issuer: IBM SkillsBuild
- Date: 2023-06-21
- Verification link:

https://courses.skillsbuild.skillsnetwork.site/certificates/657cd52d652843a2ac70479cd75b8673

Once you upload any certificate, the portfolio displays the
uploaded certificate catalogue instead of the initial entries.
Upload both IBM certificates to keep both visible.

The links were transcribed from the supplied certificate images.
Check each link opens the correct certificate.

## 11. Update or remove uploads

To replace a certificate:

1. Upload the replacement.
2. Remove the old entry.

The latest uploaded profile picture and CV appear on the portfolio.

Remove obsolete uploads from the owner area.

If an entry is removed but file deletion fails, remove the
remaining file through Supabase Storage.

Uploaded files are publicly accessible.
Upload only material intended for portfolio visitors.

## 12. Verify everything

After publishing and connecting Supabase, check:

- Desktop and mobile layouts
- Navigation menu
- Contact links
- Certificate verification links
- Owner sign-in and sign-out
- Certificate upload and removal
- Profile picture display
- CV display and download when added

Also verify in Supabase that:

- Signed-out visitors cannot add, update or delete entries.
- A signed-in non-owner cannot manage entries or files.
- Your owner account can upload and remove files.

Hiding the owner dashboard is not an access restriction.
The database and storage policies enforce owner permissions.

## Troubleshooting

### The page has no styling

Check that `style.css` is beside `index.html` and does not
have a `.txt` extension.

### Projects and certificates are missing

Check that `script.js` exists and was copied completely.

### Uploads say configuration is needed

Add your project URL and public key to `config.js`,
upload the updated file and wait for deployment.

### Login or uploads fail

Check:

- The project URL and public key
- The owner email and password
- The owner's account confirmation status
- The owner UUID in the SQL policies
- The `portfolio_assets` table
- The `portfolio` storage bucket
- The file type and size

Use the published HTTPS website for uploads.

### New changes are not visible

Wait for GitHub Pages deployment to finish, then refresh
the page with Ctrl+F5 on Windows.