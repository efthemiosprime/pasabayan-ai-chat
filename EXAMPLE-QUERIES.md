# Pasabayan AI Chat - Example Queries

Use these example questions to interact with the Pasabayan AI Assistant.

---

## About Pasabayan

| Query | What it does |
|-------|--------------|
| "What is Pasabayan?" | Explains the platform |
| "How does Pasabayan work?" | Overview of carrier-shipper matching |
| "Who founded Pasabayan?" | Shows founder information |
| "Who is the CTO?" | Bong Suyat's bio |
| "What are Pasabayan's values?" | Company mission and values |

---

## Getting Started

| Query | What it does |
|-------|--------------|
| "How do I sign up?" | Account creation steps |
| "How do I verify my phone?" | Phone verification process |
| "How do I complete my profile?" | Profile setup guide |
| "What verification levels are there?" | Basic, Verified, Premium explained |
| "How do I get premium verified?" | Premium verification process |

---

## For Shippers (Sending Packages)

### Creating Requests

| Query | What it does |
|-------|--------------|
| "How do I send a package?" | Step-by-step package creation |
| "How do I create a package request?" | Detailed package form guide |
| "What information do I need to send a package?" | Required fields explained |
| "Can I send fragile items?" | Fragile package handling |
| "What items are prohibited?" | List of banned items |

### Finding Carriers

| Query | What it does |
|-------|--------------|
| "How do I find a carrier?" | Browse and search trips |
| "Show me trips from Toronto to Montreal" | Search for specific routes |
| "How do I request a carrier?" | Requesting a carrier |
| "What should I look for in a carrier?" | Ratings, reviews, verification |

### Tracking & Delivery

| Query | What it does |
|-------|--------------|
| "How do I track my package?" | Real-time tracking guide |
| "Where is my delivery?" | Checking delivery status |
| "What do the delivery statuses mean?" | Status explanations |
| "How do I confirm delivery?" | Delivery code process |
| "What is the delivery code?" | 6-digit verification explained |
| "My delivery code expired, what do I do?" | Code regeneration |

### Payments

| Query | What it does |
|-------|--------------|
| "How do I pay for a delivery?" | Payment process |
| "How do I add a payment method?" | Card setup |
| "Is my payment secure?" | Payment security info |
| "Can I get a refund?" | Refund policy |
| "Where can I see my receipts?" | Transaction history |

---

## For Carriers (Delivering Packages)

### Getting Started as Carrier

| Query | What it does |
|-------|--------------|
| "How do I become a carrier?" | Carrier signup process |
| "What do I need to be a carrier?" | Requirements |
| "How do I set up my carrier profile?" | Profile configuration |
| "How do I connect Stripe?" | Payment setup for carriers |

### Creating Trips

| Query | What it does |
|-------|--------------|
| "How do I create a trip?" | Trip creation steps |
| "How do I set my pricing?" | Pricing options (per kg, flat rate) |
| "Can I edit my trip?" | Modifying trip details |
| "How do I cancel a trip?" | Trip cancellation |

### Finding Packages

| Query | What it does |
|-------|--------------|
| "How do I find packages to deliver?" | Browse package requests |
| "Show me packages going to Vancouver" | Search packages by route |
| "How do I offer to deliver a package?" | Requesting a package |

### Managing Deliveries

| Query | What it does |
|-------|--------------|
| "How do I accept a delivery request?" | Accepting matches |
| "How do I mark a package as picked up?" | Pickup confirmation |
| "How do I complete a delivery?" | Entering delivery code |
| "What if the shipper isn't available?" | Handling no-shows |

### Getting Paid

| Query | What it does |
|-------|--------------|
| "How do I get paid?" | Payment process for carriers |
| "When will I receive my payment?" | Payment timing |
| "How much is the platform fee?" | 10% fee explained |
| "Where can I see my earnings?" | Earnings dashboard |
| "How do tips work?" | Tip system |

---

## Communication

| Query | What it does |
|-------|--------------|
| "How do I message my carrier?" | In-app chat guide |
| "How do I contact my shipper?" | Messaging shippers |
| "Can I call my carrier?" | Phone privacy policy |
| "How do I report a problem?" | Issue reporting |

---

## Favorites & Ratings

| Query | What it does |
|-------|--------------|
| "How do I add a carrier to favorites?" | Favorite system |
| "How do I rate a carrier?" | Rating process |
| "How do I leave a review?" | Writing reviews |
| "What do ratings mean?" | 1-5 star system |
| "How do I see my ratings?" | Viewing your ratings |

---

## Account & Settings

| Query | What it does |
|-------|--------------|
| "How do I edit my profile?" | Profile editing |
| "How do I change my photo?" | Profile picture |
| "How do I update my payment method?" | Card management |
| "How do I turn off notifications?" | Notification settings |
| "How do I deactivate my carrier account?" | Deactivating roles |
| "How do I delete my account?" | Account deletion |

---

## Troubleshooting

| Query | What it does |
|-------|--------------|
| "What if my package is damaged?" | Damage claims |
| "What if the carrier doesn't show up?" | No-show handling |
| "Why can't I see the carrier's location?" | Location troubleshooting |
| "My payment failed, what do I do?" | Payment issues |
| "I can't verify my phone" | Verification issues |
| "How do I cancel a delivery?" | Cancellation process |

---

## Data Queries (Admin/User)

### Trips

| Query | What it does |
|-------|--------------|
| "Show me available trips" | List active trips |
| "Show trips from Manila" | Search by origin |
| "Find trips to Cebu this week" | Search by destination + date |
| "Show my trips" | User's own trips |

### Packages

| Query | What it does |
|-------|--------------|
| "Show available packages" | List open packages |
| "Find packages going to Toronto" | Search by destination |
| "Show my package requests" | User's packages |

### Deliveries

| Query | What it does |
|-------|--------------|
| "Show my deliveries" | List user's matches |
| "Show my active deliveries" | In-progress deliveries |
| "What's the status of my delivery?" | Delivery status check |

### Statistics (Admin)

| Query | What it does |
|-------|--------------|
| "Show platform statistics" | Overall metrics |
| "How many deliveries today?" | Daily stats |
| "What are the popular routes?" | Route analytics |
| "Show user statistics" | User activity |

---

## Support

| Query | What it does |
|-------|--------------|
| "How do I contact support?" | Support channels |
| "What are support hours?" | Service availability |
| "I need help with..." | General assistance |

---

## Quick Tips for Users

1. **Be specific** - "Show trips from Toronto to Montreal" works better than "show trips"
2. **Ask follow-ups** - The assistant remembers your conversation
3. **Use natural language** - No need for special commands
4. **Ask for help** - Say "help" or "what can you do?" for guidance

---

## Testing Checklist for Developers

- [ ] Company info queries work
- [ ] App usage questions answered
- [ ] Trip search returns results
- [ ] Package search works
- [ ] User profile queries work
- [ ] Admin stats queries work (admin mode)
- [ ] Error handling for invalid queries
- [ ] Follow-up questions maintain context
