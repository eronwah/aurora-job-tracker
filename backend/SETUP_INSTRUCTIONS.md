# Google Sheet Backend Setup Instructions

This application uses a **14-column Google Sheet** as its cloud backend via Google Apps Script (`doGet` & `doPost`), enabling seamless two-way sync across Desktop and iPhone.

---

## 14 Columns Schema
1. `ID` - Application Unique ID (e.g. `APP-001`)
2. `Job Title` - Target position title
3. `Company` - Employer or hiring agency
4. `Salary (PHP)` - Monthly or hourly compensation in PHP
5. `Status` - `saved`, `applied`, `screening`, `interview`, `offer`, or `rejected`
6. `Job URL` - Direct link to the listing
7. `Platform` - `Remotive`, `Jobicy`, `Arbeitnow`, etc.
8. `Date Applied` - Date application was submitted
9. `Follow Up Date` - Scheduled reminder date for following up
10. `Resume Used` - Specific resume file name/version attached
11. `Notes` - Interview notes, recruiter feedback, context
12. `Last Updated` - ISO 8601 Timestamp of latest modification
13. `Job Description` - Full job posting description text
14. `Cover Letter` - Warm, ready-to-paste human cover letter tailored to the role

---

## How to Enable Two-Way Cloud Sync via Google Apps Script

1. Open your Google Sheet (`Job Application Tracker`).
2. Click **Extensions** in the top menu &gt; **Apps Script**.
3. Replace the default code with the contents of `backend/Code.gs`.
4. Click the 💾 **Save** icon.
5. In the top right corner, click **Deploy** &gt; **New deployment**.
6. Click the gear icon ⚙️ next to "Select type" and choose **Web app**.
7. Set the fields:
   - **Description**: `Aurora Jobs Web API`
   - **Execute as**: `Me (your Google account)`
   - **Who has access**: `Anyone`
8. Click **Deploy**, authorize permissions when prompted.
9. Copy the generated **Web app URL** (starts with `https://script.google.com/macros/s/.../exec`).
10. Open the **Google Sheet** tab in the Aurora Jobs web app, paste your **Google Sheet URL** and **Web App Deployment URL**, and click **Save Sheet Settings**.
11. *(Optional for iPhone)* Use the **Desktop → iPhone Quick Transfer** card inside the Google Sheet tab to generate a single setup code and import all your private settings on mobile in seconds!

*Note: The website also includes a 14-column **Export CSV Backup** button and auto-caches all applications locally in your browser.*
