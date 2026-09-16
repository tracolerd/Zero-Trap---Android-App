<div align="center">

<img src="assets/icon.png" alt="Zero Trap app icon" width="112" />

# Zero Trap

### Emergency help, one tap away.

Zero Trap is a community-powered emergency assistance app that helps people request urgent support and connects them with nearby volunteers through location-aware, real-time communication.

<p>
  <a href="https://github.com/tracolerd/Zero-Trap---Android-App/stargazers"><img src="https://img.shields.io/github/stars/tracolerd/Zero-Trap---Android-App?style=flat-square&logo=github&color=ffb000" alt="GitHub stars" /></a>
  <a href="https://github.com/tracolerd/Zero-Trap---Android-App/network/members"><img src="https://img.shields.io/github/forks/tracolerd/Zero-Trap---Android-App?style=flat-square&logo=github&color=5865f2" alt="GitHub forks" /></a>
  <a href="https://github.com/tracolerd/Zero-Trap---Android-App/blob/main/LICENSE"><img src="https://img.shields.io/github/license/tracolerd/Zero-Trap---Android-App?style=flat-square&color=2ea44f" alt="License" /></a>
  <a href="https://github.com/tracolerd/Zero-Trap---Android-App"><img src="https://img.shields.io/github/last-commit/tracolerd/Zero-Trap---Android-App?style=flat-square&color=ff3b30" alt="Last commit" /></a>
</p>

<p>
  <img src="https://img.shields.io/badge/React%20Native-0.76.9-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native 0.76.9" />
  <img src="https://img.shields.io/badge/Expo%20SDK-52-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo SDK 52" />
  <img src="https://img.shields.io/badge/Firebase-10.7.1-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase 10.7.1" />
  <img src="https://img.shields.io/badge/Android-supported-3DDC84?style=for-the-badge&logo=android&logoColor=white" alt="Android supported" />
</p>

<p>
  <a href="#-getting-started">Get started</a>
  &nbsp;&bull;&nbsp;
  <a href="#-how-it-works">How it works</a>
  &nbsp;&bull;&nbsp;
  <a href="#-roadmap">Roadmap</a>
  &nbsp;&bull;&nbsp;
  <a href="#-contributing">Contributing</a>
</p>

</div>

---

## Why Zero Trap?

Emergencies are time-sensitive. Zero Trap focuses on the few things that matter most when someone needs help:

- **Fast requests** — create an emergency help request with minimal friction.
- **Local awareness** — use location to surface nearby help opportunities.
- **Connected response** — keep requesters and helpers in touch with real-time messaging.
- **Responsible foundations** — combine authentication, permissions, cloud data, and notifications in one focused mobile experience.

> **Mission:** Make emergency assistance more connected, more responsive, and more accessible.

## ✨ Features

| Experience | What it provides |
| --- | --- |
| 🆘 Emergency assistance | Create and track help requests for people who need urgent support. |
| 📍 Location & maps | GPS-based location, nearby visibility, Google Maps, and Android background-location support. |
| 💬 Real-time communication | Persistent, timestamped conversations backed by Firebase. |
| 🔐 Authentication & profiles | Firebase Authentication, profile management, and local session persistence. |
| 🔔 Notifications | Expo Notifications integration for emergency-related updates. |
| 📷 Profile media | Camera and photo-library support for profile images with user-facing permission copy. |

## 🧭 How it works

```text
  Request help
       │
       ▼
  Share location ───────► Nearby helpers discover the request
       │                                  │
       └──────── Real-time messaging ◄────┘
                          │
                          ▼
                    Coordinate support
```

## 🛠 Technology

<div align="center">

| Layer | Technology |
| :--- | :--- |
| Mobile app | React Native 0.76.9 + Expo SDK 52 |
| Language | JavaScript |
| Navigation | React Navigation |
| Backend | Firebase |
| Data | Cloud Firestore |
| Authentication | Firebase Authentication |
| Maps | React Native Maps + Google Maps |
| Local state | AsyncStorage |
| Device services | Expo Location, Expo Device, Expo Task Manager |
| Notifications | Expo Notifications |
| Media | Expo Image Picker |
| Delivery | Expo Application Services (EAS) |

</div>

## 📁 Project layout

```text
ZeroTrapApp/
├── assets/             # App icons, splash assets, and static resources
├── components/         # Reusable UI components
├── navigation/         # Navigation configuration
├── screens/            # Application screens
├── services/           # Firebase and application services
├── utils/              # Shared utilities
├── scripts/            # Maintenance and administrative scripts
├── App.js              # Application entry point
├── app.json            # Expo configuration
├── eas.json            # EAS build profiles
├── firestore.rules     # Firestore security rules
├── firebaseConfig.js   # Firebase client configuration
└── package.json        # Dependencies and npm scripts
```

## 🚀 Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) and npm
- [Git](https://git-scm.com/)
- An Android emulator or physical Android device
- [Android Studio](https://developer.android.com/studio) for native Android workflows
- An Expo-compatible development environment
- A Firebase project and a restricted Google Maps API key

### 1. Clone and install

```bash
git clone https://github.com/tracolerd/Zero-Trap---Android-App.git
cd Zero-Trap---Android-App
npm install
```

### 2. Configure services

Configure the Firebase project, Android app registration, authentication providers, Firestore database, and Google Maps API access required by your environment.

Keep environment-specific credentials outside version control. Never commit service-account keys, unrestricted API keys, or private Firebase Admin credentials.

### 3. Run the app

```bash
npx expo start
```

Then press `a` to open an Android emulator, or scan the QR code with an appropriate Expo development client.

> **Note:** Location, background tasks, notifications, camera access, and maps should be tested on a physical Android device. Emulator behavior may differ from production devices.

## 📜 Available commands

| Command | Purpose |
| --- | --- |
| `npm start` | Start the Expo development server |
| `npm run android` | Run the Android development workflow |
| `npm run ios` | Run the iOS workflow where supported |
| `npm run web` | Start the Expo web workflow |
| `npm run purge:all-users` | Run the user-data purge utility — use with care |

## 🔥 Firebase checklist

Before using the app with real data:

1. Create or select a Firebase project.
2. Register the Android application using package `com.zerotrap.emergency`.
3. Configure the authentication providers used by the app.
4. Create a Cloud Firestore database.
5. Review and deploy [`firestore.rules`](firestore.rules).
6. Restrict Google Maps and Firebase-related API access by platform and usage.

Firebase client configuration values are not the same as server-side secrets, but they still require appropriate restrictions. Never publish Firebase Admin SDK private keys or service-account credentials.

## 📦 Android builds with EAS

The repository includes development, preview, and production profiles in [`eas.json`](eas.json).

```bash
# Authenticate with EAS
npx eas login

# Configure EAS for the project
npx eas build:configure

# Build an Android artifact
npx eas build --platform android
```

Use the `preview` profile for an installable APK and the `production` profile for an Android App Bundle intended for release workflows.

## 🔐 Permissions & privacy

Zero Trap requests permissions for:

- Approximate and precise location, including background location
- Camera and photo/media access
- Notifications
- Internet, network state, and wake lock

These permissions support the app's emergency, communication, notification, and profile features. Request only what the active experience needs, explain why it is needed, and review permission behavior on real devices before release.

## 🛣 Roadmap

- [x] Core authentication and profile management
- [x] Location-aware emergency requests
- [x] Map integration
- [x] Real-time communication foundation
- [x] Firebase / Firestore integration
- [x] Expo notification integration
- [ ] Refine push-notification delivery flows
- [ ] Strengthen offline emergency communication
- [ ] Expand the volunteer reputation and achievement system
- [ ] Improve helper-request matching
- [ ] Expand automated testing and CI coverage
- [ ] Complete production hardening and security review

## 🤝 Contributing

Contributions, bug reports, and thoughtful product ideas are welcome.

```bash
git checkout -b feature/your-feature
git add .
git commit -m "feat: describe your change"
git push origin feature/your-feature
```

Open a pull request against `main` with a concise summary, testing notes, and screenshots for user-facing changes. For security vulnerabilities, please contact the maintainer privately instead of publishing exploit details in a public issue.

## 👨‍💻 Maintainer

**Nurul Faiyaz** · [GitHub](https://github.com/tracolerd) · [LinkedIn](https://www.linkedin.com/in/faiyaz-xyz)

## 📄 License

This project is distributed under the license included in [`LICENSE`](LICENSE).

<div align="center">

<br />

**Built with purpose for people who need help when it matters most. ❤️**

<br />
<br />

<a href="https://github.com/tracolerd/Zero-Trap---Android-App">⭐ Star the repository</a> if you find the project useful or interesting.

</div>
