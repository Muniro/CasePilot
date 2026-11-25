# CasePilot — investigation workspace redesign

This update replaces the frontend presentation around your existing case, order and food-alert endpoints.

## See the design first

Open `CasePilot-design-preview.html` in your browser. It is self-contained and uses clearly labelled sample records. Click **Load demo case**, **Look up order**, **Search alerts**, and a result card to see the complete layout. The preview is for reviewing the design; the source files use your actual API.

## Apply it to your existing project

Your React project is:

```text
D:\Development\AgenticReactCSharp\CasePilot\src\casepilot-web
```

1. Stop the React/Vite terminal with Ctrl+C. Leave your API terminal running on port 5080.
2. Make a backup copy of your current React `src` folder outside the project, or commit the current frontend files to your existing Git repository.
3. Copy this package's **src** folder into **casepilot-web**, merging the folders and replacing the matching files. Do not put it inside the existing src folder: the resulting path must be `casepilot-web\src\App.tsx`.
4. Optionally copy `index.html` into `casepilot-web` as well; it updates the browser-tab title and page metadata.
5. In PowerShell, run:

```powershell
Set-Location 'D:\Development\AgenticReactCSharp\CasePilot\src\casepilot-web'
npm run build
npm run dev -- --port 5175 --strictPort
```

Then open **http://localhost:5175**.

The UI uses the Material UI and Emotion packages already installed in your project. No additional UI packages are needed. Your existing package.json, package-lock.json, Vite proxy configuration and C# files are not part of this update.

The old `index.css` and `FoodAlertSearch.css` are no longer imported by these replacement files. They can remain in the folder while you review the new design.

## What changed

- Dark navigation rail with links to actual page sections.
- Shared Material UI theme with consistent typography, colours, surfaces and focus states.
- Case context and order evidence placed in a left column.
- OrderDetails is rendered again; it was imported but unused in the App.tsx you supplied.
- Food-alert workspace with a search area, selectable results and a dedicated notice panel.
- Genuine result counts and source dates, official notice links and a working Copy reference action.
- Designed responsive layouts, loading placeholders, empty states and service errors.
- Fictional case/order data is labelled as demonstration data. Food-alert source information and the recent-100-alert search scope remain visible.

## Source files

| File | Role |
| --- | --- |
| src/App.tsx | Application shell, case loading and page layout |
| src/App.css | Responsive layout and component presentation |
| src/main.tsx | React entry point, Material UI provider and baseline |
| src/theme.ts | Shared Material UI design settings |
| src/components/FoodAlertSearch.tsx | Search, results, notice selection and copy action |
| src/components/OrderDetails.tsx | Order lookup and delivery evidence |
| src/components/Glyph.tsx | Small inline SVG icons; no additional icon package |
| src/lib/api.ts | Shared GET request and API error handling |
| src/lib/format.ts | Date display and official-source link checking |

## Existing API contract

- GET `/api/cases/1` → id, orderNumber, subject, description.
- GET `/api/orders/{orderNumber}` → orderNumber, status, promisedDeliveryDate, revisedDeliveryDate, delayReason.
- GET `/api/alerts?query=...` → array of notation, title, description, alertUrl, modified.

The actual application source contains no mocked API responses.

## Quick check on your PC

1. Click **Load demo case**: the case context should fill in on the left.
2. Click **Look up order**: status and delivery dates should appear below it.
3. Search **Healthy Fit**, then select the resulting notice.
4. Open **Read official notice** and try **Copy reference**.
5. Try a search without matches; the UI explains the limited search coverage.

## Validation and current scope

The source passed strict TypeScript checking and a Vite production build using React 19, Material UI 9.6 and TypeScript 5.9. Browser rendering and click-through verification could not be completed in the build environment because browser access to the local preview was unavailable. Please use the quick check above against your running API.

This is a presentation and usability update. Attaching evidence to a case, persistence, response generation and approval workflows remain future work. The existing delivery case is still the case returned by your API; it has not been silently changed into a food-recall case.
