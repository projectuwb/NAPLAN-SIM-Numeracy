# NAPLAN Numeracy Practice MVP

A complete NAPLAN numeracy practice web application for Victorian students (Years 3, 5, 7) with dynamic question generation, progress tracking, and focus mode.

## 🎯 Features

- **Dynamic Question Generation**: 150 parametric templates generating infinite unique questions
- **Admin Portal**: Student ID management with analytics
- **Full Mock Tests**: Authentic NAPLAN-style tests with timers
- **Focus Mode**: Unlocked after 3 tests, targets weak topics
- **Progress Tracking**: Detailed analytics and band score calculation
- **Calculator**: Available for Year 7 students from question 9
- **Material Design UI**: Clean, Google-style interface
- **Mobile Responsive**: Works on all devices
- **Zero Cost**: 100% client-side, no backend required

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd NAPLAN-SIM-Numeracy

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173`

## 📚 Test Structure

### Year 3
- **Questions**: 35
- **Time Limit**: 45 minutes
- **Calculator**: Not available

### Year 5
- **Questions**: 40
- **Time Limit**: 50 minutes
- **Calculator**: Not available

### Year 7
- **Questions**: 48
- **Time Limit**: 60 minutes
- **Calculator**: Available from question 9

## 🔐 Getting Started

### For Teachers (Admin)

1. Navigate to `/admin` or click "Admin Portal" on the landing page
2. On first visit, you'll be prompted to create an admin password
3. After setting up, you can:
   - Generate student IDs
   - View student progress
   - Export data as JSON
   - Manage student accounts

**Sample Admin Setup:**
- Create a password (min 6 characters)
- Password example: `teacher123` (change this!)

### For Students

1. Visit the landing page
2. Enter your Student ID (format: `STU-Y3-XXXX`)
3. Start taking tests!

**Sample Student IDs:**
After setting up admin, generate student IDs through the admin portal. They will look like:
- `STU-Y3-A1B2` (Year 3 student)
- `STU-Y5-C3D4` (Year 5 student)
- `STU-Y7-E5F6` (Year 7 student)

## 🎮 How to Use

### Taking a Test

1. **Login** with your Student ID
2. From the dashboard, click **"Full Mock Test"**
3. Answer questions by:
   - Typing numeric answers
   - Selecting multiple choice options
4. Navigate using:
   - Previous/Next buttons
   - Question navigator (click any question number)
5. **Submit** when complete (or timer expires)

### Focus Mode

- Unlocks after completing **3 full tests**
- Targets your weakest topics (< 70% performance)
- 10 questions per focus session
- 15-minute time limit

### Calculator (Year 7 Only)

- Appears from question 9 onwards
- Click "Calculator" button to open
- Supports basic operations: +, -, ×, ÷
- Draggable modal overlay

## 📊 Progress Tracking

The dashboard shows:
- Total tests completed
- Average score and current band
- Improvement from last test
- Topic-by-topic performance with color coding:
  - 🟢 Green (>80%) - Excellent
  - 🟡 Yellow (60-80%) - Good
  - 🟠 Orange (40-60%) - Fair
  - 🔴 Red (<40%) - Needs Improvement

## 🎯 Band Score Calculation

### Year 3
- < 20% = Band 1
- 20-35% = Band 2
- 35-50% = Band 3
- 50-65% = Band 4
- 65-80% = Band 5
- 80%+ = Band 6

### Year 5
- < 20% = Band 3
- 20-35% = Band 4
- 35-50% = Band 5
- 50-65% = Band 6
- 65-80% = Band 7
- 80%+ = Band 8

### Year 7
- < 20% = Band 4
- 20-35% = Band 5
- 35-50% = Band 6
- 50-65% = Band 7
- 65-80% = Band 8
- 80%+ = Band 9

## 💾 Data Storage

All data is stored in browser localStorage:
- Admin credentials (hashed)
- Student records and test history
- Active test progress (for resume capability)
- Current session

**Important**: Data is stored locally in the browser. Clearing browser data will delete all progress.

## 🏗️ Project Structure

```
NAPLAN-SIM-Numeracy/
├── src/
│   ├── components/       # Reusable components (Timer, Calculator)
│   ├── data/            # Question bank JSON
│   ├── pages/           # Main page components
│   │   ├── LandingPage.jsx
│   │   ├── AdminPortal.jsx
│   │   ├── Dashboard.jsx
│   │   ├── TestInterface.jsx
│   │   └── Results.jsx
│   ├── utils/           # Utility functions
│   │   ├── questionGenerator.js
│   │   ├── storageManager.js
│   │   ├── bandCalculator.js
│   │   └── constants.js
│   ├── App.jsx          # Main app with routing
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎨 Tech Stack

- **React 18+**: UI framework
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Tailwind CSS**: Material Design styling
- **localStorage**: Data persistence

## 🚢 Deployment to Vercel

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Build the project
npm run build

# Deploy
vercel --prod
```

### Option 2: Deploy via GitHub

1. Push code to GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel will auto-detect Vite configuration
5. Click "Deploy"

### Vercel Configuration

No special configuration needed! Vercel automatically detects Vite projects.

The build settings:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 📝 Question Bank

The question bank (`src/data/numeracyQuestionBank.json`) contains:
- **150 templates** (50 per year level)
- Topics include:
  - Counting & Place Value
  - Addition, Subtraction, Multiplication, Division
  - Fractions, Decimals, Percentages
  - Geometry, Measurement
  - Data & Statistics
  - Problem Solving

Each template uses parameter randomization to generate infinite unique variations.

## 🔧 Development

### Adding New Questions

Edit `src/data/numeracyQuestionBank.json`:

```json
{
  "id": "Y3-NUM-XXX",
  "topic": "Addition",
  "template": "{NUM1} + {NUM2} = ?",
  "params": {
    "NUM1": {"type": "integer", "min": 10, "max": 99},
    "NUM2": {"type": "integer", "min": 10, "max": 99}
  },
  "correctAnswer": "{NUM1} + {NUM2}",
  "answerType": "numeric"
}
```

### Modifying Styles

Tailwind classes can be customized in:
- `tailwind.config.js` - Theme colors and fonts
- `src/index.css` - Custom components and utilities

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Data Lost

- Data is stored in browser localStorage
- Exporting data regularly from admin portal is recommended
- Use browser developer tools > Application > Local Storage to inspect

### Timer Issues

- Timer auto-submits when it reaches 0:00
- Progress is auto-saved every few seconds
- Closing browser mid-test allows resume

## 📄 License

This project is created for educational purposes for Victorian NAPLAN practice.

## 🤝 Support

For issues or questions, please open an issue in the GitHub repository.

## ✅ Checklist for First Time Setup

- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Run `npm run dev` to test locally
- [ ] Navigate to `/admin` and create admin password
- [ ] Generate 3-5 student IDs for testing
- [ ] Test student login and take a practice test
- [ ] Verify timer, calculator (Year 7), and results page
- [ ] Build with `npm run build`
- [ ] Deploy to Vercel
- [ ] Test production deployment

---

**Built with ❤️ for Victorian students**
