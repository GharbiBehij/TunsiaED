// Seed subscription plans into Firestore
import { db } from '../config/firebase.js';
//modified by the admin 
const SUBSCRIPTION_PLANS = [
  {
    id: 'free-plan',
    name: 'Free',
    description: 'For casual learners',
    price: 0,
    originalPrice: null,
    discount: null,
    billingCycle: 'month',
    features: [
      'Access to select free courses',
      'Community forum access',
      'Basic progress tracking',
    ],
    isActive: true,
    isPopular: false,
    badge: null,
    ctaText: 'Current Plan',
    trialDays: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'pro-plan',
    name: 'Pro',
    description: 'For serious learners & professionals',
    price: 29,
    originalPrice: 39,
    discount: 26,
    billingCycle: 'month',
    features: [
      'Access to all courses',
      'Downloadable resources',
      'Instructor Q&A sessions',
      'Course completion certificates',
      'Priority support',
      'Offline viewing',
    ],
    isActive: true,
    isPopular: true,
    featured: true,
    badge: 'MOST POPULAR',
    ctaText: 'Start Learning',
    trialDays: 7,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'premium-plan',
    name: 'Premium',
    description: 'For teams & organizations',
    price: 99,
    originalPrice: null,
    discount: null,
    billingCycle: 'month',
    features: [
      'Everything in Pro',
      'Team management dashboard',
      'Usage analytics & reports',
      'Dedicated account manager',
      'Custom learning paths',
      'API access',
      'Bulk enrollment',
    ],
    isActive: true,
    isPopular: false,
    badge: 'ENTERPRISE',
    ctaText: 'Contact Sales',
    trialDays: 14,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function seedSubscriptionPlans() {
  console.log('🌱 Seeding subscription plans...');
  
  try {
    const plansCollection = db.collection('SubscriptionPlans');
    
    for (const plan of SUBSCRIPTION_PLANS) {
      const planRef = plansCollection.doc(plan.id);
      const doc = await planRef.get();
      
      if (!doc.exists) {
        await planRef.set(plan);
        console.log(`✅ Created subscription plan: ${plan.name}`);
      } else {
        console.log(`⏭️  Subscription plan already exists: ${plan.name}`);
      }
    }
    
    console.log('✅ Subscription plans seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding subscription plans:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedSubscriptionPlans()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
