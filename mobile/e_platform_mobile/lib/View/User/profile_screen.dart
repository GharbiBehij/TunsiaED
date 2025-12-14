import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../ViewModel/User/user_viewmodel.dart';
import '../../ViewModel/Auth/auth_viewmodel.dart';
import '../../core/utils/constants.dart';
import '../../core/utils/utils.dart';

/// Profile Screen
/// User profile management
class ProfileScreen extends StatefulWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _birthPlaceController = TextEditingController();
  final _bioController = TextEditingController();
  String? _selectedLevel;
  DateTime? _selectedBirthDate;
  bool _isEditing = false;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _birthPlaceController.dispose();
    _bioController.dispose();
    super.dispose();
  }

  Future<void> _loadProfile() async {
    final userViewModel = Provider.of<UserViewModel>(context, listen: false);
    
    await userViewModel.fetchMyProfile();
    
    if (!mounted) return;
    
    final profile = userViewModel.currentUserProfile;
    if (profile != null) {
      setState(() {
        _nameController.text = profile['name'] ?? '';
        _emailController.text = profile['email'] ?? '';
        _phoneController.text = profile['phone'] ?? '';
        _birthPlaceController.text = profile['birthPlace'] ?? '';
        _bioController.text = profile['bio'] ?? '';
        _selectedLevel = profile['level'];
        if (profile['birthDate'] != null) {
          try {
            _selectedBirthDate = DateTime.parse(profile['birthDate']);
          } catch (e) {
            _selectedBirthDate = null;
          }
        }
      });
    }
  }

  Future<void> _handleUpdateProfile() async {
    if (!_formKey.currentState!.validate()) return;

    final userViewModel = Provider.of<UserViewModel>(context, listen: false);

    final updateData = {
      'name': _nameController.text.trim(),
      'phone': _phoneController.text.trim(),
      'birthPlace': _birthPlaceController.text.trim(),
      'bio': _bioController.text.trim(),
    };

    if (_selectedLevel != null && _selectedLevel!.isNotEmpty) {
      updateData['level'] = _selectedLevel!;
    }

    if (_selectedBirthDate != null) {
      updateData['birthDate'] = _selectedBirthDate!.toIso8601String();
    }

    final success = await userViewModel.updateMyProfile(updateData);

    if (!mounted) return;

    if (success) {
      // Refresh profile data after successful update
      await _loadProfile();
      Utils.showMessage(context, 'Profile updated successfully');
      setState(() => _isEditing = false);
    } else {
      Utils.showMessage(
        context,
        userViewModel.error ?? 'Failed to update profile',
        isError: true,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          if (!_isEditing)
            IconButton(
              icon: const Icon(Icons.edit),
              onPressed: () {
                setState(() => _isEditing = true);
              },
            ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadProfile,
            tooltip: 'Refresh Profile',
          ),
        ],
      ),
      body: Consumer2<UserViewModel, AuthViewModel>(
        builder: (context, userViewModel, authViewModel, _) {
          if (userViewModel.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          final profile = userViewModel.currentUserProfile;
          final user = authViewModel.currentUser;

          return RefreshIndicator(
            onRefresh: _loadProfile,
            child: SingleChildScrollView(
            padding: const EdgeInsets.all(AppConstants.defaultPadding),
            child: Form(
              key: _formKey,
              child: Column(
                children: [
                  // Profile Picture
                  CircleAvatar(
                    radius: 60,
                    backgroundColor: Theme.of(context).primaryColor,
                    child: Text(
                      Utils.getInitials(_nameController.text.isNotEmpty
                          ? _nameController.text
                          : user?.email ?? 'User'),
                      style: const TextStyle(
                        fontSize: 32,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  const SizedBox(height: AppConstants.largePadding),

                  // Name Field
                  TextFormField(
                    controller: _nameController,
                    decoration: const InputDecoration(
                      labelText: 'Full Name',
                      prefixIcon: Icon(Icons.person_outline),
                    ),
                    enabled: _isEditing,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your name';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: AppConstants.defaultPadding),

                  // Email Field
                  TextFormField(
                    controller: _emailController,
                    decoration: const InputDecoration(
                      labelText: 'Email',
                      prefixIcon: Icon(Icons.email_outlined),
                    ),
                    enabled: false, // Email cannot be changed easily
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your email';
                      }
                      if (!Utils.isValidEmail(value)) {
                        return 'Please enter a valid email';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: AppConstants.defaultPadding),

                  // Phone Field
                  TextFormField(
                    controller: _phoneController,
                    decoration: const InputDecoration(
                      labelText: 'Phone Number',
                      prefixIcon: Icon(Icons.phone_outlined),
                    ),
                    enabled: _isEditing,
                    keyboardType: TextInputType.phone,
                  ),
                  const SizedBox(height: AppConstants.defaultPadding),

                  // Birth Place Field
                  TextFormField(
                    controller: _birthPlaceController,
                    decoration: const InputDecoration(
                      labelText: 'Place of Birth',
                      prefixIcon: Icon(Icons.location_on_outlined),
                    ),
                    enabled: _isEditing,
                  ),
                  const SizedBox(height: AppConstants.defaultPadding),

                  // Birth Date Field
                  InkWell(
                    onTap: _isEditing ? () async {
                      final date = await showDatePicker(
                        context: context,
                        initialDate: _selectedBirthDate ?? DateTime(2000),
                        firstDate: DateTime(1950),
                        lastDate: DateTime.now(),
                      );
                      if (date != null) {
                        setState(() => _selectedBirthDate = date);
                      }
                    } : null,
                    child: InputDecorator(
                      decoration: const InputDecoration(
                        labelText: 'Birth Date',
                        prefixIcon: Icon(Icons.calendar_today_outlined),
                      ),
                      child: Text(
                        _selectedBirthDate != null
                            ? Utils.formatDate(_selectedBirthDate!)
                            : 'Not set',
                        style: TextStyle(
                          color: _selectedBirthDate != null
                              ? Theme.of(context).textTheme.bodyLarge?.color
                              : Theme.of(context).hintColor,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: AppConstants.defaultPadding),

                  // Learning Level Field
                  DropdownButtonFormField<String>(
                    value: _selectedLevel,
                    decoration: const InputDecoration(
                      labelText: 'Learning Level',
                      prefixIcon: Icon(Icons.school_outlined),
                    ),
                    items: const [
                      DropdownMenuItem(value: 'beginner', child: Text('Beginner')),
                      DropdownMenuItem(value: 'intermediate', child: Text('Intermediate')),
                      DropdownMenuItem(value: 'advanced', child: Text('Advanced')),
                    ],
                    onChanged: _isEditing ? (value) {
                      setState(() => _selectedLevel = value);
                    } : null,
                  ),
                  const SizedBox(height: AppConstants.defaultPadding),

                  // Bio Field
                  TextFormField(
                    controller: _bioController,
                    decoration: InputDecoration(
                      labelText: 'Bio',
                      prefixIcon: const Icon(Icons.person_outline),
                      hintText: 'Tell us about yourself (max 500 characters)',
                      counterText: _isEditing ? '${_bioController.text.length}/500' : null,
                    ),
                    enabled: _isEditing,
                    maxLines: 4,
                    maxLength: 500,
                    keyboardType: TextInputType.multiline,
                    textCapitalization: TextCapitalization.sentences,
                    onChanged: (value) {
                      if (_isEditing) setState(() {});
                    },
                  ),
                  const SizedBox(height: AppConstants.defaultPadding),

                  // Role Display
                  ListTile(
                    leading: const Icon(Icons.badge_outlined),
                    title: const Text('Role'),
                    subtitle: Text(
                      profile?['role']?.toString().toUpperCase() ?? 
                      authViewModel.userRole?.toUpperCase() ?? 
                      'Unknown',
                      style: TextStyle(
                        color: Theme.of(context).primaryColor,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  
                  // Account Created Display
                  if (profile?['createdAt'] != null)
                    ListTile(
                      leading: const Icon(Icons.access_time_outlined),
                      title: const Text('Member Since'),
                      subtitle: Text(
                        Utils.formatDate(DateTime.parse(profile!['createdAt'])),
                        style: const TextStyle(fontSize: 14),
                      ),
                    ),
                  const SizedBox(height: AppConstants.largePadding),

                  // Action Buttons
                  if (_isEditing) ...[
                    ElevatedButton(
                      onPressed: userViewModel.isLoading
                          ? null
                          : _handleUpdateProfile,
                      child: userViewModel.isLoading
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Text('Save Changes'),
                    ),
                    const SizedBox(height: AppConstants.smallPadding),
                    TextButton(
                      onPressed: () {
                        setState(() {
                          _isEditing = false;
                          _loadProfile();
                        });
                      },
                      child: const Text('Cancel'),
                    ),
                  ],

                  const SizedBox(height: AppConstants.largePadding),

                  // Change Password Button
                  OutlinedButton.icon(
                    onPressed: () {
                      Navigator.pushNamed(context, '/change-password');
                    },
                    icon: const Icon(Icons.lock_outline),
                    label: const Text('Change Password'),
                  ),
                ],
              ),
            ),
            ),
          );
        },
      ),
    );
  }
}
