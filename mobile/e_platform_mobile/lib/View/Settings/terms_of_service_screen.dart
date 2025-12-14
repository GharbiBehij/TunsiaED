import 'package:flutter/material.dart';

/// Terms of Service Screen
/// Displays terms and conditions
class TermsOfServiceScreen extends StatelessWidget {
  const TermsOfServiceScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Terms of Service'),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Terms of Service',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Last updated: December 8, 2025',
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 14,
              ),
            ),
            const SizedBox(height: 24),

            _buildSection(
              'Acceptance of Terms',
              'By accessing and using TunisiaED, you accept and agree to be bound by the terms and conditions of this agreement. If you do not agree to these terms, please do not use our services.',
            ),

            _buildSection(
              'Use of Services',
              'You may use our services only as permitted by law and these Terms. You agree not to:\n\n'
              '• Misuse our services\n'
              '• Share your account credentials\n'
              '• Interfere with our services or servers\n'
              '• Access our services through automated means\n'
              '• Copy, modify, or distribute course content without permission',
            ),

            _buildSection(
              'Account Registration',
              'To access certain features, you must register for an account. You are responsible for:\n\n'
              '• Providing accurate and complete information\n'
              '• Maintaining the security of your account\n'
              '• All activities that occur under your account\n\n'
              'We reserve the right to suspend or terminate accounts that violate these terms.',
            ),

            _buildSection(
              'Course Enrollment and Access',
              'When you enroll in a course:\n\n'
              '• You gain access to course materials for the duration specified\n'
              '• You may not share course materials with others\n'
              '• We reserve the right to modify or discontinue courses\n'
              '• Course access may be revoked for violations of these terms',
            ),

            _buildSection(
              'Payments and Refunds',
              'All purchases are subject to our payment terms:\n\n'
              '• Prices are in Tunisian Dinar (TND)\n'
              '• Payment is required before accessing paid courses\n'
              '• Refunds are available within 30 days of purchase\n'
              '• Refunds are not available for completed courses',
            ),

            _buildSection(
              'Intellectual Property',
              'All content on TunisiaED, including courses, videos, text, graphics, and logos, is protected by copyright and other intellectual property laws. You may not:\n\n'
              '• Reproduce or distribute our content\n'
              '• Create derivative works\n'
              '• Use our content for commercial purposes\n\n'
              'without our express written permission.',
            ),

            _buildSection(
              'User Content',
              'By submitting content to our platform, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display that content in connection with our services.',
            ),

            _buildSection(
              'Disclaimers',
              'Our services are provided "as is" without warranties of any kind. We do not guarantee that:\n\n'
              '• Our services will be uninterrupted or error-free\n'
              '• Course content will meet your specific needs\n'
              '• Any certificates or credentials will be recognized by third parties',
            ),

            _buildSection(
              'Limitation of Liability',
              'To the maximum extent permitted by law, TunisiaED shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.',
            ),

            _buildSection(
              'Changes to Terms',
              'We reserve the right to modify these terms at any time. We will notify users of significant changes. Your continued use of our services after such changes constitutes acceptance of the new terms.',
            ),

            _buildSection(
              'Governing Law',
              'These terms are governed by the laws of Tunisia. Any disputes shall be resolved in the courts of Tunisia.',
            ),

            _buildSection(
              'Contact Us',
              'For questions about these Terms of Service, please contact us at:\n\n'
              'Email: legal@tunisiaed.com\n'
              'Address: Tunisia',
            ),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(String title, String content) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 12),
        Text(
          content,
          style: const TextStyle(
            fontSize: 16,
            height: 1.6,
            color: Colors.black87,
          ),
        ),
        const SizedBox(height: 24),
      ],
    );
  }
}
