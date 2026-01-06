# Loan App

A full-featured React Native mobile loan application built with **Expo**, designed to provide quick loans, bill payments, and utility services in one convenient app.

## Features
- **User Onboarding**: Signup, Login, Welcome screens
- **Complete Loan Application Process**:
  - Loan calculator
  - Personal details & BVN verification
  - Next of Kin information
  - Bank account linking
  - Loan summary review
  - Real-time loan status tracking
- **Bill Payments & Utilities**:
  - Airtime & Mobile Data top-up
  - Electricity bill payment
  - Cable TV subscriptions
  - Internet data plans
  - Water bill payment
  - Government levies & fees
- **Beautiful UI Components**:
  - Collapsible sections
  - Parallax scrolling
  - Themed text and views
  - Haptic feedback tabs
  - Custom wave animation
- **Firebase Integration** for authentication and backend services
- Built and distributed as Android App Bundle (`.aab`) via Expo EAS

## Tech Stack
- **Framework**: React Native (Expo Managed Workflow)
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Styling**: Dripsy (modern design system with theming)
- **Backend**: Firebase (Auth, Config, possibly Firestore/Functions)
- **Build & Deployment**: Expo Application Services (EAS)
- **Assets**: Custom branding (LoanWave logo, Mastercard/Visa/Verve icons)

## Project Structure
- `android/` — Native Android configuration
- `assets/` — App icons, splash, logos, animations
- `components/` — Reusable UI (ThemedView, ParallaxScrollView, etc.)
- `navigation/` — AppTabs, ApplyStack, BillsStack
- `screens/` — All feature screens (LoanForm, Bills, Login, etc.)
- `functions/` — Firebase Cloud Functions (if used)
- `hooks/` — Custom hooks (theme, color scheme)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/emee144/loan-app.git
   cd loan-app
