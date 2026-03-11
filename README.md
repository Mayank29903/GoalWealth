# GoalWealth Planner

GoalWealth Planner is a goal-based SIP planning tool that estimates required monthly investment for future financial goals using inflation-adjusted target values and return-based SIP calculations.

## Live Deployment

- https://goalwealth-planner.vercel.app/

## Core Financial Logic

### Step 1: Inflate Goal Value

`FV = Present Cost x (1 + Inflation rate)^Years`

Where:
- `FV` = future goal value (inflated target)
- Inflation rate is entered as annual percent in UI

### Step 2: Calculate Required Monthly SIP

Monthly rate:
- `r = annual return / 1200` (because annual return is entered as %)

Total months:
- `n = years x 12`

Required SIP:
- `SIP = FV x r / [((1 + r)^n - 1) x (1 + r)]`

Zero-return fallback:
- If annual return is `0`, calculator uses `SIP = FV / n`

## What The App Covers

- Multi-goal planning with independent assumptions
- Separate inflation and return assumptions (clearly labeled in UI)
- Step-by-step methodology section with formula substitution
- Scenario analysis for different return assumptions
- Growth chart, timeline, yearly breakdown table, and PDF export
- Input completeness checks before showing projections

## Compliance & Disclosure

- Educational use only; not investment advice
- Fixed inflation/return assumptions are used in projections
- Taxes, fund expenses, and exit loads are excluded from core model
- Results are indicative and can differ from real market outcomes

## Accessibility & UX Highlights

- Skip link to main content for keyboard users
- Semantic headings, labels, and aria descriptions on forms
- Required-field guidance and missing-input checklist
- Focus-visible styling and reduced-motion support
- Responsive layout across mobile and desktop

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- Recharts
- jsPDF + html2canvas for export

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Quality Checks

```bash
npm run lint
npm run build
```
