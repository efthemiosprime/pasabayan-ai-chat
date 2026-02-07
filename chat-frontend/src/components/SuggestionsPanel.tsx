'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Lightbulb, HelpCircle, Truck, Package, User, MessageCircle, Settings, BarChart3, FlaskConical, CreditCard, CheckCircle } from 'lucide-react';

interface SuggestionCategory {
  name: string;
  icon: React.ReactNode;
  queries: string[];
}

const suggestionCategories: SuggestionCategory[] = [
  {
    name: 'About Pasabayan',
    icon: <HelpCircle className="w-4 h-4" />,
    queries: [
      'What is Pasabayan?',
      'How does Pasabayan work?',
      'Who founded Pasabayan?',
      'What are the platform fees?',
    ],
  },
  {
    name: 'How Matching Works',
    icon: <Lightbulb className="w-4 h-4" />,
    queries: [
      'How does matching work?',
      'What makes a trip compatible with my package?',
      'What do the match statuses mean?',
      'Who initiates a match - carrier or shipper?',
      'What happens after a match is confirmed?',
    ],
  },
  {
    name: 'Payment & Pricing',
    icon: <BarChart3 className="w-4 h-4" />,
    queries: [
      'How does payment work?',
      'What is escrow and how does it protect me?',
      'How much does the carrier get after fees?',
      'When does the carrier get paid?',
      'How much should I charge as a carrier?',
      'What\'s a fair price for my package?',
    ],
  },
  {
    name: 'Sending Packages',
    icon: <Package className="w-4 h-4" />,
    queries: [
      'How do I send a package?',
      'How do I find a carrier?',
      'How do I track my delivery?',
      'What is the delivery code?',
      'What items are prohibited?',
      'How can I save money on shipping?',
    ],
  },
  {
    name: 'Delivering Packages',
    icon: <Truck className="w-4 h-4" />,
    queries: [
      'How do I become a carrier?',
      'How do I create a trip?',
      'How do I find packages to deliver?',
      'How do I complete a delivery?',
      'Tips for getting more deliveries?',
      'How do I set up Stripe for payouts?',
    ],
  },
  {
    name: 'Safety & Trust',
    icon: <User className="w-4 h-4" />,
    queries: [
      'Is it safe to use Pasabayan?',
      'Where should I meet for pickup?',
      'How do I verify a carrier or shipper?',
      'What should I do if something feels wrong?',
      'What items are prohibited?',
      'How do I report a problem?',
    ],
  },
  {
    name: 'Cancellation & Refunds',
    icon: <Settings className="w-4 h-4" />,
    queries: [
      'How do I cancel a delivery?',
      'What\'s the cancellation policy?',
      'Will I get a refund if I cancel?',
      'What happens if the carrier cancels?',
      'What\'s the no-show policy?',
    ],
  },
  {
    name: 'Verification & Trust',
    icon: <User className="w-4 h-4" />,
    queries: [
      'What are the verification levels?',
      'How do I get verified?',
      'What does Premium verification unlock?',
      'Why can\'t I create a trip or package?',
    ],
  },
  {
    name: 'Ratings & Reviews',
    icon: <BarChart3 className="w-4 h-4" />,
    queries: [
      'How do ratings work?',
      'How do I get better ratings as a carrier?',
      'What happens if my rating drops?',
      'How do I dispute an unfair rating?',
      'How do I add a carrier to favorites?',
    ],
  },
  {
    name: 'Help & Support',
    icon: <MessageCircle className="w-4 h-4" />,
    queries: [
      'How do I contact human support?',
      'My payment failed, what do I do?',
      'The carrier isn\'t responding',
      'My delivery code isn\'t working',
      'I need to escalate my issue',
    ],
  },
];

// Developer-specific question categories
const developerCategories: SuggestionCategory[] = [
  {
    name: 'Trips API',
    icon: <Truck className="w-4 h-4" />,
    queries: [
      'What is the endpoint for listing trips?',
      'How do I create a trip via API?',
      'What fields are required to create a trip?',
      'How do I find compatible packages for a trip?',
    ],
  },
  {
    name: 'Packages API',
    icon: <Package className="w-4 h-4" />,
    queries: [
      'What is the endpoint for creating a package?',
      'What are the package_type enum values?',
      'How do I find compatible trips for a package?',
      'What fields are required for a package request?',
    ],
  },
  {
    name: 'Matches API',
    icon: <MessageCircle className="w-4 h-4" />,
    queries: [
      'What is the match status flow?',
      'How do I create a match via API?',
      'How does the delivery code verification work?',
      'What is the endpoint to complete a delivery?',
    ],
  },
  {
    name: 'Payments API',
    icon: <BarChart3 className="w-4 h-4" />,
    queries: [
      'How does the payment flow work?',
      'What is the transaction response format?',
      'How do I get transaction for a match?',
      'What are the payment status values?',
    ],
  },
  {
    name: 'Authentication',
    icon: <Settings className="w-4 h-4" />,
    queries: [
      'How does authentication work?',
      'What headers are required for API calls?',
      'How do I get a Sanctum token?',
      'What are the rate limits?',
    ],
  },
  {
    name: 'Error Handling',
    icon: <HelpCircle className="w-4 h-4" />,
    queries: [
      'What error codes can the API return?',
      'What does a 422 validation error look like?',
      'How do I handle rate limiting?',
      'What is the error response format?',
    ],
  },
];

// QA-specific question categories for payment testing
const qaCategories: SuggestionCategory[] = [
  {
    name: 'Payment Testing',
    icon: <CreditCard className="w-4 h-4" />,
    queries: [
      'What test cards can I use?',
      'How do I test a declined payment?',
      'How do I test 3D Secure authentication?',
      'What is the test bank account for payouts?',
    ],
  },
  {
    name: 'Auto-Charge Flow',
    icon: <BarChart3 className="w-4 h-4" />,
    queries: [
      'How does auto-charge work?',
      'What are the auto-charge confirmation sheet states?',
      'How do I test confirming without a saved card?',
      'Walk me through the auto-charge happy path',
    ],
  },
  {
    name: 'Carrier Payouts',
    icon: <Truck className="w-4 h-4" />,
    queries: [
      'How do I test Stripe Connect onboarding?',
      'What are the payout status states?',
      'What is the test bank account number?',
      'How do I test incomplete payout setup?',
    ],
  },
  {
    name: 'Shipper UI Testing',
    icon: <Package className="w-4 h-4" />,
    queries: [
      'Show me the shipper booking flow',
      'How does a shipper request a trip?',
      'What screens does a shipper see when confirming?',
      'What are the shipper view statuses?',
      'What should I verify after sending a request?',
    ],
  },
  {
    name: 'Carrier UI Testing',
    icon: <Truck className="w-4 h-4" />,
    queries: [
      'Show me the carrier delivery flow',
      'How does a carrier accept a request?',
      'What is the screen path for making an offer?',
      'What are the carrier view statuses?',
      'How do I test pickup and delivery?',
    ],
  },
  {
    name: 'Counter-Offers',
    icon: <MessageCircle className="w-4 h-4" />,
    queries: [
      'How does the counter-offer flow work?',
      'Show me the counter-offer negotiation example',
      'How do I test shipper responding to counter-offer?',
      'What screens are involved in counter-offers?',
    ],
  },
  {
    name: 'Match Status Testing',
    icon: <Lightbulb className="w-4 h-4" />,
    queries: [
      'Show me the match status lifecycle diagram',
      'What are all the match statuses?',
      'What are the valid status transitions?',
      'What are the invalid transition tests?',
      'Show me the cancellation test scenarios',
    ],
  },
  {
    name: 'All Status Reference',
    icon: <BarChart3 className="w-4 h-4" />,
    queries: [
      'Show me all package request statuses',
      'Show me all trip statuses',
      'Show me all payment statuses',
      'Show me all user profile statuses',
      'Show me all vehicle statuses',
      'Show me verification code reference',
    ],
  },
  {
    name: 'UI Test Scenarios',
    icon: <CheckCircle className="w-4 h-4" />,
    queries: [
      'Show me the shipper happy path test',
      'Show me the carrier accepts request test',
      'How do I test the complete delivery flow?',
      'Show me the cancellation flow test',
      'What are the UI test prerequisites?',
    ],
  },
  {
    name: 'Navigation Reference',
    icon: <Settings className="w-4 h-4" />,
    queries: [
      'Show me the quick navigation reference',
      'What is the path to request a booking?',
      'What is the path to make a counter-offer?',
      'How do I navigate to mark pickup?',
    ],
  },
  {
    name: 'Minimum Price',
    icon: <FlaskConical className="w-4 h-4" />,
    queries: [
      'What is the minimum delivery price?',
      'Where does the minimum price apply?',
      'How do I test minimum price validation?',
      'What error shows for price below minimum?',
    ],
  },
  {
    name: 'Debug & Logs',
    icon: <CheckCircle className="w-4 h-4" />,
    queries: [
      'What logs should I check in Xcode?',
      'How do I verify test vs live mode?',
      'Show me the QA sign-off checklist',
      'What Stripe config logs should I see?',
    ],
  },
  {
    name: 'Common Issues',
    icon: <HelpCircle className="w-4 h-4" />,
    queries: [
      'Show me common issues and solutions',
      'Why is Request to Book not showing?',
      'Why is the pickup code rejected?',
      'What are the test prerequisites?',
    ],
  },
];

interface SuggestionsPanelProps {
  onSelectQuery: (query: string) => void;
  isAdmin?: boolean;
  isDeveloper?: boolean;
  isQA?: boolean;
}

export function SuggestionsPanel({ onSelectQuery, isAdmin, isDeveloper, isQA }: SuggestionsPanelProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const toggleCategory = (name: string) => {
    setExpandedCategory(expandedCategory === name ? null : name);
  };

  // Select categories based on mode
  const categories = isDeveloper
    ? developerCategories
    : isQA
    ? qaCategories
    : suggestionCategories;

  // Quick suggestions shown at the top
  const quickSuggestions = isDeveloper
    ? [
        'What is the endpoint for listing trips?',
        'How do I create a match via API?',
        'What is the match status flow?',
        'How does authentication work?',
      ]
    : isQA
    ? [
        'What test cards can I use?',
        'Show me the match status lifecycle',
        'Walk me through the shipper booking flow',
        'Show me the QA sign-off checklist',
      ]
    : isAdmin
    ? [
        'Show platform statistics',
        'Find user by email',
        'Show active deliveries',
        'What are the popular routes?',
      ]
    : [
        'How does matching work?',
        'How does payment work?',
        'Is it safe to use Pasabayan?',
        'Show my deliveries',
      ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
        <span className="text-3xl">{isDeveloper ? '🛠️' : isQA ? '🧪' : '🚚'}</span>
      </div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        {isDeveloper ? 'Pasabayan Developer Assistant' : isQA ? 'Pasabayan QA Assistant' : 'Welcome to Pasabayan Assistant'}
      </h2>
      <p className="text-gray-500 mb-6 max-w-md">
        {isDeveloper
          ? 'Developer mode. Ask about API endpoints, request/response formats, and integration.'
          : isQA
          ? 'QA mode. Ask about payment testing, test cards, test scenarios, and the QA checklist.'
          : isAdmin
          ? 'You have admin access. Ask about users, matches, transactions, or platform stats.'
          : 'I can help you with trips, packages, deliveries, and more. Try asking:'}
      </p>

      {/* Quick Suggestions */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {quickSuggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSelectQuery(suggestion)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Browse All Button */}
      <button
        onClick={() => setShowAll(!showAll)}
        className="text-sm text-primary-600 hover:text-primary-700 mb-4 flex items-center gap-1"
      >
        {showAll ? 'Hide' : 'Browse all questions'}
        <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
      </button>

      {/* Category List */}
      {showAll && (
        <div className="w-full max-w-lg bg-white rounded-xl border border-gray-200 shadow-sm max-h-[50vh] overflow-y-auto text-left">
          {categories.map((category) => (
            <div key={category.name} className="border-b border-gray-100 last:border-0">
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  {category.icon}
                  {category.name}
                </span>
                {expandedCategory === category.name ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {expandedCategory === category.name && (
                <div className="px-4 pb-3 space-y-1">
                  {category.queries.map((query) => (
                    <button
                      key={query}
                      onClick={() => onSelectQuery(query)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
