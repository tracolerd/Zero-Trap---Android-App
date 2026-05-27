# 🚨 Zero Trap - Emergency Help Network

<div align="center">

![Zero Trap](https://img.shields.io/badge/Zero%20Trap-Emergency%20Help%20Network-FF3B30?style=for-the-badge&logo=android&logoColor=white)

**A community-driven emergency help network connecting people in need with nearby helpers in real-time.**

[![React Native](https://img.shields.io/badge/React%20Native-0.76.5-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2052-000020?style=flat-square&logo=expo&logoColor=white)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7.1-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Google Maps](https://img.shields.io/badge/Google%20Maps-Integrated-4285F4?style=flat-square&logo=googlemaps&logoColor=white)](https://maps.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=flat-square)](https://github.com)

[Features](#-key-features) • [Installation](#-installation) • [Setup](#-configuration) • [Architecture](#-architecture) • [Contributing](#-contributing)

</div>

---

## 📖 About

**Zero Trap** is an innovative emergency help application that connects people in distress with nearby volunteers in real-time using advanced location tracking, live communication, and a robust user verification system.

### 🎯 Mission

To create a safer world by building a community where help is just a tap away, bridging the gap between those who need assistance and those willing to provide it.

---

## ✨ Key Features

### 🆘 Core Features

#### 1️⃣ Dual Mode Emergency System
🌐 Internet Mode
├─ GPS-based real-time help requests
├─ Live location sharing
├─ Interactive map tracking
└─ Instant notifications

📶 Bluetooth Mode - Coming Soon
├─ Emergency broadcast without internet
├─ Reaching nearby devices
├─ Offline support
└─ Disaster-ready
#### 2️⃣ Real-Time Help System
- 🆘 Send emergency help requests
- 🗺️ View requests on an interactive map
- 👥 Find nearby helpers
- 📍 Live location sharing
- ⏱️ Automatic request expiration

#### 3️⃣ User Management
- **Secure Authentication**
✓ Email/Password login
✓ Only Gmail accounts allowed
✓ Email verification mandatory
✓ Unique username (3-20 characters)
✓ Permanent login (AsyncStorage)
✓ Secure password reset


- **Profile Management**
• Name, username, gender
• Profile picture (Firebase Storage)
• Helping score tracking
• Online/Offline status
• Last activity timestamp
• Full profile editing capabilities


- **User Discovery**
🔍 Browse all registered users
📊 View online status
🔎 Search by name or username
⭐ Ranking by helping score
👤 View detailed profiles


#### 4️⃣ Maps & Location
🗺️ Three Map Modes:

Seek Help
• View your current location
• Send emergency help requests
• Wait for incoming helpers
• Share live tracking data

Provide Help
• View nearby help requests
• Accept help requests
• Navigate as a helper to the location
• Complete the help session

Live Map
• View all online users
• Live location updates
• Real-time data sync
• Check community coverage


#### 5️⃣ Communication System
- 💬 Real-time chat system
- 📨 Stored message history
- ⏰ Messages with timestamps
- ✓ Read receipt support
- 🔔 Inline notifications

#### 6️⃣ Security & Privacy
🔒 Security Features:

✓ Email verification
✓ Username uniqueness enforcement
✓ Profile completeness check
✓ Database firewall security rules
✓ Data encryption (Secure Firebase)

🛡️ Privacy Controls:

• Block unwanted users
• Report inappropriate behavior
• Control data sharing
• Location privacy options


#### 7️⃣ Help Tracking
- 📊 Complete help history log
- 🏆 Records of provided assistance
- 📈 Statistics and achievements
- ⭐ Helping score system
- 📅 Date-based filtering

#### 8️⃣ Legal & Support
- 📄 Complete Terms & Conditions
- 🔐 Comprehensive Privacy Policy
- 👨‍💻 Developer details
- 💡 Help and support resources
- 📧 Contact information

---

## 🏗️ Architecture

### 📁 Project Structure
ZeroTrapApp/
├── 📁 assets/                    # Images, fonts, static files
│   └── developer.jpg            # Developer picture
│
├── 📁 navigation/                # Navigation configuration
│   └── AppNavigator.js          # Stack navigator setup
│
├── 📁 screens/                   # All app screens (18+)
│   ├── AuthScreens/
│   │   ├── SplashScreen.js
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   └── ForgotPasswordScreen.js
│   ├── MainScreens/
│   │   ├── HomeScreen.js
│   │   ├── MapScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── EditProfileScreen.js
│   │   └── SettingsScreen.js
│   ├── HelpScreens/
│   │   ├── SearchHelpScreen.js
│   │   ├── HelpChatScreen.js
│   │   ├── BluetoothSearchScreen.js
│   │   └── HelpHistoryScreen.js
│   ├── UserScreens/
│   │   ├── AllUsersScreen.js
│   │   └── UserProfileScreen.js
│   └── InfoScreens/
│       ├── DeveloperInfoScreen.js
│       ├── TermsConditionsScreen.js
│       └── PrivacyPolicyScreen.js
│
├── 📁 services/                  # Business logic
│   ├── firebaseAuthService.js   # Authentication service
│   └── firestoreService.js      # Database operations
│
├── 🔧 Core Files/
│   ├── App.js                   # Entry point
│   ├── firebaseConfig.js        # Firebase configuration
│   ├── app.json                 # Expo configuration
│   ├── google-services.json     # Firebase Android config
│   ├── package.json             # Dependencies
│   ├── .gitignore
│   ├── .git/
│   ├── node_modules/
│   └── android/                 # Native Android code


### 🗄️ Database Structure

#### Users Collection


🔐 Firebase Security RulesJavaScriptrules_version = '2';


2. Create a new project: "zero-trap"
3. Enable Google Analytics (Optional)
2️⃣ Enable AuthenticationJavaScriptAuthentication → Sign-in method
✓ Email/Password: ENABLED
✓ Google: ENABLED (Optional)

Authorized domains:
• zerotrap-d81fd.firebaseapp.com
• localhost
3️⃣ Create a Firestore DatabaseBashFirestore Database → Create database
• Start in production mode
• Region: asia-south1 (Optimized for Dhaka)
• Deploy security rules (from the repository)
4️⃣ Add Android AppBashProject Settings → Add app → Android

Package name: com.zerotrap.emergency

Download google-services.json
5️⃣ Cloud Storage Setup (Optional)BashCloud Storage → Create bucket
• Location: asia-south1
• Storage class: Standard
• Rules: Development (for now)

Note: Blaze plan required for image uploads
Google Maps APIAPI Key: AIzaSyCR34xAzwjLJAmsbIbBXuC_udV2rbQwgMoSetup Steps:Bash1. Go to Google Cloud Console
2. APIs & Services → Credentials
3. Create API Key

Enable the following APIs:
✓ Maps SDK for Android
✓ Geolocation API
✓ Places API
✓ Directions API

📦 InstallationPrerequisites✓ Node.js v18+ ([https://nodejs.org/](https://nodejs.org/))
✓ npm or yarn
✓ Expo CLI (npx expo)
✓ Android Studio (for Android development)
✓ EAS CLI (for APK building)
✓ Git (for version control)
Step-by-Step Setup1. Clone the RepositoryBashgit clone https://github.com/tracolerd/zero-trap.git
cd ZeroTrapApp
2. Install DependenciesBashnpm install
3. Configure FirebaseBash# Place google-services.json in the project root
# Update firebaseConfig.js with your Firebase credentials


5. Start the Development ServerBashnpx expo start

# Options:
# • Press 'a' - Run on Android
# • Press 'w' - Run on Web
# • Press 'i' - Run on iOS
# • Press 'j' - Open DevTools
# • Press 'r' - Reload app
# • Press 'c' - Clear console
🏗️ Building APKPrerequisitesBash1. Create an Expo account (expo.dev)
2. Install EAS CLI
3. Complete Firebase setup
4. Configure Google Maps API
Build ProcessStep 1: Log in to EASBasheas login

# Input credentials:
✓ Email/Username
✓ Password
✓ OTP (if enabled)
Step 2: Configure BuildBasheas build:configure

# Answer the prompts:
✓ Platform: Android
✓ Build type: Release/Preview
Step 3: Build APKBash# Development build (Fast)
eas build --platform android --profile preview --clear-cache

# Production build (Optimized)
eas build --platform android --profile production
Step 4: Wait for the Build to Complete⏱️ Time: 15-20 minutes
📊 Check status:
   https://expo.dev/accounts/tracolerd/builds
Step 5: Download APKBash1. Go to EAS Dashboard
2. Click on your specific build
3. Click "Download APK"
4. Install on your Android device
AAB Build (for Google Play)Basheas build --platform android --profile production

# This generates an .aab file that can be uploaded to Google Play
🧪 TestingManual Testing ChecklistMarkdown## Authentication
- [ ] Register a new account
- [ ] Receive Gmail verification
- [ ] Verify email successfully
- [ ] Log in
- [ ] Log out
- [ ] Reset password

## Profile
- [ ] View profile details
- [ ] Edit profile details
- [ ] Upload profile picture (when Blaze is available)
- [ ] Browse all users
- [ ] Search for users
- [ ] View another user's profile

## Map Features
- [ ] Navigate to Seek Help
- [ ] Verify current location
- [ ] Create a help request
- [ ] Navigate to Provide Help
- [ ] View nearby requests
- [ ] View all online users on Live Map

## Chat
- [ ] Start a chat session
- [ ] Send messages
- [ ] Confirm message delivery/receipt
- [ ] View message history

## Help History
- [ ] Open help history
- [ ] View provided help records
- [ ] View received help records

## Settings
- [ ] Edit profile settings
- [ ] Open application settings
- [ ] Read Privacy Policy
- [ ] Read Terms & Conditions
- [ ] View developer information
- [ ] Delete account

## Permissions
- [ ] Grant location permission
- [ ] Grant camera permission
- [ ] Grant storage permission

## Special Cases
- [ ] Turn off internet connection
- [ ] Close and reopen the app
- [ ] Open app from background state
- [ ] Load a large volume of data
Performance TestingBash# Profile with Chrome DevTools
npx expo start --dev-client

# Monitor via Performance Monitor:
• Frame rate
• Memory usage
• Network requests
• Battery drain

📋 RoadmapPhase 1: Core Features ✅ COMPLETE✅ User Authentication
✅ Profile Management
✅ Help Request System
✅ Real-time Location Tracking
✅ Google Maps Integration
✅ Real-time Chat System
✅ User Discovery
✅ Help Activity Tracking

Phase 2: Improvements 🚧 IN PROGRESS🚧 Push Notifications
🚧 Bluetooth Offline Mode
🚧 Advanced Search Filters
🚧 Help History Analytics
🚧 Leaderboard System
🚧 Achievement Badges
🚧 Image Upload Integration

Phase 3: Scaling 📋 PLANNED📋 Multilingual Support
📋 iOS Version Release
📋 Web Administration Dashboard
📋 Admin Management Panel
📋 Analytics Dashboard
📋 Performance Optimization

Phase 4: Advanced Features 🔮 FUTURE🔮 AI-powered Helper Matching
🔮 Live Video Calling
🔮 Emergency Contact SOS Broadcast
🔮 Emergency Services Integration
🔮 Community Forums
🔮 Integrated Donation System
👨‍💻 Development GuideCode StyleJavaScript// Good Practices:
✓ camelCase for variable names
✓ PascalCase for component names
✓ UPPER_CASE for constants
✓ Meaningful variable names
✓ Proper comments and documentation

❌ Avoid:
❌ Single letter variables (except in loops)
❌ Magic numbers
❌ Deeply nested code blocks
❌ Unhandled promises
Git WorkflowBash# Create a feature branch
git checkout -b feature/your-feature-name

# Commit your changes
git add .
git commit -m "feat: add your feature description"

# Push to remote repository
git push origin feature/your-feature-name

export default YourScreen;
🤝 ContributingWe welcome all kinds of contributions! Your help can make this application even better.How to ContributeFork the RepositoryBashgit clone https://github.com/tracolerd/zero-trap.git
Create a Feature BranchBashgit checkout -b feature/AmazingFeature
Commit Your ChangesBashgit commit -m 'feat: Add AmazingFeature'
Push to the BranchBashgit push origin feature/AmazingFeature
Open a Pull RequestGo to GitHubClick "Compare & pull request" to open a Pull RequestContribution GuidelinesAdhere to the project's code style rulesWrite clear and meaningful commit messagesAdd tests for any new features introducedUpdate the documentation accordinglyMaintain a respectful and constructive attitude📄 LicenseThis project is licensed under the MIT License - see the LICENSE file for details.MIT License

In short:
✓ Commercial use allowed
✓ Modification allowed
✓ Distribution allowed
✓ Personal use allowed

Conditions:
• Must include the license and copyright notice

Limitations:
• No liability assumed
• No warranty provided
📞 Support & ContactContact Information
👤 Developer: Nurul Faiyaz
📧 Email: scrollfaiyaz@gmail.com
💼 LinkedIn: https://www.linkedin.com/in/faiyaz-xyz

Get Support
🐛 Report Bugs
   → Open an issue on GitHub Issues
   → Provide a detailed description
   → Attach relevant screenshots

💡 Request Features
   → Write in GitHub Discussions
   → Clearly explain your idea
   → Gather feedback from the community

❓ Ask Questions
   → Check GitHub Discussions
   → Tag questions under Issues
   → Contact directly via email
🌟 Star History
Spread the word about our project! Give us a ⭐ if you like this project.

Bash
# Star this repository
https://github.com/tracolerd/zero-trap
🙏 Acknowledgments
This project was made possible thanks to the following open-source tools and platforms:

🙏 Expo - For an amazing cross-platform development experience
🙏 Firebase - For powerful and scalable backend infrastructure services
🙏 React Navigation - For providing smooth UI navigation structures
🙏 Google Maps - For industry-standard map data integration
🙏 React Native Maps - For excellent map wrapper components
🙏 All Contributors and Testers - For making the ecosystem safer
📊 Project Stats
📊 Our Project Statistics:

Files:              18+ screens + services
Lines of Code:      ~5000+ LOC
Dependencies:       25+ npm packages
Database:           Firestore (NoSQL)
Languages:          JavaScript/JSX
Version:            1.0.0
Status:             Production Ready ✅
🎉 You've Reached the End!
Thanks for completing this README!

If you want to know more about this project, Open an Issue or Contact Us.
Instagram username: tracolerd

Made by Faiyaz
For a safer community, by a community.
