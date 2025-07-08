# Simple React Native Authentication App

A simple React Native app with static authentication built using Expo.

## Features

- Clean and modern UI design
- Static authentication (username/password hardcoded)
- User registration with form validation
- Navigation between Login, SignUp, and Home screens
- Enhanced home screen with dashboard-like interface
- Logout functionality with confirmation
- Responsive design with proper keyboard handling

## Static Credentials

- **Username:** `admin`
- **Password:** `password123`

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)

### Installation

1. Navigate to the project directory:
   ```bash
   cd SimpleAuthApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

#### Option 1: Using Expo Go (Recommended for beginners)

1. Install the Expo Go app on your phone from the App Store or Google Play Store

2. Start the development server:
   ```bash
   npm start
   ```

3. Scan the QR code with your phone's camera (iOS) or the Expo Go app (Android)

#### Option 2: Using Web Browser

1. Start the development server:
   ```bash
   npm run web
   ```

2. The app will open in your default web browser

#### Option 3: Using Android Emulator

1. Make sure you have Android Studio and an emulator set up

2. Start the development server:
   ```bash
   npm run android
   ```

## How to Use

1. **Login Screen:**
   - Enter the username: `admin`
   - Enter the password: `password123`
   - Tap "Sign In"
   - Or tap "Sign Up" to create a new account

2. **Sign Up Screen:**
   - Fill in username, email, password, and confirm password
   - Form validation ensures data quality
   - After successful registration, you'll be redirected to login

3. **Home Screen:**
   - Dashboard with user stats and quick actions
   - Profile, Settings, and Help options (coming soon)
   - Tap "Logout" to return to the login screen

## Project Structure

```
SimpleAuthApp/
├── components/
│   ├── LoginScreen.js    # Login screen with authentication logic
│   ├── SignUpScreen.js   # User registration screen with validation
│   └── HomeScreen.js     # Enhanced home screen with dashboard
├── App.js                # Main app with navigation setup
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## Technologies Used

- React Native
- Expo
- React Navigation (Stack Navigator)
- React Hooks (useState)

## Customization

### Changing Static Credentials

To change the username and password, edit the constants in `components/LoginScreen.js`:

```javascript
const STATIC_USERNAME = 'your_username';
const STATIC_PASSWORD = 'your_password';
```

### Styling

The app uses a clean, modern design with:
- Light gray background (`#f5f5f5`)
- Blue accent color (`#007AFF`)
- Green accent for sign-up (`#34C759`)
- Red accent for logout (`#FF3B30`)
- Rounded corners and shadows
- Responsive layout

You can modify the styles in each component's `StyleSheet` to match your preferred design.

## Troubleshooting

### Common Issues

1. **Navigation not working:**
   - Make sure all navigation dependencies are installed
   - Run `npm install` to ensure all packages are up to date

2. **App not starting:**
   - Clear the cache: `npx expo start --clear`
   - Restart the development server

3. **Metro bundler issues:**
   - Reset the cache: `npx expo start -c`



