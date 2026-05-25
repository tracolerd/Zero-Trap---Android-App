🚨 Zero Trap - Emergency Help Network
<div align="center">
A community-driven emergency help network connecting people in need with nearby helpers in real-time.
Features • Screenshots • Installation • Tech Stack • Architecture • Contributing
</div>

📖 About
Zero Trap is an innovative emergency help application that connects people in distress with nearby volunteers in real-time. Whether you need immediate assistance or want to help others in your community, Zero Trap makes it possible through advanced location tracking, real-time communication, and a robust user verification system.
🎯 Mission
To create a safer world by building a community where help is just a tap away, bridging the gap between those who need assistance and those willing to provide it.

✨ Features
🆘 Core Features

Dual Mode Emergency System

🌐 Internet Mode: GPS-based real-time help requests with live location tracking
📶 Bluetooth Mode: Offline emergency broadcasts when internet is unavailable


Real-Time Help Requests

Send emergency help requests with your live location
View nearby people seeking help on interactive maps
Accept help requests and navigate to the person in need
Live location sharing during active help sessions



👥 User Management

Secure Authentication

Email/password registration with Gmail validation
Unique username system (3-20 characters, lowercase)
Email verification for account security
Persistent login with AsyncStorage


User Profiles

Customizable profiles with name, username, gender
Profile images (ready for Firebase Storage upgrade)
Helping score and total helped count
Online/offline status indicators
Account creation timestamps


User Discovery

Browse all registered users
Real-time user list with online status
Search by name or username
View detailed user profiles
Ranking system based on helping score



🗺️ Location Features

Interactive Maps

Seek Help: View your location and broadcast help requests
Provide Help: See nearby help requests on map
Live Map: Monitor all active users' locations in real-time
Google Maps integration with custom markers


Location Tracking

Foreground and background location updates
High-accuracy GPS tracking
Real-time location synchronization via Firestore
Privacy-focused: location shared only when needed



💬 Communication

Real-Time Chat

In-app messaging between helpers and seekers
Message history stored in Firestore
Timestamped messages
Read receipts support



🔒 Safety & Privacy

User Verification

Email verification required
Gmail-only registration for authenticity
Username uniqueness validation
Profile completeness checks


Privacy Controls

Block users functionality
Report system for inappropriate behavior
Granular permission management
Secure Firestore rules



📊 Help History

Activity Tracking

Complete history of help provided
Help received records
Statistics and achievements
Helping score system



🎨 User Experience

Modern UI/UX

Clean, intuitive interface
Smooth animations and transitions
Loading states and error handling
Responsive design
Dark mode ready


Account Management

Edit profile information
Update profile picture
Change password
Delete account permanently
Settings customization



📄 Legal & Support

Comprehensive Documentation

Terms & Conditions
Privacy Policy
Developer information
Help & support resources




📱 Screenshots
<div align="center">
LoginRegisterHomeShow ImageShow ImageShow Image
Seek HelpProvide HelpLive MapShow ImageShow ImageShow Image
ProfileAll UsersChatShow ImageShow ImageShow Image
</div>

🚀 Installation
Prerequisites

Node.js (v18 or higher)
npm or yarn
Expo CLI
Android Studio (for Android development)
EAS CLI (for building)
Firebase account
Google Cloud account (for Maps API)

Create a Firebase project at Firebase Console
Enable Authentication (Email/Password)
Create Firestore Database
Download google-services.json and place in project root
Update firebaseConfig.js with your credentials


Configure Google Maps

Get API key from Google Cloud Console
Enable Maps SDK for Android
Add API key to app.json:



json     "android": {
       "config": {
         "googleMaps": {
           "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
         }
       }
     }

Start development server

bash   npx expo start
Build APK
bash# Login to Expo
eas login

# Configure build
eas build:configure

# Build APK
eas build --platform android --profile preview

🛠️ Tech Stack
Frontend

Framework: React Native 0.76.5
UI Library: React Native (Native Components)
Navigation: React Navigation 6.x
Maps: React Native Maps 1.18.0
State Management: React Hooks
Storage: AsyncStorage 2.1.0

Backend & Services

Backend as a Service: Firebase

Authentication (Email/Password)
Firestore (Real-time Database)
Cloud Storage (Image uploads)


Real-time Updates: Firestore Listeners
Location Services: Expo Location 18.0.4
Push Notifications: Expo Notifications 0.29.12

Development Tools

Build Platform: Expo SDK 52
Build Service: EAS Build
Version Control: Git
Package Manager: npm

Key Dependencies
json{
  "expo": "~52.0.0",
  "react-native": "0.76.5",
  "firebase": "^10.7.1",
  "expo-location": "~18.0.4",
  "react-native-maps": "1.18.0",
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/stack": "^6.3.20"
}

🏗️ Architecture
Project Structure
ZeroTrapApp/
├── assets/                  # Images, fonts, static files
├── navigation/              # Navigation configuration
│   └── AppNavigator.js      # Stack navigator setup
├── screens/                 # All app screens
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── HomeScreen.js
│   ├── MapScreen.js
│   ├── ProfileScreen.js
│   └── ...
├── services/                # Business logic & API calls
│   ├── firebaseAuthService.js
│   └── firestoreService.js
├── App.js                   # Entry point
├── firebaseConfig.js        # Firebase configuration
├── app.json                 # Expo configuration
├── google-services.json     # Firebase Android config
└── package.json             # Dependencies
Data Models
User Profile
javascript{
  userId: string,
  name: string,
  email: string,
  username: string,
  phoneNumber: string,
  gender: string,
  profileImage: string,
  emailVerified: boolean,
  helpingScore: number,
  totalHelped: number,
  isOnline: boolean,
  lastSeen: timestamp,
  registeredAt: timestamp
}
Help Request
javascript{
  requestId: string,
  userId: string,
  location: { latitude, longitude },
  description: string,
  status: 'active' | 'completed' | 'cancelled',
  helpers: [userId],
  createdAt: timestamp,
  expiresAt: timestamp
}
Live Location
javascript{
  userId: string,
  latitude: number,
  longitude: number,
  accuracy: number,
  heading: number,
  speed: number,
  timestamp: timestamp
}
Firebase Security Rules
Firestore Rules
javascript// Users can read all profiles (for emergency help)
match /users/{userId} {
  allow read: if request.auth != null;
  allow create: if request.auth.uid == userId;
  allow update: if request.auth.uid == userId;
  allow delete: if request.auth.uid == userId;
}

// Username uniqueness check
match /usernames/{username} {
  allow read: if true; // Public for availability check
  allow create, delete: if request.auth != null;
}

// Help requests visible to all authenticated users
match /helpRequests/{requestId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null;
  allow update, delete: if request.auth.uid == resource.data.userId;
}
Firestore Indexes

helpRequests: status (asc), createdAt (desc), __name__ (desc)
messages: timestamp (asc), __name__ (desc) (Collection Group)
users: accountCreatedAt (asc), username (asc), __name__ (asc)


🔑 Configuration
Firebase Setup

Create Firebase Project

Go to Firebase Console
Create new project: zerotrap
Enable Google Analytics (optional)


Enable Authentication

Authentication → Sign-in method
Enable Email/Password
Enable Google (optional)


Create Firestore Database

Firestore Database → Create database
Start in production mode
Deploy security rules from repository


Add Android App

Project Settings → Add app → Android
Package name: com.zerotrap.emergency
Download google-services.json
Add SHA-1 fingerprints:



bash     # Get SHA-1 from EAS
     eas credentials
Google Maps Setup

Get API Key

Google Cloud Console
APIs & Services → Credentials
Create API Key


Enable APIs

Maps SDK for Android
Geolocation API


Restrict API Key

Application restrictions: Android apps
Add package name and SHA-1



Environment Variables
Create app.json with:
json{
  "expo": {
    "name": "Zero Trap",
    "slug": "zero-trap",
    "version": "1.0.0",
    "android": {
      "package": "com.zerotrap.emergency",
      "versionCode": 1,
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
        }
      },
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION"
      ]
    }
  }
}

🧪 Testing
Run Tests
bash# Unit tests
npm test

# E2E tests
npm run test:e2e
Manual Testing Checklist

 User registration with email verification
 Login and logout
 Profile creation and editing
 Help request creation
 Help request acceptance
 Real-time location tracking
 Chat functionality
 Username uniqueness validation
 Permission handling
 Offline mode (Bluetooth)


📝 Development
Code Style

ESLint for JavaScript
Prettier for formatting
Follow React Native best practices

Git Workflow
bash# Create feature branch
git checkout -b feature/your-feature

# Commit changes
git commit -m "feat: add your feature"

# Push to GitHub
git push origin feature/your-feature

# Create Pull Request
Commit Convention

feat: New feature
fix: Bug fix
docs: Documentation
style: Formatting
refactor: Code restructuring
test: Tests
chore: Maintenance


🚧 Roadmap
Phase 1: Core Features ✅

 User authentication
 Profile management
 Help requests
 Real-time location
 Maps integration
 Chat system

Phase 2: Enhancement 🚧

 Push notifications
 Bluetooth offline mode
 Advanced search filters
 Help history analytics
 Leaderboard system
 Achievement badges

Phase 3: Scale 📋

 Multi-language support
 iOS version
 Web dashboard
 Admin panel
 Analytics integration
 Performance optimization

Phase 4: Advanced 🔮

 AI-powered matching
 Video calls
 SOS button with emergency contacts
 Integration with emergency services
 Community forums
 Donation system


🐛 Known Issues

Expo Go Limitation: Firebase Auth blocked in Expo Go (use APK/development build)
Image Upload: Requires Firebase Blaze plan upgrade
Background Location: May drain battery on some devices


🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'feat: Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

Contribution Guidelines

Follow the code style
Write meaningful commit messages
Add tests for new features
Update documentation
Be respectful and constructive


📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Developer
Nurul Faiyaz

Email: scrollfaiyaz@gmail.com
LinkedIn: https://www.linkedin.com/in/faiyaz-xyz


🙏 Acknowledgments

Expo for the amazing development platform
Firebase for backend services
React Navigation for navigation
React Native Maps for maps integration
All contributors and testers


📞 Support
For support, email scrollfaiyaz@gmail.com or open an issue in the repository.

🌟 Star History
Show Image

<div align="center">
Made with ❤️ for a safer community
⬆ Back to Top
</div>
