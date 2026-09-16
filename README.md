<div align="center">

# 🚨 Zero Trap

### Emergency Help, One Tap Away.

**Zero Trap** is a community-driven emergency assistance app designed to connect people who need urgent help with nearby volunteers through location-aware, real-time communication.

<br />

[![React Native](https://img.shields.io/badge/React%20Native-0.76.9-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-52-000020?style=for-the-badge&logo=expo&logoColor=FFFFFF)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7.1-FFCA28?style=for-the-badge&logo=firebase&logoColor=000000)](https://firebase.google.com/)
[![Android](https://img.shields.io/badge/Android-Supported-3DDC84?style=for-the-badge&logo=android&logoColor=FFFFFF)](https://www.android.com/)
[![License](https://img.shields.io/github/license/tracolerd/Zero-Trap---Android-App?style=for-the-badge)](LICENSE)

<br />

[Features](#-features) · [Tech Stack](#-tech-stack) · [Project Structure](#-project-structure) · [Setup](#-getting-started) · [Firebase](#-firebase-setup) · [Build](#-build) · [Roadmap](#-roadmap) · [Contributing](#-contributing)

</div>

---

## 📌 Overview

Emergency situations are time-sensitive. **Zero Trap** is built around a simple idea: make it easier for a person in danger to request help and make it easier for nearby people to respond.

The application combines **location services, real-time data, authentication, messaging, notifications, and cloud infrastructure** into a single mobile experience.

> **Mission:** Make emergency assistance more connected, more responsive, and more accessible.

---

## ✨ Features

### 🆘 Emergency Assistance
- Create emergency help requests.
- Share the user's location with the help network.
- Track active help situations.
- Support both people requesting help and people responding to requests.

### 📍 Location & Maps
- GPS-based location detection.
- Nearby emergency/help visibility.
- Google Maps integration through `react-native-maps`.
- Background location capability configured for Android.

### 💬 Real-Time Communication
- In-app communication during help sessions.
- Persistent message data through Firebase.
- Timestamped conversation records.

### 🔐 Authentication & Profiles
- Firebase Authentication integration.
- User profile management.
- Persistent local session/state storage with AsyncStorage.

### 🔔 Notifications
- Expo Notifications integration.
- Notification support for emergency-related events.
- Android notification configuration included in the Expo project.

### 📱 Media & Profiles
- Profile image selection.
- Camera and photo-library permissions.
- User-facing permission messages for sensitive device capabilities.

---

## 🛠 Tech Stack

| Layer | Technology |
| --- | --- |
| Mobile Framework | React Native 0.76.9 |
| App Platform | Expo SDK 52 |
| Language | JavaScript |
| Navigation | React Navigation |
| Backend | Firebase |
| Database | Cloud Firestore |
| Authentication | Firebase Authentication |
| Maps | React Native Maps / Google Maps |
| Local Storage | AsyncStorage |
| Notifications | Expo Notifications |
| Device Services | Expo Location, Expo Device, Expo Task Manager |
| Media | Expo Image Picker |
| Build & Deployment | Expo Application Services (EAS) |

---

## 🧩 Project Structure

```text
Zero-Trap---Android-App/
│
├── assets/                  # App icons, splash assets and static resources
├── .github/                 # GitHub configuration / workflows
├── App.js                   # Application entry point
├── app.json                 # Expo application configuration
├── babel.config.js          # Babel configuration
├── eas.json                 # EAS build configuration
├── firebase.json            # Firebase project configuration
├── firebaseConfig.js        # Firebase client configuration
├── firestore.rules          # Firestore security rules
├── package.json             # Dependencies and npm scripts
├── LICENSE                  # Project license
└── README.md                # Project documentation
```

> The repository may evolve as the application architecture grows; this structure reflects the current tracked project configuration.

---

## 🚀 Getting Started

### Prerequisites

Install the following before running the project locally:

- **Node.js**
- **npm**
- **Git**
- **Expo CLI / Expo toolchain**
- **Android Studio** for native Android development/build workflows
- A configured **Firebase project**
- A configured **Google Maps API** for map functionality

### 1. Clone the repository

```bash
git clone https://github.com/tracolerd/Zero-Trap---Android-App.git
cd Zero-Trap---Android-App
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase and Google Maps

Before running the app, configure the required Firebase and Maps credentials for your environment.

Do **not** publish private credentials, service-account keys, or other secrets to a public repository. Use environment-specific configuration and secret management where appropriate.

### 4. Start Expo

```bash
npx expo start
```

From there you can launch the project using an Android emulator/device or another supported Expo development workflow.

---

## 🔥 Firebase Setup

Zero Trap uses Firebase for core cloud functionality, including authentication and Firestore-backed application data.

At a minimum, your Firebase setup should include:

1. A Firebase project.
2. Firebase Authentication configured for the authentication flow used by the app.
3. A Cloud Firestore database.
4. Firestore security rules compatible with the app's data model.
5. The appropriate Android application registration.

The project also includes `firestore.rules` so database access rules can be maintained alongside the application source code.

### Security note

Firebase client configuration values are not automatically equivalent to secret credentials. However, **API keys, OAuth identifiers, Firebase configuration, and especially service-account credentials still need proper restriction and access controls**. Never commit Firebase Admin SDK private keys or other backend secrets.

---

## 🏗 Architecture

At a high level, the application follows this flow:

```text
┌───────────────────────┐
│   React Native App    │
│       + Expo          │
└───────────┬───────────┘
            │
    ┌───────┼────────┐
    │       │        │
    ▼       ▼        ▼
 Location  Auth   Notifications
    │       │        │
    └───────┼────────┘
            ▼
      Firebase Services
       ┌────┴─────┐
       │          │
       ▼          ▼
 Firestore     Other Firebase
  Data Store     Services
```

The application also uses local persistence through **AsyncStorage** for client-side state/session needs.

---

## 📜 Available Scripts

Defined in `package.json`:

```bash
npm start
```
Starts the Expo development server.

```bash
npm run android
```
Runs the Android development workflow.

```bash
npm run ios
```
Runs the iOS development workflow where the environment supports it.

```bash
npm run web
```
Starts the Expo web workflow.

```bash
npm run purge:all-users
```
Runs the repository's user-data purge utility script. Use this only when you understand its purpose and consequences.

---

## 📦 Android Build with EAS

The repository includes `eas.json` for Expo Application Services workflows.

### Login

```bash
eas login
```

### Configure EAS

```bash
eas build:configure
```

### Build Android

```bash
eas build --platform android
```

Choose the appropriate EAS profile for your development or production workflow.

---

## 🗺️ Permissions

The Android configuration currently declares permissions related to:

- Approximate and precise location
- Background location
- Camera
- Photo/media access
- Notifications
- Internet/network state
- Wake lock

These permissions exist because Zero Trap depends on location-aware emergency functionality, communication, notifications, and profile media features.

---

## 🛣 Roadmap

- [x] Core authentication and profile management
- [x] Location-aware emergency requests
- [x] Map integration
- [x] Real-time communication foundation
- [x] Firebase / Firestore integration
- [x] Expo notification integration
- [ ] Refine push-notification delivery flows
- [ ] Strengthen offline emergency communication
- [ ] Expand volunteer reputation / achievement system
- [ ] Improve helper-request matching
- [ ] Expand automated testing and CI coverage
- [ ] Production hardening and security review

---

## 🔐 Security

Zero Trap handles sensitive functionality such as **location, authentication, communication, and emergency-related data**. Security should therefore be treated as a first-class part of the project.

When contributing or deploying:

- Never commit private API keys or service-account credentials.
- Restrict cloud APIs by platform, application, and usage where possible.
- Review Firestore rules before production deployment.
- Minimize collection and retention of sensitive user data.
- Test permission flows carefully on real Android devices.
- Review third-party Firebase and Google Cloud configuration before release.

For security vulnerabilities, please avoid publishing exploit details in a public issue. Contact the maintainer directly so the issue can be assessed responsibly.

---

## 🤝 Contributing

Contributions are welcome.

### Typical workflow

```bash
git checkout -b feature/your-feature

git add .
git commit -m "feat: describe your change"
git push origin feature/your-feature
```

Then open a Pull Request against `main`.

For bug fixes, use clear commit messages and include enough context for the change to be reviewed and reproduced.

---

## 👨‍💻 Maintainer

**Nurul Faiyaz**

- GitHub: [@tracolerd](https://github.com/tracolerd)
- LinkedIn: [faiyaz-xyz](https://www.linkedin.com/in/faiyaz-xyz)

---

## 📄 License

This project is distributed under the license included in the repository's [`LICENSE`](LICENSE) file.

---

<div align="center">

### Built with purpose for people who need help when it matters most. ❤️

⭐ **Star the repository if you find the project interesting.**

</div>
