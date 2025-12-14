// Subscription controller for public subscription plan endpoints
import { adminService } from '../../Admin/service/Admin.service.js';

export class SubscriptionController {
  /**
   * Get all subscription plans (PUBLIC - anyone can view)
   * Returns only active plans sorted by price
   */
  async getSubscriptionPlans(req, res) {
    try {
      // Use service layer which includes business logic
      const allPlans = await adminService.getSubscriptionPlansPublic();
      
      res.status(200).json(allPlans);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      res.status(500).json({ error: 'Failed to fetch subscription plans' });
    }
  }

  /**
   * Get a specific subscription plan by ID (PUBLIC)
   */
  async getSubscriptionPlanById(req, res) {
    try {
      const { planId } = req.params;
      const plan = await adminService.getSubscriptionPlanByIdPublic(planId);
      
      if (!plan) {
        return res.status(404).json({ error: 'Subscription plan not found' });
      }
      
      res.status(200).json(plan);
    } catch (error) {
      console.error('Error fetching subscription plan:', error);
      res.status(500).json({ error: 'Failed to fetch subscription plan' });
    }
  }
}

export const subscriptionController = new SubscriptionController();
