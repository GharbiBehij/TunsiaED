import 'package:flutter/material.dart';

/// Privacy Policy Screen
/// Displays privacy policy information
class PrivacyPolicyScreen extends StatelessWidget {
  const PrivacyPolicyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Privacy Policy'),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Privacy Policy',
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
              'Introduction',
              'TunisiaED ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and services.',
            ),

            _buildSection(
              'Information We Collect',
              'We collect information that you provide directly to us, including:\n\n'
              '• Account information (name, email, password)\n'
              '• Profile information (photo, bio, preferences)\n'
              '• Course enrollment and progress data\n'
              '• Payment and transaction information\n'
              '• Communications with us\n\n'
              'We also automatically collect certain information about your device and usage patterns.',
            ),

            _buildSection(
              'How We Use Your Information',
              'We use the information we collect to:\n\n'
              '• Provide, maintain, and improve our services\n'
              '• Process your transactions and send related information\n'
              '• Send you technical notices, updates, and support messages\n'
              '• Respond to your comments and questions\n'
              '• Monitor and analyze trends, usage, and activities\n'
              '• Detect, prevent, and address technical issues',
            ),

            _buildSection(
              'Data Security',
              'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.',
            ),

            _buildSection(
              'Your Rights',
              'You have the right to:\n\n'
              '• Access your personal information\n'
              '• Correct inaccurate information\n'
              '• Request deletion of your information\n'
              '• Object to processing of your information\n'
              '• Export your data\n\n'
              'To exercise these rights, please contact us at privacy@tunisiaed.com',
            ),

            _buildSection(
              'Third-Party Services',
              'We may use third-party services (such as payment processors, analytics providers) that collect, monitor, and analyze information to help us provide better services. These third parties have their own privacy policies.',
            ),

            _buildSection(
              'Children\'s Privacy',
              'Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.',
            ),

            _buildSection(
              'Changes to This Policy',
              'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.',
            ),

            _buildSection(
              'Contact Us',
              'If you have questions about this Privacy Policy, please contact us at:\n\n'
              'Email: privacy@tunisiaed.com\n'
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
