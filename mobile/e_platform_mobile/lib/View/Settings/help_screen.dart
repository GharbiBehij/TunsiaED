import 'package:flutter/material.dart';

/// Help & Support Screen
/// Provides help resources, FAQs, and contact support
class HelpScreen extends StatelessWidget {
  const HelpScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Help & Support'),
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: [
          // Search Bar
          TextField(
            decoration: InputDecoration(
              hintText: 'Search for help...',
              prefixIcon: const Icon(Icons.search),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Quick Actions
          _buildSectionTitle('Quick Actions'),
          const SizedBox(height: 12),
          _buildActionCard(
            context,
            icon: Icons.email_outlined,
            title: 'Contact Support',
            subtitle: 'Get help from our support team',
            onTap: () {
              // TODO: Open email client or contact form
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Opening email client...')),
              );
            },
          ),
          const SizedBox(height: 12),
          _buildActionCard(
            context,
            icon: Icons.chat_bubble_outline,
            title: 'Live Chat',
            subtitle: 'Chat with our support team',
            onTap: () {
              // TODO: Open chat interface
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Chat feature coming soon')),
              );
            },
          ),
          const SizedBox(height: 24),

          // FAQs
          _buildSectionTitle('Frequently Asked Questions'),
          const SizedBox(height: 12),
          _buildFAQItem(
            'How do I enroll in a course?',
            'Browse courses, select the one you want, and click "Enroll Now". You can pay using your preferred payment method.',
          ),
          _buildFAQItem(
            'Can I get a refund?',
            'Yes, we offer a 30-day money-back guarantee on all courses. Contact support to request a refund.',
          ),
          _buildFAQItem(
            'How do I track my progress?',
            'Go to your dashboard to see your progress across all enrolled courses. Each course shows your completion percentage.',
          ),
          _buildFAQItem(
            'How do I download my certificate?',
            'Once you complete a course with 100% progress, go to the Certificates tab and click Download.',
          ),
          _buildFAQItem(
            'Can I access courses offline?',
            'Currently, courses require an internet connection. Offline access is coming in a future update.',
          ),
          const SizedBox(height: 24),

          // Contact Info
          _buildSectionTitle('Contact Information'),
          const SizedBox(height: 12),
          _buildContactCard(
            icon: Icons.email,
            title: 'Email',
            value: 'support@tunisiaed.com',
          ),
          const SizedBox(height: 12),
          _buildContactCard(
            icon: Icons.phone,
            title: 'Phone',
            value: '+216 XX XXX XXX',
          ),
          const SizedBox(height: 12),
          _buildContactCard(
            icon: Icons.language,
            title: 'Website',
            value: 'www.tunisiaed.com',
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 20,
        fontWeight: FontWeight.bold,
      ),
    );
  }

  Widget _buildActionCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Theme.of(context).primaryColor.withOpacity(0.1),
          child: Icon(icon, color: Theme.of(context).primaryColor),
        ),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: onTap,
      ),
    );
  }

  Widget _buildFAQItem(String question, String answer) {
    return ExpansionTile(
      title: Text(
        question,
        style: const TextStyle(fontWeight: FontWeight.w600),
      ),
      children: [
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: Text(
            answer,
            style: const TextStyle(color: Colors.black87),
          ),
        ),
      ],
    );
  }

  Widget _buildContactCard({
    required IconData icon,
    required String title,
    required String value,
  }) {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        leading: Icon(icon),
        title: Text(title),
        subtitle: Text(value),
      ),
    );
  }
}
