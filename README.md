<div align="center">

# 🚨 Zero Trap - Emergency Help Network

<img src="https://capsule-render.vercel.app/api?type=waving&color=FF3B30&height=120&section=header&text=Zero%20Trap&fontSize=40&fontColor=ffffff&animation=fadeIn" alt="Zero Trap Header"/>

**A community-driven emergency help network connecting people in need with nearby helpers in real-time.**

<br>

[![GitHub Stars](https://img.shields.io/github/stars/tracolerd/zero-trap?style=for-the-badge&color=FFD700&logo=github)](https://github.com/tracolerd/zero-trap/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/tracolerd/zero-trap?style=for-the-badge&color=00599C&logo=github)](https://github.com/tracolerd/zero-trap/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/tracolerd/zero-trap?style=for-the-badge&color=FF3B30&logo=github)](https://github.com/tracolerd/zero-trap/issues)
[![License](https://img.shields.io/github/license/tracolerd/zero-trap?style=for-the-badge&color=2EA043)](LICENSE)

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo&logoColor=white)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Google Maps](https://img.shields.io/badge/Google_Maps-4285F4?style=flat-square&logo=googlemaps&logoColor=white)](https://developers.google.com/maps)

<br>

[Key Features](#-key-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation--setup) • [Architecture](#-architecture) • [Contributing](#-contributing)

</div>

<hr>

## 📖 About The Project

**Zero Trap** is an innovative emergency help application that connects people in distress with nearby volunteers in real-time. By utilizing advanced location tracking, live communication, and a robust user verification system, it bridges the gap between those who need assistance and those willing to provide it.

### 🎯 Mission
> To create a safer world by building a community where help is just a tap away.

<br>

## ✨ Key Features

<table>
  <tr>
    <td width="50%">
      <h3>🆘 Dual Mode Emergency System</h3>
      <ul>
        <li><strong>Internet Mode:</strong> GPS-based real-time help requests, live tracking, and instant push notifications.</li>
        <li><strong>Bluetooth Mode (Beta):</strong> Emergency broadcasting without internet to reach nearby offline devices.</li>
      </ul>
    </td>
    <td width="50%">
      <h3>🗺️ Dynamic Maps & Location</h3>
      <ul>
        <li><strong>Seek Help:</strong> Broadcast your live location to await incoming helpers.</li>
        <li><strong>Provide Help:</strong> Navigate as a volunteer to nearby active incidents.</li>
        <li><strong>Live Community Map:</strong> View real-time active users in your vicinity.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🔒 Secure User Management</h3>
      <ul>
        <li>Strict Gmail-only authentication with mandatory email verification.</li>
        <li>Unique username enforcement & permanent session handling via AsyncStorage.</li>
        <li>Comprehensive profiles with "Helping Scores" to rank reliable volunteers.</li>
      </ul>
    </td>
    <td width="50%">
      <h3>💬 Real-Time Communication</h3>
      <ul>
        <li>Built-in live chat system with read receipts.</li>
        <li>Timestamped message history stored securely in Firestore.</li>
        <li>Inline notifications during active help sessions.</li>
      </ul>
    </td>
  </tr>
</table>

<br>

## 🛠 Tech Stack

| Category | Technology / Framework | Details |
| :--- | :--- | :--- |
| **Frontend** | React Native (v0.76.5) | Core application framework |
| **Platform** | Expo (SDK 52) | Toolchain & build environment |
| **Backend & Auth** | Firebase | Firestore (NoSQL), Auth, Storage |
| **Mapping** | React Native Maps | Powered by Google Maps API |
| **State & Storage** | React Hooks & AsyncStorage | Local persistence & state management |

<br>

## ⚙️ Installation & Setup

<details>
<summary><b>Click to expand: Step-by-Step Installation Guide</b></summary>
<br>

**1. Clone the Repository**
```bash
git clone [https://github.com/tracolerd/zero-trap.git](https://github.com/tracolerd/zero-trap.git)
cd zero-trap
```
2. Install Dependencies
   npm install
3. Configure Firebase & APIs
   Place your google-services.json in the project root.
   Update firebaseConfig.js with your Firebase credentials.
   Add your Google Maps API key in app.json:
   JSON:
   ```c
   "android": {
      "config": {
    "googleMaps": {
      "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
      }
     }
   }
4. Start the Development Server
   ```bash
   npx expo start
   # Login to Expo Application Services
   eas login

   # Configure your build platform
   eas build:configure

   # Build the production APK
   eas build --platform android --profile production
   ```
🏗 Architecture
Database Structure (Firestore)
The application utilizes a denormalized NoSQL database structure for high read/write performance during critical emergency situations.
```c
// Help Requests Collection Pattern
{
  requestId: "req123",
  userId: "uid123",
  location: { latitude: 23.8103, longitude: 90.4125, accuracy: 10 },
  description: "Injured in an accident, urgent help needed",
  status: "active", // states: 'active', 'completed', 'cancelled'
  helpers: ["uid456"],
  createdAt: "2026-03-19T10:30:00Z"
}
```
Security Rules:
```c
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }
    function isOwner(userId) { return isAuthenticated() && request.auth.uid == userId; }
    
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
    }
    
    match /helpRequests/{requestId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isOwner(resource.data.userId);
    }
  }
}
```
🚀 Roadmap
[x] Core Authentication & Profile Management

[x] Real-time Map Integration & Help Requests

[x] Live Chat System

[ ] Push Notifications Integration

[ ] Bluetooth Offline Broadcasting Mode

[ ] Leaderboard & Achievement Badges

[ ] AI-Powered Helper Matching

🤝 Contributing
We strictly follow a structured workflow to maintain code quality.

Fork the repository

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'feat: Add AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📞 Support & Contact
If you encounter bugs, require features, or have questions regarding the architecture, open an issue or reach out directly:

👤 Nurul Faiyaz 📧 Email: scrollfaiyaz@gmail.com

💼 LinkedIn: https://www.linkedin.com/in/faiyaz-xyz

🐙 GitHub: https://github.com/tracolerd
