import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../../ViewModel/Student/student_viewmodel.dart';
import '../../Service/certificate/certificate_service.dart';
import '../../core/utils/constants.dart';
import '../../core/utils/utils.dart';

/// Certificates Screen
/// Displays user's earned certificates
class CertificatesScreen extends StatefulWidget {
  const CertificatesScreen({Key? key}) : super(key: key);

  @override
  State<CertificatesScreen> createState() => _CertificatesScreenState();
}

class _CertificatesScreenState extends State<CertificatesScreen> {
  @override
  void initState() {
    super.initState();
    _loadCertificates();
  }

  Future<void> _loadCertificates() async {
    final studentViewModel =
        Provider.of<StudentViewModel>(context, listen: false);
    await studentViewModel.fetchCertificates();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Certificates'),
      ),
      body: Consumer<StudentViewModel>(
        builder: (context, viewModel, _) {
          if (viewModel.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (viewModel.error != null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.error_outline, size: 64, color: Colors.grey[400]),
                  const SizedBox(height: 16),
                  Text(viewModel.error!),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: _loadCertificates,
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          }

          final certificates = viewModel.certificates;
          if (certificates.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.card_membership_outlined,
                      size: 64, color: Colors.grey[400]),
                  const SizedBox(height: 16),
                  const Text('No certificates yet'),
                  const SizedBox(height: 8),
                  const Text('Complete courses to earn certificates'),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: _loadCertificates,
            child: GridView.builder(
              padding: const EdgeInsets.all(AppConstants.defaultPadding),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: AppConstants.defaultPadding,
                mainAxisSpacing: AppConstants.defaultPadding,
                childAspectRatio: 0.75,
              ),
              itemCount: certificates.length,
              itemBuilder: (context, index) {
                return _buildCertificateCard(certificates[index]);
              },
            ),
          );
        },
      ),
    );
  }

  Widget _buildCertificateCard(Map<String, dynamic> certificate) {
    return Card(
      child: InkWell(
        onTap: () {
          _showCertificateDialog(certificate);
        },
        child: Padding(
          padding: const EdgeInsets.all(AppConstants.defaultPadding),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.card_membership,
                size: 64,
                color: Theme.of(context).primaryColor,
              ),
              const SizedBox(height: 12),
              Text(
                certificate['courseName'] ?? 'Certificate',
                style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 8),
              Text(
                'Issued: ${_formatDate(certificate['issuedDate'])}',
                style: Theme.of(context).textTheme.bodySmall,
                textAlign: TextAlign.center,
              ),
              const Spacer(),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  IconButton(
                    icon: const Icon(Icons.share, size: 20),
                    onPressed: () => _shareCertificate(certificate),
                    tooltip: 'Share',
                  ),
                  IconButton(
                    icon: const Icon(Icons.download, size: 20),
                    onPressed: () => _downloadCertificate(certificate),
                    tooltip: 'Download',
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showCertificateDialog(Map<String, dynamic> certificate) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(certificate['courseName'] ?? 'Certificate'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Certificate Preview
            Container(
              width: double.infinity,
              height: 200,
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(AppConstants.borderRadius),
                border: Border.all(color: Colors.grey[300]!),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.card_membership,
                    size: 80,
                    color: Theme.of(context).primaryColor,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Certificate of Completion',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            _buildInfoRow('Course', certificate['courseName']),
            _buildInfoRow('Issued Date', _formatDate(certificate['issuedDate'])),
            _buildInfoRow('Certificate ID', certificate['id']),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
          ElevatedButton.icon(
            onPressed: () {
              Navigator.pop(context);
              _downloadCertificate(certificate);
            },
            icon: const Icon(Icons.download),
            label: const Text('Download'),
          ),
        ],
      ),
    );
  }

  /// Share certificate
  Future<void> _shareCertificate(Map<String, dynamic> certificate) async {
    try {
      final certificateId = certificate['id'] ?? certificate['certificateId'];
      if (certificateId == null) {
        throw Exception('Certificate ID not found');
      }

      // Copy certificate link to clipboard
      final link = 'https://tunisiaed.com/certificates/$certificateId';
      await Clipboard.setData(ClipboardData(text: link));

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Certificate link copied to clipboard!'),
          duration: Duration(seconds: 2),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to share certificate: ${e.toString()}'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  /// Download certificate
  Future<void> _downloadCertificate(Map<String, dynamic> certificate) async {
    try {
      final certificateId = certificate['id'] ?? certificate['certificateId'];
      if (certificateId == null) {
        throw Exception('Certificate ID not found');
      }

      // Show loading dialog
      if (!mounted) return;
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => const Center(
          child: CircularProgressIndicator(),
        ),
      );

      // Call certificate service to download
      final certificateService = CertificateService();
      await certificateService.downloadCertificate(certificateId);

      if (!mounted) return;
      Navigator.pop(context); // Close loading dialog

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Certificate downloaded successfully!'),
          duration: Duration(seconds: 2),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      if (!mounted) return;
      Navigator.pop(context); // Close loading dialog if still open

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to download certificate: ${e.toString()}'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Widget _buildInfoRow(String label, String? value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              '$label:',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(
            child: Text(value ?? 'N/A'),
          ),
        ],
      ),
    );
  }

  String _formatDate(dynamic date) {
    if (date == null) return 'N/A';
    if (date is String) {
      try {
        final dateTime = DateTime.parse(date);
        return Utils.formatDate(dateTime);
      } catch (e) {
        return date;
      }
    }
    return 'N/A';
  }
}
