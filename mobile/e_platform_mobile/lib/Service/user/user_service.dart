import '../../core/api/api_client.dart';
import '../../core/api/api_endpoints.dart';

/// User Service
/// Handles all user-related API calls
class UserService {
  final ApiClient _apiClient = ApiClient();

  /// Get user profile by ID
  Future<Map<String, dynamic>> getUserProfile(String userId) async {
    final response = await _apiClient.get(
      ApiEndpoints.userMe,
    );
    return response.data;
  }

  /// Update user profile
  Future<Map<String, dynamic>> updateUserProfile(
    String userId,
    Map<String, dynamic> data,
  ) async {
    final response = await _apiClient.patch(
      ApiEndpoints.userMe,
      data: data,
    );
    return response.data;
  }

  /// Get user by ID
  Future<Map<String, dynamic>> getUserById(String userId) async {
    final response = await _apiClient.get(
      ApiEndpoints.userById(userId),
    );
    return response.data;
  }

  /// Get all users (admin only)
  Future<List<Map<String, dynamic>>> getAllUsers({
    int? page,
    int? limit,
    String? role,
  }) async {
    final response = await _apiClient.get(
      ApiEndpoints.users,
      queryParameters: {
        if (page != null) 'page': page,
        if (limit != null) 'limit': limit,
        if (role != null) 'role': role,
      },
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Delete user (admin only)
  Future<void> deleteUser(String userId) async {
    await _apiClient.delete(ApiEndpoints.userMe);
  }

  /// Approve instructor (admin only)
  Future<Map<String, dynamic>> approveInstructor(String userId) async {
    final response = await _apiClient.patch(
      ApiEndpoints.adminApproveInstructor(userId),
    );
    return response.data;
  }

  /// Decline instructor (admin only)
  Future<Map<String, dynamic>> declineInstructor(
    String userId,
    String reason,
  ) async {
    final response = await _apiClient.patch(
      ApiEndpoints.adminDeclineInstructor(userId),
      data: {'reason': reason},
    );
    return response.data;
  }

  /// Onboard user
  Future<Map<String, dynamic>> onboardUser(Map<String, dynamic> data) async {
    final response = await _apiClient.post(
      ApiEndpoints.userOnboard,
      data: data,
    );
    return response.data;
  }

  /// Get my profile
  Future<Map<String, dynamic>> getMyProfile() async {
    final response = await _apiClient.get(
      ApiEndpoints.userMe,
    );
    return response.data;
  }

  /// Update my profile
  Future<Map<String, dynamic>> updateMyProfile(
    Map<String, dynamic> data,
  ) async {
    final response = await _apiClient.patch(
      ApiEndpoints.userMe,
      data: data,
    );
    return response.data;
  }

  /// Delete my profile
  Future<void> deleteMyProfile() async {
    await _apiClient.delete(ApiEndpoints.userMe);
  }
}
