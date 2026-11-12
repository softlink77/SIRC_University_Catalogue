# SIRC University Catalogue Portal

A small Google Apps Script web app for SIRC IIT Kharagpur members. Each submission records one university in a central Google Sheet. Optional supporting files are saved in a Google Drive folder, and their links are recorded in the sheet.

## Files

- `Code.gs` — server-side Apps Script; creates the spreadsheet and Drive folder on first use.
- `Index.html` — responsive form and client-side validation.

## One-time setup (about 10–15 minutes)

1. Sign in to the Google account that should own the submissions.
2. Open **https://script.google.com/** and choose **New project**.
3. Rename the project, for example `SIRC University Catalogue Portal`.
4. Replace the contents of `Code.gs` with the supplied `Code.gs`.
5. Click **+** beside Files → **HTML**. Name the file exactly `Index` (Apps Script adds `.html`) and paste the supplied `Index.html`.
6. Save the project.
7. From the function dropdown, select `doGet` and click **Run** once. Review and grant the requested Google Sheets and Google Drive permissions. If prompted, use the cell's designated Google account.
8. Click **Deploy → New deployment**. Select the gear icon and choose **Web app**.
9. Set **Execute as** to **Me**. Set **Who has access** to the intended audience:
   - Prefer **Anyone within IIT Kharagpur / your Google Workspace** if that option is available and all members have institutional accounts.
   - If no institutional audience option exists, use the narrowest available access setting approved by the cell. Avoid public access unless the cell explicitly approves it.
10. Click **Deploy**, authorize if prompted, and copy the Web app URL ending in `/exec`.
11. Share that URL with cell members. They should open the deployed URL, not the HTML file locally.

## Where data goes

- A spreadsheet named **SIRC University Catalogue Submissions** is created in the deploying account's Google Drive after the first valid submission.
- A Drive folder named **SIRC University Catalogue Attachments** is created only if a member uploads a file.
- Each row is one university entry. Course names and source URLs are stored as newline-separated values in their respective cells.
- The attachment URL is saved in the last column.

## Important operational notes

- The spreadsheet and attachment folder belong to the Google account that deployed the app. Make sure this is a stable cell-controlled account, not an individual member's personal account.
- Share the resulting spreadsheet and Drive folder with the relevant coordinators using the cell's normal access policy.
- The form allows one optional file up to 8 MB (PDF, Office documents, JPG or PNG).
- Do not upload confidential documents or personal information.
- Acceptance rates and rankings are not always published consistently. Members should leave unknown values blank and provide sources rather than guess.
- Test with a sample entry before circulating the link, then remove the test row and file if needed.
- If the form is changed later, deploy a **new version** via **Deploy → Manage deployments → Edit → New version**.

## Troubleshooting

- **“This form must be opened from its deployed…”**: open the `/exec` web-app URL, not a local HTML preview.
- **Authorization / permission error**: the deploying account must authorize Sheets and Drive access. Re-run `doGet` or redeploy after reviewing permissions.
- **No submission appears**: check that the web app is deployed to execute as the owner and that the owner has access to the spreadsheet.
- **Members cannot open the form**: review the web-app access setting and your IIT KGP account's Workspace policies.
