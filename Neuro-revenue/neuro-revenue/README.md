# NeuroRevenue - Medical Practice Revenue Tracker

A modern, professional React TypeScript application for tracking medical practice revenue with date-based filtering and analytics.

## Features

- 📊 Real-time revenue tracking
- 📅 Date range filtering
- 💾 Local storage persistence
- 📈 Practice analytics and insights
- 📥 CSV export functionality
- 🎨 Modern, responsive UI with Tailwind CSS

## Quick Start

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/drsuyog1979/neuro-revenue.git
   cd neuro-revenue
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Deploying to GitHub Pages

### Method 1: Automatic Deployment (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/drsuyog1979/neuro-revenue.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository settings
   - Click on "Pages" in the left sidebar
   - Under "Build and deployment" → "Source", select "GitHub Actions"
   - The workflow will automatically build and deploy your app

3. **Access your app:**
   Your app will be available at: `https://drsuyog1979.github.io/neuro-revenue/`

### Method 2: Manual Deployment

```bash
npm run build
# Upload the contents of the 'dist' folder to your hosting service
```

## Usage

### Adding Records
- Click on "New Patient", "Follow-up", or "IP Consult" buttons to add records
- Each record is timestamped automatically

### Filtering by Date
- Use the "Time Period" section to set start and end dates
- Click "Today" to quickly reset to current date

### Analytics
- Click "Run Practice Analysis" to get insights on your filtered records
- View total revenue, patient distribution, and daily averages

### Exporting Data
- Click "Export Entire History" to download all records as CSV
- The export includes all records, not just filtered ones

### Data Management
- "Clear Visible Filter" - Deletes records in the current date range
- "Hard Reset App" - Deletes ALL data (use with caution!)

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Local Storage API

## File Structure

```
neuro-revenue/
├── src/
│   ├── components/
│   │   └── StatsCard.tsx
│   ├── services/
│   │   └── geminiService.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── types.ts
│   ├── constants.ts
│   └── index.css
├── public/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## License

MIT

## Author

Dr. Suyog (drsuyog1979)
