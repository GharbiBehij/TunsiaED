/// App Configuration
/// Environment-specific settings
class AppConfig {
  // Backend API Base URL
  // Can be overridden with --dart-define=API_BASE_URL=<url>
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: _defaultApiUrl,
  );

  // Default API URL based on environment
  static const String _defaultApiUrl = String.fromEnvironment(
    'ENVIRONMENT',
    defaultValue: 'prod',
  ) == 'dev'
      ? 'http://10.0.2.2:3001' // Android emulator localhost
      : String.fromEnvironment(
          'ENVIRONMENT',
          defaultValue: 'prod',
        ) == 'staging'
          ? 'https://tunsiaed-staging.onrender.com'
          : 'https://tunsiaed.onrender.com'; // Production

  // API Endpoints
  static const String apiPrefix = '/api/v1';

  // Timeouts
  static const Duration apiTimeout = Duration(seconds: 30);
  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);

  // Environment
  static const String environment = String.fromEnvironment(
    'ENVIRONMENT',
    defaultValue: 'prod',
  );
  
  static bool get isDevelopment => environment == 'dev';
  static bool get isStaging => environment == 'staging';
  static bool get isProduction => environment == 'prod';

  // Firebase Configuration (already in firebase_options.dart)
  
  // App Version
  static const String appVersion = '1.0.0';
  static const int buildNumber = 1;
  
  // Debug Mode
  static const bool isDebug = bool.fromEnvironment('DEBUG', defaultValue: false);
  static bool get isDebugMode => isDebug || isDevelopment;

  // Token Refresh Interval (55 minutes - before 1 hour expiration)
  static const Duration tokenRefreshInterval = Duration(minutes: 55);
  
  // Logging
  static bool get enableLogging => isDebugMode;
  
  // Display current config
  static void printConfig() {
    print('=== App Configuration ===');
    print('Environment: $environment');
    print('API Base URL: $apiBaseUrl');
    print('Version: $appVersion ($buildNumber)');
    print('Debug Mode: $isDebugMode');
    print('========================');
  }
}
