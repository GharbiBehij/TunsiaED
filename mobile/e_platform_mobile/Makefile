# E-Platform Mobile - Makefile
# Convenience commands for common Flutter operations

.PHONY: help install run build clean test analyze format

# Default target
help:
	@echo "E-Platform Mobile - Available Commands:"
	@echo ""
	@echo "  make install        - Install dependencies (flutter pub get)"
	@echo "  make run            - Run app on connected device (production)"
	@echo "  make run-dev        - Run app with dev flavor"
	@echo "  make run-staging    - Run app with staging flavor"
	@echo "  make run-prod       - Run app with production flavor"
	@echo "  make build          - Build production release APK"
	@echo "  make build-dev      - Build dev APK"
	@echo "  make build-staging  - Build staging APK"
	@echo "  make build-ios      - Build iOS app"
	@echo "  make clean          - Clean build files"
	@echo "  make test           - Run tests"
	@echo "  make analyze        - Analyze code"
	@echo "  make format         - Format code"
	@echo "  make doctor         - Check Flutter setup"
	@echo ""

# Install dependencies
install:
	flutter pub get

# Run app (production by default)
run:
	flutter run --flavor prod --dart-define=ENVIRONMENT=prod

# Run with dev flavor
run-dev:
	flutter run --flavor dev --dart-define=ENVIRONMENT=dev

# Run with staging flavor
run-staging:
	flutter run --flavor staging --dart-define=ENVIRONMENT=staging

# Run with production flavor
run-prod:
	flutter run --flavor prod --dart-define=ENVIRONMENT=prod

# Build production release APK
build:
	flutter build apk --release --flavor prod --dart-define=ENVIRONMENT=prod

# Build dev APK
build-dev:
	flutter build apk --release --flavor dev --dart-define=ENVIRONMENT=dev

# Build staging APK
build-staging:
	flutter build apk --release --flavor staging --dart-define=ENVIRONMENT=staging

# Build split APKs (smaller size)
build-split:
	flutter build apk --release --split-per-abi --flavor prod --dart-define=ENVIRONMENT=prod

# Build App Bundle for Play Store
build-bundle:
	flutter build appbundle --release --flavor prod --dart-define=ENVIRONMENT=prod

# Build iOS
build-ios:
	flutter build ios --release --dart-define=ENVIRONMENT=prod

# Clean build files
clean:
	flutter clean
	flutter pub get

# Run tests
test:
	flutter test

# Run tests with coverage
test-coverage:
	flutter test --coverage

# Analyze code
analyze:
	flutter analyze

# Format code
format:
	flutter format .

# Check formatting
format-check:
	flutter format --set-exit-if-changed .

# Check Flutter setup
doctor:
	flutter doctor -v

# List connected devices
devices:
	flutter devices

# Upgrade Flutter
upgrade:
	flutter upgrade

# Check for outdated packages
outdated:
	flutter pub outdated

# Upgrade packages
upgrade-packages:
	flutter pub upgrade

