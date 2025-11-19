# E-Platform Mobile - Makefile
# Convenience commands for common Flutter operations

.PHONY: help install run build clean test analyze format

# Default target
help:
	@echo "E-Platform Mobile - Available Commands:"
	@echo ""
	@echo "  make install     - Install dependencies (flutter pub get)"
	@echo "  make run         - Run app on connected device"
	@echo "  make run-dev     - Run app with dev BFF URL"
	@echo "  make run-prod    - Run app with production BFF URL"
	@echo "  make build       - Build release APK"
	@echo "  make build-ios   - Build iOS app"
	@echo "  make clean       - Clean build files"
	@echo "  make test        - Run tests"
	@echo "  make analyze     - Analyze code"
	@echo "  make format      - Format code"
	@echo "  make doctor      - Check Flutter setup"
	@echo ""

# Install dependencies
install:
	flutter pub get

# Run app
run:
	flutter run

# Run with dev BFF URL
run-dev:
	flutter run --dart-define=BFF_URL=http://localhost:3001

# Run with production BFF URL (update URL as needed)
run-prod:
	flutter run --dart-define=BFF_URL=https://api.e-platform.com

# Build release APK
build:
	flutter build apk --release

# Build split APKs (smaller size)
build-split:
	flutter build apk --release --split-per-abi

# Build App Bundle for Play Store
build-bundle:
	flutter build appbundle

# Build iOS
build-ios:
	flutter build ios --release

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

