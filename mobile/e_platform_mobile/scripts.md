# Flutter Scripts Reference

This document contains commonly used Flutter commands for the E-Platform Mobile app.

## Development Commands

### Install Dependencies
```bash
flutter pub get
```

### Run App
```bash
# Run on connected device/emulator
flutter run

# Run with specific BFF URL
flutter run --dart-define=BFF_URL=http://localhost:3001

# Run in release mode
flutter run --release

# Run on specific device
flutter devices                    # List available devices
flutter run -d <device-id>        # Run on specific device
```

### Build Commands
```bash
# Build APK for Android
flutter build apk

# Build APK (split per ABI)
flutter build apk --split-per-abi

# Build App Bundle for Play Store
flutter build appbundle

# Build iOS
flutter build ios

# Build Web
flutter build web
```

## Code Quality

### Analyze Code
```bash
flutter analyze
```

### Format Code
```bash
# Format all Dart files
flutter format .

# Check formatting without changing files
flutter format --set-exit-if-changed .
```

### Run Tests
```bash
# Run all tests
flutter test

# Run tests with coverage
flutter test --coverage

# Run specific test file
flutter test test/widget_test.dart
```

## Clean & Reset

### Clean Build
```bash
# Clean build files
flutter clean

# Clean and get dependencies
flutter clean && flutter pub get
```

### Reset Flutter
```bash
# Reset Flutter cache (if issues occur)
flutter doctor
flutter pub cache repair
```

## Platform-Specific

### Android
```bash
# Build debug APK
flutter build apk --debug

# Build release APK
flutter build apk --release

# Install on connected device
flutter install
```

### iOS
```bash
# Build for iOS simulator
flutter build ios --simulator

# Build for iOS device
flutter build ios
```

## Environment Variables

### Set BFF URL
```bash
# Development
flutter run --dart-define=BFF_URL=http://localhost:3001

# Production
flutter run --dart-define=BFF_URL=https://api.e-platform.com

# Build with environment variable
flutter build apk --dart-define=BFF_URL=https://api.e-platform.com
```

## Useful Commands

### Check Flutter Setup
```bash
flutter doctor
flutter doctor -v
```

### List Connected Devices
```bash
flutter devices
```

### Upgrade Flutter
```bash
flutter upgrade
```

### Check Dependencies
```bash
flutter pub outdated
flutter pub upgrade
```

## Quick Reference

| Command | Description |
|---------|-------------|
| `flutter pub get` | Install dependencies |
| `flutter run` | Run app on connected device |
| `flutter build apk` | Build Android APK |
| `flutter analyze` | Check code for issues |
| `flutter format .` | Format all code |
| `flutter test` | Run tests |
| `flutter clean` | Clean build files |

