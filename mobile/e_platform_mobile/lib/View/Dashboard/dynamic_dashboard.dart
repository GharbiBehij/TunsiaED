/// Dynamic Dashboard Widget
/// Renders dashboard based on role configuration
/// Following the web's DynamicDashboard pattern
import 'package:flutter/material.dart';
import '../../core/config/dashboard_config.dart';
import '../../core/utils/constants.dart';

class DynamicDashboard extends StatelessWidget {
  final String role;
  final Map<String, dynamic>? dashboardData;
  final bool isLoading;
  final String? error;
  final VoidCallback? onRetry;

  const DynamicDashboard({
    Key? key,
    required this.role,
    this.dashboardData,
    this.isLoading = false,
    this.error,
    this.onRetry,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final config = DashboardConfigRegistry.getConfig(role);

    if (config == null) {
      return Center(
        child: Text('Dashboard configuration not found for role: $role'),
      );
    }

    if (isLoading && dashboardData == null) {
      return const Center(child: CircularProgressIndicator());
    }

    if (error != null && dashboardData == null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(error!),
            const SizedBox(height: 16),
            if (onRetry != null)
              ElevatedButton(
                onPressed: onRetry,
                child: const Text('Retry'),
              ),
          ],
        ),
      );
    }

    // Map dashboard data to widget props
    final widgetProps = config.propsMap(dashboardData);

    return ListView(
      padding: const EdgeInsets.all(AppConstants.defaultPadding),
      children: config.sections.map((section) {
        return _buildSection(section, widgetProps);
      }).toList(),
    );
  }

  Widget _buildSection(
      DashboardSection section, Map<String, dynamic> widgetProps) {
    if (section.type == SectionType.single && section.widgetId != null) {
      return Padding(
        padding: section.padding ?? EdgeInsets.zero,
        child: WidgetRegistry.getWidget(
              section.widgetId!,
              widgetProps[section.widgetId],
            ) ??
            Container(),
      );
    }

    if (section.type == SectionType.grid && section.children != null) {
      return Padding(
        padding: section.padding ?? EdgeInsets.zero,
        child: GridView.count(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: section.crossAxisCount ?? 2,
          crossAxisSpacing: AppConstants.defaultPadding,
          mainAxisSpacing: AppConstants.defaultPadding,
          childAspectRatio: section.childAspectRatio ?? 1.0,
          children: section.children!.map((child) {
            if (child.widgetId != null) {
              return WidgetRegistry.getWidget(
                    child.widgetId!,
                    widgetProps[child.widgetId],
                  ) ??
                  Container();
            }
            return Container();
          }).toList(),
        ),
      );
    }

    if (section.type == SectionType.list && section.children != null) {
      return Padding(
        padding: section.padding ?? EdgeInsets.zero,
        child: Column(
          children: section.children!.map((child) {
            if (child.widgetId != null) {
              return Padding(
                padding: const EdgeInsets.only(bottom: AppConstants.defaultPadding),
                child: WidgetRegistry.getWidget(
                      child.widgetId!,
                      widgetProps[child.widgetId],
                    ) ??
                    Container(),
              );
            }
            return Container();
          }).toList(),
        ),
      );
    }

    return Container();
  }
}
