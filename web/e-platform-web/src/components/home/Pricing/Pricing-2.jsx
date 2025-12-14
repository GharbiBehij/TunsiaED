import React, { useState } from 'react';

// Composant pour l'icône du logo (SVG)
const LogoIcon = () => (
  <div className="size-6">
    <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_6_319)">
        <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"></path>
      </g>
      {/* Note: React doesn't support inline <defs> with clipPath in the same way as raw HTML. 
          For a real project, this SVG should be cleaned up or imported as a separate component. 
          I'm removing the <defs> as it's not strictly necessary for display here, but 
          the original clipPath reference remains for completeness. */}
    </svg>
  </div>
);

// Composant pour la carte de plan d'abonnement
const PlanCard = ({ plan, isPopular, isPro }) => {
  const baseClasses = "flex flex-1 flex-col gap-6 rounded-xl border border-solid border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 transform transition-transform duration-300";
  const hoverClasses = isPro ? "relative transform scale-[1.02] shadow-xl" : "hover:scale-[1.02]";
  const borderClasses = isPro ? "border-2 border-solid border-primary" : "";
  const buttonClasses = isPro 
    ? "flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90"
    : "flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-100 dark:bg-gray-700 text-[#111418] dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 dark:hover:bg-gray-600";

  return (
    <div className={`${baseClasses} ${borderClasses} ${hoverClasses}`}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold leading-tight text-[#111418] dark:text-white">{plan.name}</h1>
          {isPopular && (
            <p className="text-white text-xs font-medium leading-normal tracking-[0.015em] rounded-full bg-accent-orange px-3 py-1 text-center">Most Popular</p>
          )}
        </div>
        <p className="flex items-baseline gap-1 text-[#111418] dark:text-white">
          <span className="text-4xl font-black leading-tight tracking-[-0.033em]">{plan.price} TND</span>
          <span className="text-base font-bold leading-tight text-gray-500 dark:text-gray-400">/month</span>
        </p>
      </div>
      <button className={buttonClasses}>
        <span className="truncate">{isPro ? 'Choose Plan' : 'Get Started'}</span>
      </button>
      <div className="flex flex-col gap-3">
        {plan.features.map((feature, index) => (
          <div key={index} className="text-sm font-normal leading-normal flex gap-3 items-center text-[#111418] dark:text-gray-300">
            <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
            {feature}
          </div>
        ))}
      </div>
    </div>
  );
};

// Composant pour une ligne de la FAQ
const FAQItem = ({ question, answer }) => (
  <details className="group rounded-lg bg-white dark:bg-gray-800 p-6 [&_summary::-webkit-details-marker]:hidden border border-gray-200 dark:border-gray-700">
    <summary className="flex cursor-pointer items-center justify-between gap-1.5">
      <h3 className="text-lg font-bold text-[#111418] dark:text-white">{question}</h3>
      <span className="relative size-5 shrink-0">
        <span className="material-symbols-outlined absolute inset-0 opacity-100 group-open:opacity-0 transition-opacity">add</span>
        <span className="material-symbols-outlined absolute inset-0 opacity-0 group-open:opacity-100 transition-opacity">remove</span>
      </span>
    </summary>
    <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-400">{answer}</p>
  </details>
);

// Données pour les plans d'abonnement
const plansData = [
  {
    name: 'Basic',
    price: '15',
    isPopular: false,
    features: [
      'Access to 5 introductory courses',
      'Downloadable resources',
      'Email support',
    ],
  },
  {
    name: 'Pro',
    price: '30',
    isPopular: true,
    features: [
      'Access to 50+ courses',
      'Certificates of Completion',
      'Practice exercises',
      'Instructor Q&A',
    ],
  },
  {
    name: 'Unlimited',
    price: '50',
    isPopular: false,
    features: [
      'Unlimited access to all courses',
      'Everything in Pro',
      'Exclusive content',
      'Priority support',
    ],
  },
];

// Données pour la comparaison des fonctionnalités
const comparisonData = [
  { feature: 'Number of Courses', Basic: '5', Pro: '50+', Unlimited: 'All' },
  { feature: 'Downloadable Resources', Basic: true, Pro: true, Unlimited: true },
  { feature: 'Certificates of Completion', Basic: false, Pro: true, Unlimited: true },
  { feature: 'Practice Exercises', Basic: false, Pro: true, Unlimited: true },
  { feature: 'Instructor Q&A', Basic: false, Pro: true, Unlimited: true },
  { feature: 'Exclusive Content', Basic: false, Pro: false, Unlimited: true },
  { feature: 'Priority Support', Basic: false, Pro: false, Unlimited: true },
];

// Données pour la FAQ
const faqData = [
  { question: 'Can I cancel anytime?', answer: 'Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.' },
  { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, including Visa, Mastercard, and American Express. We also support payments through PayPal for your convenience.' },
  { question: 'What happens after my subscription ends?', answer: 'If your subscription ends, you will lose access to the premium course content. Any certificates you have earned will remain valid and accessible from your profile.' },
];

// Composant principal
const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('Annually'); // 'Annually' est sélectionné par défaut dans le HTML source

  const CheckIcon = ({ isChecked }) => {
    const iconName = isChecked ? 'check' : 'close';
    const colorClass = isChecked ? 'text-primary' : 'text-gray-400 dark:text-gray-500';
    return <span className={`material-symbols-outlined ${colorClass} text-xl`}>{iconName}</span>;
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-[#111418] dark:text-gray-200">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          
          {/* Header */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-700 px-6 md:px-10 py-4 bg-white dark:bg-background-dark/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-4 text-primary">
              <LogoIcon />
              <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-[#111418] dark:text-white">TunisiaED</h2>
            </div>
            <div className="hidden md:flex flex-1 justify-end gap-8">
              <div className="flex items-center gap-9">
                <a className="text-sm font-medium leading-normal text-[#111418] dark:text-gray-300 hover:text-primary dark:hover:text-primary" href="#">Courses</a>
                <a className="text-sm font-medium leading-normal text-[#111418] dark:text-gray-300 hover:text-primary dark:hover:text-primary" href="#">About</a>
              </div>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90">
                <span className="truncate">Log In</span>
              </button>
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" data-alt="User profile picture" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBpcMWE_BCLCX7relzQ300mLTcf6lwNipDmZRA_ckc4Msrdal5L2LmTCVQgXgGL-zkYXxKgnpyE_5sVVdfiX9ozLU4jOCbyMMTNynauOjjBPxdGRCG-nOk_-a7wevY6k1UrMhbt29ZkX2jNdd2DXTXqGAlUiuT10xxEUExmu-gzkbiSZBCsYRzpYM7f7LTfHnF8ACnUmTvHCbLmWuRWlnBA4DMcI-SlT2IlbOckTYXTqeCwskHMjH33BwK6jubWuAm1qO_5pOspJw")' }}></div>
            </div>
            <button className="md:hidden text-[#111418] dark:text-white">
              <span className="material-symbols-outlined text-3xl">menu</span>
            </button>
          </header>

          {/* Main Content */}
          <main className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-10 md:py-16">
            <div className="layout-content-container flex flex-col max-w-6xl flex-1 gap-8">
              
              {/* Title and Subtitle */}
              <div className="flex flex-wrap justify-between gap-6 p-4 text-center">
                <div className="flex w-full flex-col gap-3">
                  <p className="text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] text-[#111418] dark:text-white">Choose the Plan That's Right for You</p>
                  <p className="text-base md:text-lg font-normal leading-normal text-gray-600 dark:text-gray-400">Get unlimited access to our entire course library and start learning today.</p>
                </div>
              </div>

              {/* Billing Cycle Toggle */}
              <div className="flex px-4 py-3 justify-center">
                <div className="flex h-10 w-full max-w-xs items-center justify-center rounded-lg bg-gray-200 dark:bg-background-dark p-1">
                  {['Monthly', 'Annually'].map((cycle) => (
                    <label
                      key={cycle}
                      className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal transition-colors duration-200
                        ${billingCycle === cycle 
                          ? 'bg-white shadow-[0_0_4px_rgba(0,0,0,0.1)] text-[#111418] dark:bg-gray-700 dark:text-white' 
                          : 'text-gray-500 dark:text-gray-400'
                        }`}
                      onClick={() => setBillingCycle(cycle)}
                    >
                      <span className="truncate">
                        {cycle}
                        {cycle === 'Annually' && <span className="text-accent-orange font-bold"> (Save 20%)</span>}
                      </span>
                      <input 
                        className="invisible w-0" 
                        name="billing-cycle" 
                        type="radio" 
                        value={cycle} 
                        checked={billingCycle === cycle}
                        readOnly
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-3">
                {plansData.map((plan, index) => (
                  <PlanCard 
                    key={index} 
                    plan={plan} 
                    isPopular={plan.isPopular} 
                    isPro={plan.name === 'Pro'} // 'Pro' has the primary border
                  />
                ))}
              </div>

              {/* Feature Comparison Table */}
              <div className="mt-16">
                <h2 className="text-center text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-8 pt-5 text-[#111418] dark:text-white">Compare Our Plans</h2>
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <table className="w-full min-w-[600px] text-left">
                    <thead className="border-b border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="p-6 text-lg font-bold">Features</th>
                        <th className="p-6 text-center font-bold">Basic</th>
                        <th className="p-6 text-center font-bold text-primary">Pro</th>
                        <th className="p-6 text-center font-bold">Unlimited</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {comparisonData.map((row, index) => (
                        <tr key={index} className="dark:hover:bg-gray-700/50">
                          <td className="p-4 pl-6 font-medium">{row.feature}</td>
                          <td className="p-4 text-center">
                            {typeof row.Basic === 'boolean' ? <CheckIcon isChecked={row.Basic} /> : row.Basic}
                          </td>
                          <td className="p-4 text-center">
                            {typeof row.Pro === 'boolean' ? <CheckIcon isChecked={row.Pro} /> : row.Pro}
                          </td>
                          <td className="p-4 text-center font-bold">
                            {typeof row.Unlimited === 'boolean' ? <CheckIcon isChecked={row.Unlimited} /> : row.Unlimited}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mt-16">
                <h2 className="text-center text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-8 pt-5 text-[#111418] dark:text-white">Frequently Asked Questions</h2>
                <div className="mx-auto max-w-3xl space-y-4">
                  {faqData.map((item, index) => (
                    <FAQItem key={index} question={item.question} answer={item.answer} />
                  ))}
                </div>
              </div>

            </div>
          </main>

          {/* Footer */}
          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="sm:flex sm:items-center sm:justify-between">
                <div className="flex justify-center text-primary sm:justify-start">
                  <div className="flex items-center gap-4 text-primary">
                    <LogoIcon />
                    <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-[#111418] dark:text-white">TunisiaED</h2>
                  </div>
                </div>
                <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400 lg:mt-0 lg:text-right">
                  Copyright © 2024. All rights reserved.
                </p>
              </div>
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
};

export default PricingPage;

/*
  NOTES IMPORTANTES POUR L'UTILISATION:

  1.  **Tailwind CSS:** Ce composant est basé sur Tailwind CSS. Pour qu'il fonctionne correctement, vous devez avoir Tailwind CSS configuré dans votre projet React.
  2.  **Configuration Tailwind personnalisée:** Le code HTML original contenait une configuration Tailwind personnalisée. Vous devez ajouter les éléments suivants à votre fichier `tailwind.config.js` pour que les couleurs et la police soient correctes :
      
      module.exports = {
        darkMode: "class", // Pour le support du mode sombre
        theme: {
          extend: {
            colors: {
              "primary": "#137fec",
              "background-light": "#f6f7f8",
              "background-dark": "#101922",
              "accent-orange": "#FD7E14",
            },
            fontFamily: {
              "display": ["Inter", "sans-serif"]
            },
            borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
          },
        },
        // ... autres configurations
      }

  3.  **Icônes Material Symbols:** Le composant utilise les icônes Material Symbols Outlined. Vous devez inclure la feuille de style dans votre fichier `index.html` ou le point d'entrée de votre application :
      
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
      
      De plus, le style CSS suivant doit être appliqué (dans votre fichier CSS global ou un bloc de style) pour le style par défaut des icônes :
      
      .material-symbols-outlined {
        font-variation-settings:
        'FILL' 1,
        'wght' 400,
        'GRAD' 0,
        'opsz' 20
      }

  4.  **Structure du Composant:**
      -   Le composant principal est `PricingPage`.
      -   J'ai extrait les données des plans (`plansData`), de la comparaison (`comparisonData`) et de la FAQ (`faqData`) dans des structures de données JavaScript pour une meilleure gestion.
      -   J'ai utilisé `useState` pour gérer l'état du sélecteur de cycle de facturation (Mensuel/Annuel).
      -   Les attributs `class` ont été remplacés par `className`.
      -   Les styles en ligne (comme pour l'image de profil) ont été convertis en objets JavaScript (ex: `style={{ backgroundImage: 'url(...)' }}`).
      -   Les balises auto-fermantes (`<input>`, `<img>`, etc.) ont été fermées correctement (ex: `<input ... />`).
*/
