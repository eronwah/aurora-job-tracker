# Aurora Jobs — Daily Remote Job Tracker & Search Hub

A responsive **Liquid Aurora** React web application built for daily job application tracking, real-time non-AI remote job searching, Google Drive resume integration, warm human-sounding cover letters, and two-way **14-column Google Sheet** synchronization across Desktop and iPhone 17 Pro Max.

---

## Features

- **Pure Table Application Pipeline:** Stage Filter Pills (`Saved / Target`, `Applied`, `Screening / HR`, `Technical / Interview`, `Offer Received`, `Archived / Rejected`), search, sorting, inline stage updates, and responsive mobile rows.
- **Tabbed Job Details & Cover Letter Modal:** Click any job row to inspect its full job description or edit/copy a warm, conversational, human-sounding cover letter (~120–150 words).
- **100% Live Remote Job Search:** Queries verified non-AI remote boards (**Remotive**, **Jobicy**, **Arbeitnow**) in real time, filters out AI-bot scrapers, ranks results by skill match score, calibrates to a **₱40,000 - ₱70,000 / month** PHP target, and generates a tailored cover letter per listing.
- **Privacy-First Google Drive Resume Hub:** Links your Google Drive resume and personal contact info strictly in browser `localStorage` (zero personal emails, phone numbers, or Drive IDs committed to GitHub), with PDF preview, 1-Click Application Kit, and Resume Match Calculator.
- **Two-Way 14-Column Google Sheet Sync:** Pull (`doGet`) and auto-push (`doPost`) applications—including `Job Description` and `Cover Letter`—via Google Apps Script Web App, plus a **Desktop → iPhone Quick Transfer** setup code.

---

## Deploy to Public GitHub Pages

This project is pre-configured with `base: './'` in `vite.config.js` and an automated GitHub Actions workflow in `.github/workflows/deploy.yml`.

1. Create a new **Public** repository on GitHub (e.g., `aurora-job-tracker`).
2. Push this initialized repository to GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
3. On GitHub, go to **Settings → Pages**:
   - Under **Build and deployment → Source**, select **GitHub Actions**.
4. Wait ~1 minute for the **Deploy Aurora Jobs to GitHub Pages** workflow to finish, then open your live URL:
   `https://<your-username>.github.io/<your-repo>/`

---

## Mobile & Cloud Setup (Desktop ↔ iPhone 17 Pro Max)

1. Open your live GitHub Pages URL on **Desktop** first.
2. Go to the **Resume Hub** tab → click **Edit Private Contact & Drive Link** to store your Email, Phone, LinkedIn, and Google Drive Resume link locally.
3. Go to the **Google Sheet** tab → deploy `backend/Code.gs` inside your Google Sheet (**Extensions → Apps Script → Deploy as Web App** with access set to **Anyone**), then paste your Google Sheet URL and Web App URL and click **Save Sheet Settings**.
4. Click **Generate & Copy Setup Code** in the **Desktop → iPhone Quick Transfer** card.
5. Open the same live URL on your **iPhone 17 Pro Max Safari** (even on mobile data!), paste the setup code inside the **Google Sheet** tab, and tap **Import Setup Code**—your contact info, Drive resume, and tracked jobs from Google Sheet will sync right away.
6. In Safari, tap **Share → Add to Home Screen** to install **AuroraJobs** like a native app!

---

## Local Development

```bash
npm install
npm run dev
```
