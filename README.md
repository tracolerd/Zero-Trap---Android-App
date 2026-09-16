<div align="center">

<img src="assets/icon.png" alt="Zero Trap logo" width="120" />

# Zero Trap

### Emergency help, one tap away.

<p><strong>A community-powered mobile emergency assistance network for faster, safer, more connected help.</strong></p>

<p>
  <a href="https://github.com/tracolerd/Zero-Trap---Android-App/stargazers"><img src="https://img.shields.io/github/stars/tracolerd/Zero-Trap---Android-App?style=flat-square&logo=github&color=ffb000" alt="GitHub stars" /></a>
  <a href="https://github.com/tracolerd/Zero-Trap---Android-App/blob/main/LICENSE"><img src="https://img.shields.io/github/license/tracolerd/Zero-Trap---Android-App?style=flat-square&color=2ea44f" alt="License" /></a>
  <a href="https://github.com/tracolerd/Zero-Trap---Android-App"><img src="https://img.shields.io/github/last-commit/tracolerd/Zero-Trap---Android-App?style=flat-square&color=ff3b30" alt="Last commit" /></a>
</p>

<p>
  <img src="https://img.shields.io/badge/React%20Native-0.76.9-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native 0.76.9" />
  <img src="https://img.shields.io/badge/Expo%20SDK-52-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo SDK 52" />
  <img src="https://img.shields.io/badge/Firebase-10.7.1-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase 10.7.1" />
  <img src="https://img.shields.io/badge/Android-ready-3DDC84?style=for-the-badge&logo=android&logoColor=white" alt="Android ready" />
</p>

<p>
  <a href="#-overview">Overview</a>
  &nbsp;&bull;&nbsp;
  <a href="#-capabilities">Capabilities</a>
  &nbsp;&bull;&nbsp;
  <a href="#-setup">Setup</a>
  &nbsp;&bull;&nbsp;
  <a href="#-security">Security</a>
  &nbsp;&bull;&nbsp;
  <a href="#-contributing">Contributing</a>
</p>

</div>

---

## 🎯 Overview

Emergencies are time-sensitive. **Zero Trap** gives people a focused way to request support, share a location, communicate with helpers, and coordinate assistance through one mobile experience.

> **Mission:** Make emergency assistance more connected, more responsive, and more accessible.

## ✨ Capabilities

### Request and respond

- Create and track emergency help requests.
- Discover nearby opportunities to help.
- Support internet and short-range Bluetooth-oriented flows.
- Preserve request history with explicit active, accepted, completed, and cancelled states.

### Stay connected

- Share location with the appropriate emergency flow.
- Use Google Maps and Android location services.
- Communicate through real-time, timestamped conversations.
- Receive emergency-related push notifications.

### Build trust

- Firebase Authentication and profile management.
- Helping scores and community activity.
- Privacy policy and terms screens.
- User reporting and blocking foundations.

## 🧭 Product flow

```text
  REQUEST HELP
       │
       ▼
  SHARE LOCATION ──────► NEARBY HELPERS DISCOVER THE REQUEST
       │                                  │
       └──────── REAL-TIME CHAT ◄─────────┘
                          │
                          ▼
                    COORDINATE SUPPORT
```

## 🛠 Built with

- **Mobile:** React Native 0.76.9, Expo SDK 52, JavaScript
- **Navigation:** React Navigation
- **Cloud:** Firebase Authentication, Cloud Firestore, Firebase Storage
- **Maps and device services:** React Native Maps, Expo Location, Expo Device, Expo Task Manager
- **Engagement:** Expo Notifications, AsyncStorage, Expo Image Picker
- **Delivery:** Expo Application Services (EAS)

## 📁 Project structure

```text
ZeroTrapApp/
├── assets/             # Branded icons, splash artwork, and static resources
├── components/         # Reusable interface components
├── navigation/         # Navigation configuration
├── screens/            # Application screens
├── services/           # Firebase, location, notification, and storage services
├── utils/              # Shared utilities
├── scripts/            # Administrative utilities
├── App.js              # Application entry point
├── app.config.js       # Expo configuration and private environment/build overrides
├── eas.json            # EAS build profiles
├── firestore.rules     # Firestore access rules
├── firebaseConfig.js   # Environment-based Firebase client setup
└── package.json        # Dependencies and npm scripts
```

## 🚀 Setup

### Prerequisites

- [Node.js](https://nodejs.org/) and npm
- [Git](https://git-scm.com/)
- Android Studio with an emulator or a physical Android device
- A Firebase project with Authentication and Firestore enabled
- A restricted Google Maps API key
- An Expo / EAS account for device builds

### Install and run

```bash
git clone https://github.com/tracolerd/Zero-Trap---Android-App.git
cd Zero-Trap---Android-App
npm install
npx expo start
```

Press `a` to open Android, or use an appropriate Expo development client.

### Configure Firebase safely

The repository intentionally contains no live Firebase, Google Maps, Android, or EAS credentials.

1. Copy `google-services.example.json` to `google-services.json` locally and fill it with the Android configuration downloaded from Firebase Console.
2. Create a local `.env.local` file with the Firebase web values:

```dotenv
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_web_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_firebase_web_app_id
```

3. Configure the Google Maps key and EAS project in your private build environment:

```dotenv
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_restricted_maps_key
EXPO_PUBLIC_EAS_PROJECT_ID=your_eas_project_id
```

4. Restrict every key by Android package, signing certificate, API, quota, and environment.

> Location, background tasks, notifications, camera access, and maps should be tested on a physical Android device before release.

## 📜 Commands

```bash
npm start                 # Start the Expo development server
npm run android           # Run the Android development workflow
npm run ios               # Run the iOS workflow where supported
npm run web               # Start the web workflow
npx expo-doctor           # Validate Expo configuration and dependencies
npx expo export --platform android --clear
npx expo export --platform web --clear
```

### EAS builds

```bash
npx eas login
npx eas build:configure
npx eas build --platform android
```

Use the `preview` profile for an installable APK and `production` for an Android App Bundle.

## 🔐 Security

Zero Trap handles location, authentication, communication, and emergency-related data. Please:

- Never commit `google-services.json`, service-account keys, `.env` files, keystores, or private API credentials.
- Review [`firestore.rules`](firestore.rules) before deploying production data.
- Use a private release/upload keystore and configure release certificate restrictions.
- Keep Firebase and Google Cloud keys limited to the APIs and apps that need them.
- Minimize sensitive data collection and retention.
- Report vulnerabilities privately to the maintainer instead of publishing exploit details.

## 🛣 Roadmap

- [x] Authentication and profile management
- [x] Location-aware emergency requests
- [x] Map integration and real-time communication foundation
- [x] Firebase / Firestore integration
- [x] Expo notification integration
- [ ] Refine push-notification delivery
- [ ] Improve offline emergency communication
- [ ] Expand helper matching and reputation
- [ ] Increase automated test and CI coverage
- [ ] Complete production hardening and security review

## 🤝 Contributing

Contributions, bug reports, and thoughtful product ideas are welcome.

```bash
git checkout -b feature/your-feature
git add .
git commit -m "feat: describe your change"
git push origin feature/your-feature
```

Open a pull request against `main` with a concise summary, testing notes, and screenshots for user-facing changes.

## 👨‍💻 Maintainer

**Nurul Faiyaz** · [GitHub](https://github.com/tracolerd) · [LinkedIn](https://www.linkedin.com/in/faiyaz-xyz)

## 📄 License

This project is distributed under the license included in [`LICENSE`](LICENSE).

<div align="center">

<br />

**Built with purpose for people who need help when it matters most.**

<br />
<br />

<a href="https://github.com/tracolerd/Zero-Trap---Android-App">⭐ Star the repository</a> if you find the project useful.

</div>
