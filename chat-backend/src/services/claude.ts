/**
 * Claude Service - handles AI conversations with tool use
 */

import Anthropic from "@anthropic-ai/sdk";
import { getMcpClient, type Tool } from "./mcp-client.js";

// Lazy-initialize Anthropic client (after dotenv loads)
let anthropic: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropic) {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropic;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatOptions {
  userToken?: string;
  adminMode?: boolean;
}

// Company information - customize this with your details
const COMPANY_INFO = `
## About Pasabayan

🌐 **Website**: [pasabayan.com](http://pasabayan.com)

Pasabayan is a peer-to-peer delivery platform that connects travelers (carriers) with people who need items delivered (shippers). The name "Pasabayan" comes from the Filipino word "pasabay" meaning "to hitch a ride" or "to send along with someone."

### Our Mission
To make deliveries more affordable, sustainable, and community-driven by utilizing existing travel routes.

### How It Works
1. **Carriers** post their upcoming trips with available space
2. **Shippers** post package requests with pickup/delivery locations
3. The platform matches compatible trips and packages
4. Secure payments are held in escrow until delivery is confirmed

Learn more at **[pasabayan.com](http://pasabayan.com)**

### Founders

**Dave Estrada** - Chief Visionary Officer ("The Navigator")
Dave steers Pasabayan's mission to revolutionize peer-to-peer delivery across Canada. With a background in business strategy and a passion for the sharing economy, he charts our course toward sustainable growth and community impact.

**Gerard Galang** - Chief Operations Officer ("The Connector")
Gerard orchestrates our operations and drives market awareness. His expertise in logistics and marketing ensures every delivery connects smoothly while building trust in the Pasabayan community.

**Jeyem Esplana** - Chief Strategy Officer ("The Architect")
Jeyem architects the business foundations that make Pasabayan sustainable and scalable. His strategic insights transform vision into reality, building systems that grow with our community.

**Bong Suyat** - Chief Technology Officer ("The Blacksmith")
Bong forges the technology that powers Pasabayan. From mobile apps to backend systems, he crafts elegant, robust solutions that make peer-to-peer delivery seamless, secure, and delightful.

### Location
Canada 🇨🇦

### Values
- Community trust and safety
- Sustainable delivery through shared travel
- Fair pricing for carriers and shippers
- Transparent and secure transactions

### Learn More
- 🌐 Website: [pasabayan.com](http://pasabayan.com)
- 📱 Download the app from the App Store
- 📧 Contact: support@pasabayan.com
`;

// iOS App User Guide - customize this with your app's features
const APP_USER_GUIDE = `
## Pasabayan iOS App Guide

### Getting Started
1. **Download** the Pasabayan app from the App Store
2. **Sign up** using Google or Facebook
3. **Verify your phone** number with OTP for security
4. **Complete your profile** with your name and photo

### For Shippers (Sending Packages)

#### Creating a Package Request
1. Tap the **"+"** button or "Send Package"
2. Enter **pickup address** (where the carrier picks up)
3. Enter **delivery address** (destination)
4. Add package details:
   - Weight (kg)
   - Package type (documents, electronics, fragile, etc.)
   - Mark as fragile if needed
   - Estimated value (for insurance purposes)
5. Set your **budget** and **urgency level**
6. Submit and wait for carrier matches

#### Finding a Carrier
1. Go to **"Find Trips"** or browse available trips
2. Filter by route, date, or price
3. View carrier profiles and ratings
4. Tap **"Request"** to ask a carrier to deliver your package
5. Wait for carrier acceptance

#### Tracking Your Delivery
1. Go to **"My Deliveries"** or "Matches"
2. See real-time status: Requested → Accepted → Confirmed → Picked Up → In Transit → Delivered
3. Track carrier location on the map (when in transit)
4. Chat with your carrier directly in the app

#### Confirming Delivery
1. When carrier arrives, verify your package
2. **Generate delivery code** in the app
3. Share the 6-digit code with the carrier
4. Carrier enters code to complete delivery
5. Payment is released to carrier automatically

#### Rating Your Carrier
After delivery, rate your experience (1-5 stars) and leave feedback.

### For Carriers (Delivering Packages)

#### Becoming a Carrier
1. Go to **Profile → Become a Carrier**
2. Complete carrier profile:
   - Vehicle type
   - Max weight/space capacity
   - Preferred routes
3. Complete **Stripe onboarding** to receive payments

#### Creating a Trip
1. Tap **"Create Trip"** or "+"
<!-- Add screenshot: ![Create Trip](/help-images/create-trip.png) -->
2. Enter **origin** and **destination** cities
3. Set **departure date and time**
4. Enter available capacity:
   - Weight (kg)
   - Space (liters)
5. Set your **pricing** (per kg or flat rate)
6. Choose **transportation method** (car, van, flight, etc.)
7. Publish your trip

#### Finding Packages
1. Go to **"Find Packages"** or browse available requests
2. Filter by route or weight
3. View package details and shipper ratings
4. Tap **"Offer to Deliver"** to request the job

#### Managing Deliveries
1. **Accept** incoming requests from shippers
2. **Confirm** when ready to pick up
3. **Pick up** the package and mark as picked up
4. **Update status** during transit
5. **Deliver** by entering the shipper's 6-digit code

#### Getting Paid
- Payments are held in escrow until delivery is confirmed
- Platform fee: 10%
- Funds transfer to your Stripe account automatically
- Tips can be added by shippers

### Payment & Security

#### For Shippers
- Pay securely via saved credit/debit card
- Money held in escrow until delivery confirmed
- Request refund if delivery fails

#### For Carriers
- Complete Stripe Connect onboarding once
- Receive payments directly to your bank
- View earnings in "My Earnings"

### In-App Messaging
- Each delivery match has a **dedicated chat**
- Message your carrier or shipper directly
- No need to share personal phone numbers
- Chat history is saved for reference
- System messages show delivery status updates

### Favorite Carriers
1. After a successful delivery, you can **add carrier to favorites**
2. Go to carrier profile → Tap **"Add to Favorites"**
3. Requirements: Must have completed at least 1 delivery with them, rated 3+ stars
4. View favorites in **Profile → My Favorite Carriers**
5. Get notified when favorite carriers post new trips
6. Maximum 20 favorite carriers

### Managing Your Profile
1. Go to **Profile** tab
2. Edit your **name, photo, bio**
3. Update **address and location**
4. View your **ratings and reviews**
5. Check your **verification status**

### Notifications
- Enable push notifications for:
  - New match requests
  - Delivery status updates
  - Messages from carriers/shippers
  - Trip reminders
- Manage in **Profile → Notification Settings**

### Viewing Receipts & History
- **My Deliveries** → Tap completed delivery → **View Receipt**
- Receipts show: amount paid, platform fee, date, carrier/shipper info
- Download or share receipts for records
- **Profile → Transaction History** for all payments

### Account Settings
- **Deactivate Carrier Role**: Profile → Settings → Deactivate Carrier (you can reactivate anytime)
- **Deactivate Shipper Role**: Profile → Settings → Deactivate Shipper
- **Delete Account**: Contact support@pasabayan.com
- **Change Payment Method**: Profile → Payment Methods

### Location & Privacy
- Carriers share location **only during active deliveries** (picked up to delivered)
- Shippers can track carrier on map in real-time
- Location sharing stops automatically after delivery
- You control location permissions in your phone settings

### Verification Levels
1. **Basic**: Email verified (default)
2. **Verified**: Phone number verified via SMS OTP
3. **Premium**: Enhanced verification (ID verified) - request through Profile → Get Verified

### Badges & Achievements
- Earn badges for completing deliveries, getting good ratings, etc.
- View your badges in **Profile → My Badges**
- Badges are shown on your public profile

### Legal & Terms
- View Terms of Service: Profile → Legal → Terms
- View Privacy Policy: Profile → Legal → Privacy
- Carrier Agreement: Profile → Legal → Carrier Terms

### Safety Features
- **Phone verification** required for all users
- **Ratings & reviews** build trust
- **In-app chat** - no need to share personal numbers
- **Delivery codes** ensure proper handoff
- **Favorite carriers** - save trusted carriers for future deliveries
- **Real-time tracking** during delivery
- **Secure payments** held in escrow

### Common Questions

**Q: How do I cancel a delivery?**
A: Go to My Deliveries → Select the match → Tap "Cancel". Note: Cancellation policies may apply.

**Q: What if my package is damaged?**
A: Contact support immediately. Take photos and report through the app.

**Q: How do I update my payment method?**
A: Go to Profile → Payment Methods → Add or remove cards.

**Q: Can I schedule recurring trips?**
A: Currently trips are one-time. Create a new trip for each journey.

**Q: What items are prohibited?**
A: Illegal items, hazardous materials, perishables (without proper packaging), and weapons are not allowed.

**Q: How long does payment take to arrive?**
A: After delivery is confirmed, payments typically arrive in your bank within 2-3 business days.

**Q: Can I change the delivery address after booking?**
A: Contact the carrier through in-app chat. Changes depend on carrier approval and may affect pricing.

**Q: What if the carrier doesn't show up?**
A: If pickup is missed, you can cancel the match and your payment will be refunded. Report the issue through the app.

**Q: How do I report a problem with a carrier or shipper?**
A: Go to the completed delivery → Tap "Report Issue" or contact support@pasabayan.com

**Q: Is there a weight or size limit?**
A: Limits depend on the carrier's vehicle and capacity. Check trip details before requesting.

**Q: Can I use Pasabayan for business deliveries?**
A: Yes! Many small businesses use Pasabayan for affordable, flexible deliveries.

**Q: How do ratings work?**
A: After each delivery, both carrier and shipper can rate each other (1-5 stars). Higher ratings build trust and visibility.

**Q: What happens if I need to cancel?**
A: Cancellation before pickup is usually free. After pickup, cancellation may incur fees. Check our cancellation policy in the app.

**Q: How do I message my carrier/shipper?**
A: Go to My Deliveries → Select the match → Tap "Chat" or the message icon. You can message anytime during an active delivery.

**Q: How do I add a carrier to favorites?**
A: After completing a delivery, go to the carrier's profile and tap "Add to Favorites". You must have rated them 3+ stars.

**Q: Why can't I see the carrier's location?**
A: Location tracking is only available when delivery status is "Picked Up" or "In Transit". The carrier must have location permissions enabled.

**Q: How do I get verified?**
A: Go to Profile → Get Verified. Phone verification requires OTP. Premium verification requires ID and is reviewed by our team.

**Q: Where can I see my delivery history?**
A: Go to My Deliveries and filter by "Completed" or "All". You can also view transaction history in Profile → Transactions.

**Q: How do I turn off notifications?**
A: Go to Profile → Notification Settings. You can toggle specific notification types on/off.

**Q: Can I delete my account?**
A: Contact support@pasabayan.com to request account deletion. Active deliveries must be completed first.

**Q: How do I edit my profile?**
A: Go to Profile tab → Tap "Edit Profile" → Update your name, photo, bio, and address.

**Q: What are badges?**
A: Badges are achievements earned for milestones like completing deliveries, maintaining high ratings, etc. View them in Profile → My Badges.

**Q: Is my personal information safe?**
A: Yes. We don't share your phone number or exact address with other users. Communication happens through in-app chat. Payments are processed securely through Stripe.

### Support
- In-app: Tap the **chat icon** to talk to our AI assistant
- Email: support@pasabayan.com
- Website: https://pasabayan.com/help
- The AI assistant can help with delivery tracking, account questions, and platform information

### Service Hours
- Platform available 24/7
- Customer support: Monday-Friday 9AM-6PM EST
- AI assistant: Available anytime
`;

// Business logic and flow explanations
const BUSINESS_LOGIC_GUIDE = `
## How Matching Works

### What is a Match?
A "match" connects a **carrier's trip** with a **shipper's package request**. It represents an agreement for the carrier to deliver the shipper's package along their travel route.

### Compatibility Criteria
Trips and packages are matched based on:
1. **Route overlap** - Package pickup/delivery cities align with trip origin/destination
2. **Timing** - Trip departure date allows enough time for pickup
3. **Capacity** - Trip has enough available weight (kg) for the package
4. **Price fit** - Carrier's price_per_kg fits within shipper's max_price_budget

### Discovery Options
- **Carrier finds package**: Browse "Find Packages" → filter by route → see compatible requests → send delivery offer
- **Shipper finds carrier**: Browse "Find Trips" → filter by route/date → see compatible trips → request delivery

### Match Status Flow
\`\`\`
[carrier_requested/shipper_requested] → [accepted] → [confirmed] → [picked_up] → [in_transit] → [delivered]
\`\`\`

| Status | What It Means | Who Acts Next |
|--------|---------------|---------------|
| carrier_requested | Carrier offered to deliver | Shipper decides |
| shipper_requested | Shipper requested carrier | Carrier decides |
| accepted | Other party agreed | Both confirm details |
| confirmed | Both committed, payment held | Carrier picks up |
| picked_up | Carrier has the package | Carrier travels |
| in_transit | En route to destination | Carrier delivers |
| delivered | Handoff complete with code | Done! |

## Payment Flow

### How Payments Work (Step-by-Step)

1. **Match Confirmed** → Shipper's payment is charged and held in escrow
2. **Carrier Picks Up** → Money remains in escrow (protected)
3. **Carrier Delivers** → Shipper generates a 6-digit delivery code
4. **Code Entered** → Carrier enters code to confirm handoff
5. **Payment Released** → Platform takes 10% fee, carrier gets 90%
6. **Payout** → Funds transfer to carrier's bank (2-3 business days via Stripe)

### Fee Breakdown Example
| Item | Amount |
|------|--------|
| Shipper pays | $100.00 |
| Platform fee (10%) | -$10.00 |
| Carrier receives | $90.00 |
| Optional tip | +100% to carrier |

### Escrow Protection
- **For Shippers**: Money isn't released until YOU generate the delivery code and carrier enters it
- **For Carriers**: Payment is guaranteed once delivery is confirmed
- **Delivery code**: 6 digits, expires after 30 minutes, regenerate if needed
- **Failed delivery**: Shipper can request refund if package not delivered

### Carrier Payout Requirements
- Must complete **Stripe Connect onboarding** (one-time setup)
- Provide bank account details to Stripe
- Payouts are automatic after each completed delivery
- View earnings anytime in "My Earnings"

### Refunds & Disputes
- **Before pickup**: Full refund available if match is cancelled
- **After pickup**: Contact support for dispute resolution
- **Damaged items**: Report immediately with photos through the app

## Cancellation Policy

### For Shippers (Cancelling a Package Request)

| When You Cancel | What Happens | Fee |
|-----------------|--------------|-----|
| Before any carrier accepts | Full refund, no penalty | Free |
| After carrier accepts, before confirmation | Full refund | Free |
| After confirmation, before pickup | Refund minus small admin fee | ~5% |
| After pickup (package in transit) | Contact support - case by case | Varies |

### For Carriers (Cancelling a Delivery)

| When You Cancel | What Happens | Impact |
|-----------------|--------------|--------|
| Before accepting | No impact | None |
| After accepting, before confirmation | Shipper notified, no penalty | Minor |
| After confirmation, before pickup | Shipper refunded, warning issued | Moderate |
| After pickup (you have the package) | MUST return package or deliver | Severe - account review |

### No-Show Policy
- **Carriers**: Missing 2+ pickups without notice → temporary suspension
- **Shippers**: Not available for 2+ scheduled pickups → warning, then restrictions
- Always communicate through in-app chat if plans change!

### How to Cancel
1. Go to **My Deliveries** → Select the match
2. Tap **"Cancel Delivery"**
3. Select a reason (helps us improve)
4. Confirm cancellation
5. Refund processed within 3-5 business days

## Safety Guidelines

### For Everyone

#### Before Meeting
- ✅ Verify the other person's profile (ratings, verification level, reviews)
- ✅ Communicate only through in-app chat (keeps records)
- ✅ Share your plans with a friend or family member
- ✅ Trust your instincts - if something feels off, cancel

#### During Pickup/Delivery
- ✅ Meet in **public, well-lit places** (coffee shops, malls, gas stations)
- ✅ Avoid isolated areas or going inside someone's home
- ✅ Verify the package matches the description
- ✅ Take photos of the package at pickup and delivery
- ❌ Never share personal phone numbers or addresses outside the app

### For Shippers

#### Package Preparation
- ✅ Pack items securely with proper cushioning
- ✅ Seal packages so tampering is visible
- ✅ Label fragile items clearly
- ✅ Declare accurate weight and contents
- ✅ Don't send prohibited items (see list below)

#### Verification
- ✅ Check carrier's ratings (aim for 4+ stars)
- ✅ Prefer verified or premium carriers for valuable items
- ✅ Ask questions in chat before confirming

### For Carriers

#### Package Acceptance
- ✅ Ask about contents if description is vague
- ✅ Refuse suspicious or improperly packaged items
- ✅ Document any existing damage before accepting
- ✅ Know the weight/size limits of your vehicle

#### During Transit
- ✅ Keep packages secure and protected
- ✅ Don't open or tamper with packages
- ✅ Update status in the app (helps shipper track)
- ✅ Communicate delays promptly

### Prohibited Items (Canada)
❌ Illegal drugs or controlled substances
❌ Weapons, ammunition, explosives
❌ Hazardous materials (flammable, corrosive, toxic)
❌ Perishable food (without proper packaging/cooling)
❌ Live animals
❌ Counterfeit goods
❌ Stolen property
❌ Items requiring special licenses to transport
❌ Cash or bearer instruments over $10,000 CAD

**Consequences**: Violations result in immediate account suspension and may be reported to authorities.

### Emergency Contacts
- **In-app support**: Chat with AI assistant 24/7
- **Email**: support@pasabayan.com
- **Emergency**: Call 911 for immediate safety concerns
- **Report user**: Profile → Report User (for policy violations)

## Pricing Tips

### For Carriers: Setting Competitive Rates

#### Factors to Consider
1. **Distance**: Longer routes = higher base price
2. **Fuel costs**: Factor in current gas prices
3. **Time investment**: Pickup/delivery adds time to your trip
4. **Package type**: Fragile or special handling = premium
5. **Competition**: Check what others charge for similar routes

#### Pricing Strategies
| Strategy | When to Use | Example |
|----------|-------------|---------|
| **Per kg rate** | Standard packages | $5-15/kg depending on route |
| **Flat rate** | Small, light items | $20-50 for documents |
| **Premium rate** | Fragile, urgent, or valuable | +25-50% above standard |

#### Tips for More Deliveries
- 📈 Start slightly below market rate to build ratings
- ⭐ Maintain 4.5+ stars for visibility boost
- 📅 Post trips 1-2 weeks in advance
- 🗺️ Popular routes: Toronto↔Montreal, Vancouver↔Calgary, GTA suburbs
- 💬 Respond to requests quickly (within hours, not days)
- 📸 Add a friendly profile photo

### For Shippers: Budgeting Your Delivery

#### Typical Price Ranges (Canada, 2024)
| Route Type | Price Range | Example |
|------------|-------------|---------|
| Same city | $15-40 | Toronto to Mississauga |
| Regional (2-4 hrs) | $30-80 | Toronto to Ottawa |
| Long distance (4+ hrs) | $50-150 | Toronto to Montreal |
| Cross-country | $100-300+ | Toronto to Vancouver |

*Prices vary by package weight, urgency, and carrier availability*

#### Money-Saving Tips
- 💰 Be flexible on pickup/delivery dates
- 📦 Combine multiple small items into one package
- 🕐 Book 1-2 weeks ahead (last-minute = premium)
- ⭐ Consider newer carriers (lower rates, building reputation)
- 🤝 Build relationships with favorite carriers for repeat discounts

#### When to Pay More
- 🎁 Valuable items (peace of mind with experienced carrier)
- ⏰ Urgent deliveries (same-day or next-day)
- 🥚 Fragile items (experienced handlers)
- 📅 Holiday seasons (high demand)

### Understanding the Final Cost

\`\`\`
Your Budget: $100
├── Carrier receives: $90 (90%)
├── Platform fee: $10 (10%)
└── Optional tip: You decide (100% to carrier)
\`\`\`

**No hidden fees**: The price you agree on is what you pay (plus optional tip).

## Verification Levels & Benefits

### Three Levels of Verification

| Level | How to Get It | Time |
|-------|---------------|------|
| **Basic** | Sign up with Google/Facebook | Instant |
| **Verified** | Verify phone number via SMS OTP | 2 minutes |
| **Premium** | Submit ID + admin review | 1-3 business days |

### What Each Level Unlocks

| Feature | Basic | Verified | Premium |
|---------|-------|----------|---------|
| Browse trips/packages | ✅ | ✅ | ✅ |
| Send/receive messages | ✅ | ✅ | ✅ |
| Create package requests | ❌ | ✅ | ✅ |
| Create carrier trips | ❌ | ✅ | ✅ |
| Accept delivery requests | ❌ | ✅ | ✅ |
| Higher visibility in search | ❌ | ✅ | ✅ |
| Premium badge on profile | ❌ | ❌ | ✅ |
| Priority customer support | ❌ | ❌ | ✅ |
| Higher delivery limits | ❌ | ❌ | ✅ |

### How to Get Verified

**Phone Verification (Basic → Verified):**
1. Go to **Profile → Get Verified**
2. Enter your phone number
3. Receive SMS with 6-digit code
4. Enter code to verify
5. Instant upgrade to Verified status

**Premium Verification (Verified → Premium):**
1. Go to **Profile → Get Verified → Premium**
2. Upload government-issued ID (driver's license, passport, or provincial ID)
3. Take a selfie for identity match
4. Submit for review
5. Admin reviews within 1-3 business days
6. Get notified when approved

### Why Verification Matters
- **Trust**: Verified users have proven their identity
- **Safety**: Reduces fraud and fake accounts
- **Access**: Required to create trips or packages
- **Visibility**: Verified/Premium users appear higher in search results

## Ratings & Reviews System

### How Ratings Work

After every completed delivery, both parties can rate each other:
- **Shippers rate carriers**: Punctuality, communication, package handling
- **Carriers rate shippers**: Accuracy of package info, punctuality, communication

### Rating Scale
| Stars | Meaning |
|-------|---------|
| ⭐⭐⭐⭐⭐ (5) | Excellent - Would recommend |
| ⭐⭐⭐⭐ (4) | Good - Minor issues |
| ⭐⭐⭐ (3) | Okay - Room for improvement |
| ⭐⭐ (2) | Poor - Significant issues |
| ⭐ (1) | Terrible - Major problems |

### Impact of Ratings

**For Carriers:**
| Rating | Impact |
|--------|--------|
| 4.5+ stars | 🏆 Featured in search, "Top Carrier" badge |
| 4.0-4.4 stars | ✅ Good visibility, trusted status |
| 3.5-3.9 stars | ⚠️ Normal visibility |
| 3.0-3.4 stars | ⚠️ Reduced visibility, warning issued |
| Below 3.0 | ❌ Account review, may be suspended |

**For Shippers:**
| Rating | Impact |
|--------|--------|
| 4.0+ stars | Carriers more likely to accept your requests |
| Below 3.0 | Some carriers may decline your requests |

### Tips for Getting Good Ratings

**For Carriers:**
- ✅ Communicate proactively about pickup times
- ✅ Update delivery status in the app
- ✅ Handle packages with care
- ✅ Be punctual for pickup and delivery
- ✅ Be friendly and professional

**For Shippers:**
- ✅ Describe package accurately (weight, size, contents)
- ✅ Be available at scheduled pickup time
- ✅ Respond to messages promptly
- ✅ Have package ready and properly packed
- ✅ Generate delivery code promptly on arrival

### Viewing Your Ratings
- Go to **Profile → My Ratings**
- See your overall score and recent reviews
- View individual feedback from deliveries

### Disputing Unfair Ratings
If you believe a rating is unfair:
1. Go to **Profile → My Ratings → [Select Rating]**
2. Tap **"Dispute This Rating"**
3. Explain why you believe it's unfair
4. Support team reviews within 3-5 business days
5. Unfair ratings may be removed

### Favorite Carriers & Ratings
- You can only add carriers rated **3+ stars** to favorites
- Maximum **20 favorite carriers** per account
- Favorites get notified when you post new packages

## Troubleshooting & Support Escalation

### Common Issues & Quick Fixes

**"I can't create a trip/package"**
→ You need to be **Verified**. Go to Profile → Get Verified → Verify phone number.

**"I can't see carrier location"**
→ Location is only shared when status is **"Picked Up"** or **"In Transit"**. The carrier must have location permissions enabled.

**"Payment failed"**
→ Check your payment method in Profile → Payment Methods. Try a different card or contact your bank.

**"Carrier/shipper isn't responding"**
→ Wait 24 hours, then you can cancel without penalty. Report unresponsive users through their profile.

**"Delivery code isn't working"**
→ Codes expire after 30 minutes. Generate a new code in the app.

**"I was charged but delivery was cancelled"**
→ Refunds are automatic and take 3-5 business days to appear.

### When to Contact Human Support

Contact support@pasabayan.com when:
- 🚨 Safety concern or emergency
- 💰 Payment dispute over $100
- 🚫 Account suspended or restricted
- 📦 Package damaged, lost, or stolen
- ⚖️ Dispute not resolved through app
- 🔐 Account security issue (hacked, unauthorized access)
- 🐛 App bug preventing core functionality

### How to Contact Support

**Option 1: In-App (Fastest)**
1. Go to **Profile → Help & Support**
2. Tap **"Contact Support"**
3. Describe your issue with details
4. Include match ID, screenshots if relevant
5. Response within 24 hours (usually faster)

**Option 2: Email**
- Send to: support@pasabayan.com
- Include: Your account email, match ID, description
- Response within 24-48 hours

**Option 3: AI Assistant (Instant)**
- Use this chat for instant help with most questions
- Available 24/7
- Can look up your deliveries and account info

### Information to Include When Contacting Support
- ✅ Your account email
- ✅ Match ID (if about a specific delivery)
- ✅ Date and time of issue
- ✅ Screenshots showing the problem
- ✅ Steps you already tried
- ✅ What outcome you're hoping for

### Support Response Times
| Issue Type | Expected Response |
|------------|-------------------|
| Safety/Emergency | Within 2 hours |
| Payment disputes | Within 24 hours |
| Account issues | Within 24 hours |
| General questions | Within 48 hours |
| Feature requests | Within 1 week |

### Escalation Path
If your issue isn't resolved:
1. **First contact**: AI Assistant or email support
2. **Not resolved in 48 hours**: Reply to ticket asking for escalation
3. **Still not resolved**: Email escalations@pasabayan.com with ticket number
4. **Final escalation**: Legal matters only → legal@pasabayan.com
`;

// System prompts for different modes
const ADMIN_SYSTEM_PROMPT = `You are a Pasabayan support assistant with full platform access.
${COMPANY_INFO}
${APP_USER_GUIDE}
${BUSINESS_LOGIC_GUIDE}

You help the support team look up users, check delivery statuses, view transactions, and analyze platform metrics.
You can also help users understand how to use the Pasabayan app.

When support staff ask about users:
- Use find_user_by_email to look them up by email
- Use get_user_profile to get details by ID
- Show relevant details like verification status, ratings, activity

When asked about deliveries or matches:
- Use get_match to fetch full details
- Use list_matches to find matches by status
- Explain the current status and what the next steps should be

When asked about payments:
- Use get_transaction to check payment status
- Explain the escrow status and payout timeline

For platform analytics:
- Use get_platform_stats for overall metrics
- Use get_popular_routes for route analytics

Always be helpful, accurate, and concise. Format responses with markdown for readability.
If you cannot find information, say so clearly and suggest alternative approaches.`;

const USER_SYSTEM_PROMPT = `You are a friendly Pasabayan assistant helping users with their deliveries.
${COMPANY_INFO}
${APP_USER_GUIDE}
${BUSINESS_LOGIC_GUIDE}

You can answer questions about how to use the Pasabayan app, explain features, and help troubleshoot issues.
You can only access the authenticated user's own data - never try to look up other users.

When users ask about their deliveries:
- Use list_matches to find their active and past deliveries
- Use get_match for specific delivery details
- Provide helpful status updates and explain what happens next

When users want to find trips or packages:
- Use search_trips to find available carrier trips
- Use search_packages to browse package requests
- Help them understand pricing and compatibility

When users ask about their account:
- Use get_my_profile for their profile info
- Use get_my_stats or get_carrier_stats/get_shipper_stats for performance metrics
- Use get_earnings_summary or get_spending_summary for financial info

Always be friendly, helpful, and concise. Use emojis sparingly to make responses engaging.
If you cannot help with something, explain why and suggest what they can do instead.`;

/**
 * Convert MCP tools to Anthropic tool format
 */
function convertToolsForAnthropic(tools: Tool[]): Anthropic.Tool[] {
  return tools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    input_schema: tool.input_schema as Anthropic.Tool.InputSchema,
  }));
}

/**
 * Process a chat conversation with Claude
 */
export async function processChat(
  messages: Message[],
  options: ChatOptions = {}
): Promise<{
  response: string;
  toolsUsed: string[];
}> {
  const mcpClient = getMcpClient();
  const tools = await mcpClient.getTools();
  const anthropicTools = convertToolsForAnthropic(tools);

  const systemPrompt = options.adminMode
    ? ADMIN_SYSTEM_PROMPT
    : USER_SYSTEM_PROMPT;

  // Convert messages to Anthropic format
  const anthropicMessages: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const toolsUsed: string[] = [];

  // Initial request to Claude
  let response = await getAnthropicClient().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    tools: anthropicTools,
    messages: anthropicMessages,
  });

  // Handle tool use loop
  while (response.stop_reason === "tool_use") {
    const toolUseBlocks = response.content.filter(
      (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
    );

    // Execute all tool calls
    const toolResults = await Promise.all(
      toolUseBlocks.map(async (toolUse) => {
        toolsUsed.push(toolUse.name);

        try {
          const result = await mcpClient.executeTool(
            toolUse.name,
            toolUse.input as Record<string, unknown>,
            {
              userToken: options.userToken,
              adminMode: options.adminMode,
            }
          );

          return {
            type: "tool_result" as const,
            tool_use_id: toolUse.id,
            content: result.result,
          };
        } catch (error) {
          return {
            type: "tool_result" as const,
            tool_use_id: toolUse.id,
            content: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            is_error: true,
          };
        }
      })
    );

    // Continue conversation with tool results
    response = await getAnthropicClient().messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      tools: anthropicTools,
      messages: [
        ...anthropicMessages,
        { role: "assistant", content: response.content },
        { role: "user", content: toolResults },
      ],
    });
  }

  // Extract final text response
  const textBlock = response.content.find(
    (block): block is Anthropic.TextBlock => block.type === "text"
  );

  return {
    response: textBlock?.text || "I apologize, but I couldn't generate a response.",
    toolsUsed: [...new Set(toolsUsed)], // Deduplicate
  };
}

/**
 * Stream a chat response (for real-time UI updates)
 */
export async function* streamChat(
  messages: Message[],
  options: ChatOptions = {}
): AsyncGenerator<{ type: "text" | "tool" | "done"; content: string }> {
  const mcpClient = getMcpClient();
  const tools = await mcpClient.getTools();
  const anthropicTools = convertToolsForAnthropic(tools);

  const systemPrompt = options.adminMode
    ? ADMIN_SYSTEM_PROMPT
    : USER_SYSTEM_PROMPT;

  const anthropicMessages: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  // Note: For streaming with tool use, we need to handle it differently
  // This is a simplified version that doesn't fully support streaming with tools
  const response = await getAnthropicClient().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    tools: anthropicTools,
    messages: anthropicMessages,
  });

  // If there's tool use, process it (non-streaming)
  if (response.stop_reason === "tool_use") {
    yield { type: "tool", content: "Fetching data..." };

    const result = await processChat(messages, options);
    yield { type: "text", content: result.response };
    yield { type: "done", content: "" };
    return;
  }

  // For non-tool responses, yield the text
  const textBlock = response.content.find(
    (block): block is Anthropic.TextBlock => block.type === "text"
  );

  if (textBlock) {
    yield { type: "text", content: textBlock.text };
  }

  yield { type: "done", content: "" };
}
