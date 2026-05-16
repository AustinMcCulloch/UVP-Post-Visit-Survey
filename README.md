# UVP Patient Experience Survey

Single-page survey for Utah Valley Pediatrics. Responses POST directly to a Google Sheet via Apps Script. Hosted on GitHub Pages.

---

## One-time setup

### 1. Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new Sheet named **UVP Patient Survey Responses**.
2. Rename the first tab to **Responses**.
3. Copy the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/**<SHEET_ID>**/edit`

### 2. Deploy the Apps Script backend

1. In the Sheet: **Extensions → Apps Script**.
2. Delete the default `myFunction` and paste the contents of `Code.gs` from this folder.
3. Replace `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` with your actual Sheet ID.
4. Click **Save**, then run `setupSheet` once (select it from the function dropdown → Run). This creates the header row.
5. Run `testDoPost` and confirm a test row appears in the Sheet.
6. **Deploy → New deployment**:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy**, authorize when prompted, then copy the `/exec` URL.

### 3. Wire the URL into the HTML

Open `UVP_Patient_Survey.html` and replace the placeholder on this line:

```js
const ENDPOINT = "PASTE_YOUR_APPS_SCRIPT_EXEC_URL_HERE";
```

with your `/exec` URL.

### 4. Host on GitHub Pages

1. Create a **new public** GitHub repo named `uvp-patient-survey` (keep it separate from the private UVP monorepo).
2. Copy `UVP_Patient_Survey.html` there as `index.html`.
3. Push to `main`.
4. In repo Settings → **Pages** → Source: **Deploy from a branch** → branch `main`, folder `/ (root)`.
5. The survey will be live at `https://<your-github-username>.github.io/uvp-patient-survey/` within ~1 minute.

Optional: add a `CNAME` file containing `survey.uvpediatrics.com` and configure a DNS CNAME record to point that subdomain at `<your-github-username>.github.io`.

---

## Ongoing workflow

Edit `UVP_Patient_Survey.html` here in the monorepo → copy to `index.html` in the public Pages repo → push → Pages redeploys in ~1 min.

If you redeploy the Apps Script (e.g. after editing `Code.gs`), use **Manage deployments → edit (pencil) the existing deployment** rather than creating a new one — this keeps the `/exec` URL stable.

---

## Verification checklist

- [ ] Run `testDoPost` in Apps Script editor → row appears in Sheet.
- [ ] Open the HTML locally in a browser, fill all 7 fields, submit → new row in Sheet.
- [ ] Submit with no contact info → `Wants Followup` = `No` in Sheet.
- [ ] Submit with contact info → `Wants Followup` = `Yes`, follow-up note shown on thank-you screen.
- [ ] Tap Submit twice quickly → only one row added (button disables on first tap).
- [ ] Load GitHub Pages URL on a phone → complete and submit → row in Sheet.
