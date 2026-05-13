import React, { useEffect } from 'react';
import { X, Check } from 'lucide-react';
import '../styles/profile.css';

const PLAN_DATA = [
  {
    id: 'starter',
    name: 'Starter',
    price: '₹299',
    period: '/month',
    credits: '5,000 Credits',
    features: [
      'Basic AI Generation',
      'Limited Regeneration',
      'Standard Support'
    ],
    buttonText: 'Choose Starter',
    featured: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹999',
    period: '/month',
    credits: '20,000 Credits',
    features: [
      'Unlimited AI Generation',
      'Faster Responses',
      'Advanced Hooks',
      'Priority Support'
    ],
    buttonText: 'Upgrade to Pro',
    featured: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '₹2999',
    period: '/month',
    credits: 'Unlimited Credits',
    features: [
      'Premium AI Engine',
      'Team Access',
      'Priority Processing',
      'Dedicated Support'
    ],
    buttonText: 'Contact Sales',
    featured: false
  }
];

const PlanModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBuy = (planName) => {
    alert(`Will redirect to payment gateway for ${planName} plan. Payment integration not connected yet.`);
  };

  return (
    <div className="plan-modal-overlay">
      <div className="plan-modal-backdrop" onClick={onClose} aria-hidden="true"></div>
      <div className="plan-modal-container dash-animate-in">
        <button className="plan-modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="plan-modal-header">
          <h2>Upgrade Your Plan</h2>
          <p>Choose the right plan to unleash your content creation potential.</p>
        </div>

        <div className="plan-modal-grid">
          {PLAN_DATA.map((plan) => (
            <div key={plan.id} className={`pricing-card ${plan.featured ? 'pricing-card-featured' : ''}`}>
              {plan.featured && <div className="pricing-badge">Most Popular</div>}
              
              <div className="pricing-header">
                <h3>{plan.name}</h3>
                <div className="pricing-price">
                  <span className="amount">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>
                <div className="pricing-credits">{plan.credits}</div>
              </div>

              <ul className="pricing-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <Check size={16} className="feature-icon" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                className={`pricing-btn ${plan.featured ? 'pricing-btn-primary' : 'pricing-btn-outline'}`}
                onClick={() => handleBuy(plan.name)}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanModal;
