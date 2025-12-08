import '../../core/api/api_client.dart';
import '../../core/api/api_endpoints.dart';

/// Certificate Service
/// Handles all certificate-related API calls
class CertificateService {
  final ApiClient _apiClient = ApiClient();

  /// Get all certificates for current user
  Future<List<Map<String, dynamic>>> getCertificates() async {
    final response = await _apiClient.get(
      ApiEndpoints.certificates,
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get certificate by ID
  Future<Map<String, dynamic>> getCertificateById(
    String certificateId,
  ) async {
    final response = await _apiClient.get(
      ApiEndpoints.certificateById(certificateId),
    );
    return response.data;
  }

  /// Request certificate for completed course
  Future<Map<String, dynamic>> requestCertificate(
    String courseId,
  ) async {
    final response = await _apiClient.post(
      ApiEndpoints.certificates,
      data: {'courseId': courseId},
    );
    return response.data;
  }

  /// Download certificate
  Future<Map<String, dynamic>> downloadCertificate(
    String certificateId,
  ) async {
    final response = await _apiClient.get(
      '${ApiEndpoints.certificateById(certificateId)}/download',
    );
    return response.data;
  }

  /// Verify certificate
  Future<Map<String, dynamic>> verifyCertificate(
    String certificateCode,
  ) async {
    final response = await _apiClient.get(
      '${ApiEndpoints.certificates}/verify/$certificateCode',
    );
    return response.data;
  }

  /// Issue certificate (admin/instructor)
  Future<Map<String, dynamic>> issueCertificate(
    Map<String, dynamic> data,
  ) async {
    final response = await _apiClient.post(
      ApiEndpoints.certificates,
      data: data,
    );
    return response.data;
  }

  /// Get my certificates
  Future<List<Map<String, dynamic>>> getMyCertificates() async {
    final response = await _apiClient.get(
      '${ApiEndpoints.certificates}/me',
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get course certificates (instructor/admin)
  Future<List<Map<String, dynamic>>> getCourseCertificates(
    String courseId,
  ) async {
    final response = await _apiClient.get(
      '${ApiEndpoints.certificates}/course/$courseId',
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get all certificates (admin only)
  Future<List<Map<String, dynamic>>> getAllCertificates() async {
    final response = await _apiClient.get(
      ApiEndpoints.certificates,
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Update certificate (admin only)
  Future<Map<String, dynamic>> updateCertificate(
    String certificateId,
    Map<String, dynamic> data,
  ) async {
    final response = await _apiClient.put(
      ApiEndpoints.certificateById(certificateId),
      data: data,
    );
    return response.data;
  }

  /// Revoke certificate (admin only)
  Future<void> revokeCertificate(String certificateId) async {
    await _apiClient.delete(
      ApiEndpoints.certificateById(certificateId),
    );
  }

  /// Check certificate eligibility
  Future<Map<String, dynamic>> checkEligibility(String courseId) async {
    final response = await _apiClient.get(
      '${ApiEndpoints.certificates}/eligibility/$courseId',
    );
    return response.data;
  }
}
