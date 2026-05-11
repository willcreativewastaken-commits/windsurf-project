# StrongLifts 5x5 Web App

A web-based version of the StrongLifts 5x5 workout program built with React and TailwindCSS.

## Features
- Workout A/B selection with proper StrongLifts exercises
- Visual set tracking with interactive circle buttons
- Weight adjustment (+/- 5 lbs)
- Plate calculator showing exact plates per side
- Automatic warmup sets calculation
- Data persistence with localStorage
- Responsive design for mobile and desktop

## How to Share

### Method 1: GitHub Pages (Recommended)
1. Create a new GitHub repository
2. Upload these files to the repository
3. Go to Settings > Pages
4. Select "Deploy from a branch" and choose "main"
5. Your site will be live at `https://username.github.io/repository-name`

### Method 2: Netlify/Vercel
1. Drag and drop the project folder to Netlify or Vercel
2. Get a shareable URL instantly

### Method 3: Direct File Sharing
1. Zip the project folder
2. Share via Google Drive, Dropbox, or email
3. Friend extracts and opens `index.html`

## Local Development
Open `index.html` in your browser or use a local server:
```bash
python3 -m http.server 8000
```

## Exercises
- **Workout A**: Squat (5x5), Bench Press (5x5), Barbell Row (5x5)
- **Workout B**: Squat (5x5), Overhead Press (5x5), Deadlift (1x5)
