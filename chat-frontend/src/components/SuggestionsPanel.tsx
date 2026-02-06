'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Lightbulb, HelpCircle, Truck, Package, User, MessageCircle, Settings, BarChart3 } from 'lucide-react';

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
    name: 'Getting Started',
    icon: <Lightbulb className="w-4 h-4" />,
    queries: [
      'How do I sign up?',
      'How do I verify my phone?',
      'How do I complete my profile?',
      'How do I get verified?',
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
      'How do I pay for a delivery?',
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
      'How do I get paid?',
      'How much is the platform fee?',
    ],
  },
  {
    name: 'Communication',
    icon: <MessageCircle className="w-4 h-4" />,
    queries: [
      'How do I message my carrier?',
      'How do I add a carrier to favorites?',
      'How do I rate a carrier?',
      'How do I report a problem?',
    ],
  },
  {
    name: 'Account & Settings',
    icon: <Settings className="w-4 h-4" />,
    queries: [
      'How do I edit my profile?',
      'How do I update my payment method?',
      'How do I turn off notifications?',
      'Where can I see my receipts?',
      'How do I delete my account?',
    ],
  },
  {
    name: 'Troubleshooting',
    icon: <User className="w-4 h-4" />,
    queries: [
      'What if my package is damaged?',
      'What if the carrier doesn\'t show up?',
      'Why can\'t I see the carrier\'s location?',
      'How do I cancel a delivery?',
      'Can I get a refund?',
    ],
  },
  {
    name: 'Data & Stats',
    icon: <BarChart3 className="w-4 h-4" />,
    queries: [
      'Show me available trips',
      'Show available packages',
      'Show my deliveries',
      'Show platform statistics',
      'What are the popular routes?',
    ],
  },
];

interface SuggestionsPanelProps {
  onSelectQuery: (query: string) => void;
  isAdmin?: boolean;
}

export function SuggestionsPanel({ onSelectQuery, isAdmin }: SuggestionsPanelProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const toggleCategory = (name: string) => {
    setExpandedCategory(expandedCategory === name ? null : name);
  };

  // Quick suggestions shown at the top
  const quickSuggestions = isAdmin
    ? [
        'Show platform statistics',
        'Find user by email',
        'Show active deliveries',
        'What are the popular routes?',
      ]
    : [
        'How does Pasabayan work?',
        'How do I send a package?',
        'How do I track my delivery?',
        'Show available trips',
      ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
        <span className="text-3xl">🚚</span>
      </div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        Welcome to Pasabayan Assistant
      </h2>
      <p className="text-gray-500 mb-6 max-w-md">
        {isAdmin
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
        <div className="w-full max-w-lg bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-left">
          {suggestionCategories.map((category) => (
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
