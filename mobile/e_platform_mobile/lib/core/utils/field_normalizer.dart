/// Field Normalizer Utility
/// Ensures consistent field names across API responses
/// Follows web architecture conventions

class FieldNormalizer {
  /// Normalize payment object to use 'paymentId' field
  /// Web uses 'paymentId' as canonical field, backend may return 'id' or '_id'
  static Map<String, dynamic> normalizePayment(Map<String, dynamic> payment) {
    return {
      ...payment,
      'paymentId': payment['paymentId'] ?? payment['id'] ?? payment['_id'],
    };
  }

  /// Normalize course object to use 'courseId' field
  /// Web uses 'courseId' as canonical field, backend may return 'id'
  static Map<String, dynamic> normalizeCourse(Map<String, dynamic> course) {
    return {
      ...course,
      'courseId': course['courseId'] ?? course['id'],
    };
  }

  /// Normalize enrollment object to use 'enrollmentId' field
  /// Web uses 'enrollmentId' as canonical field, backend may return 'id'
  static Map<String, dynamic> normalizeEnrollment(Map<String, dynamic> enrollment) {
    return {
      ...enrollment,
      'enrollmentId': enrollment['enrollmentId'] ?? enrollment['id'],
    };
  }

  /// Normalize transaction object to use 'transactionId' field
  /// Web uses 'transactionId' as canonical field, backend may return 'id'
  static Map<String, dynamic> normalizeTransaction(Map<String, dynamic> transaction) {
    return {
      ...transaction,
      'transactionId': transaction['transactionId'] ?? transaction['id'],
    };
  }

  /// Normalize user object to use 'userId' field
  /// Web uses 'userId' as canonical field, backend may return 'id' or 'uid'
  static Map<String, dynamic> normalizeUser(Map<String, dynamic> user) {
    return {
      ...user,
      'userId': user['userId'] ?? user['uid'] ?? user['id'],
    };
  }

  /// Extract payment ID from payment object
  /// Checks paymentId, id, and _id fields
  static String? extractPaymentId(Map<String, dynamic>? payment) {
    if (payment == null) return null;
    final value = payment['paymentId'] ?? payment['id'] ?? payment['_id'];
    return value?.toString();
  }

  /// Extract course ID from course object
  /// Checks courseId and id fields
  static String? extractCourseId(Map<String, dynamic>? course) {
    if (course == null) return null;
    final value = course['courseId'] ?? course['id'];
    return value?.toString();
  }

  /// Extract enrollment ID from enrollment object
  /// Checks enrollmentId and id fields
  static String? extractEnrollmentId(Map<String, dynamic>? enrollment) {
    if (enrollment == null) return null;
    final value = enrollment['enrollmentId'] ?? enrollment['id'];
    return value?.toString();
  }

  /// Extract user ID from user object
  /// Checks userId, uid, and id fields
  static String? extractUserId(Map<String, dynamic>? user) {
    if (user == null) return null;
    final value = user['userId'] ?? user['uid'] ?? user['id'];
    return value?.toString();
  }

  /// Normalize a list of payments
  static List<Map<String, dynamic>> normalizePaymentList(List<dynamic> payments) {
    return payments
        .map((p) => normalizePayment(p as Map<String, dynamic>))
        .toList();
  }

  /// Normalize a list of courses
  static List<Map<String, dynamic>> normalizeCourseList(List<dynamic> courses) {
    return courses
        .map((c) => normalizeCourse(c as Map<String, dynamic>))
        .toList();
  }

  /// Normalize a list of enrollments
  static List<Map<String, dynamic>> normalizeEnrollmentList(List<dynamic> enrollments) {
    return enrollments
        .map((e) => normalizeEnrollment(e as Map<String, dynamic>))
        .toList();
  }

  /// Normalize purchase completion response
  /// Web expects flat structure with payment, transaction, enrollment at root
  static Map<String, dynamic> normalizePurchaseCompletion(Map<String, dynamic> response) {
    final normalized = Map<String, dynamic>.from(response);
    
    // Normalize nested payment object
    if (normalized['payment'] != null) {
      normalized['payment'] = normalizePayment(
        normalized['payment'] as Map<String, dynamic>
      );
    }
    
    // Normalize nested transaction object
    if (normalized['transaction'] != null) {
      normalized['transaction'] = normalizeTransaction(
        normalized['transaction'] as Map<String, dynamic>
      );
    }
    
    // Normalize nested enrollment object
    if (normalized['enrollment'] != null) {
      normalized['enrollment'] = normalizeEnrollment(
        normalized['enrollment'] as Map<String, dynamic>
      );
    }
    
    return normalized;
  }

  /// Standardize payment method field name
  /// Web uses 'paymentMethod', some APIs may use 'paymentGateway'
  /// Canonical values: 'card', 'paypal', 'stripe'
  static String normalizePaymentMethod(Map<String, dynamic> data) {
    final method = data['paymentMethod'] ?? data['paymentGateway'] ?? 'card';
    return method.toString().toLowerCase();
  }

  /// Standardize payment status values
  /// Canonical values: 'pending', 'completed', 'failed', 'refunded'
  static String normalizePaymentStatus(String? status) {
    if (status == null) return 'pending';
    final lower = status.toLowerCase();
    
    // Map common variations
    if (lower == 'success' || lower == 'succeeded') return 'completed';
    if (lower == 'cancelled' || lower == 'canceled') return 'failed';
    
    return lower;
  }

  /// Standardize payment type values
  /// Canonical values: 'course_purchase', 'subscription'
  static String normalizePaymentType(String? type) {
    if (type == null) return 'course_purchase';
    final lower = type.toLowerCase();
    
    // Map common variations
    if (lower == 'course' || lower == 'purchase') return 'course_purchase';
    if (lower == 'sub' || lower == 'subscription_payment') return 'subscription';
    
    return lower;
  }
}
