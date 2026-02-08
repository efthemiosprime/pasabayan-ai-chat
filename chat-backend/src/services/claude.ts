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
  developerMode?: boolean;
  qaMode?: boolean;
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

// Business System Overview - comprehensive platform knowledge
const BUSINESS_SYSTEM_OVERVIEW = `
## Pasabayan Business System Overview

### System Purpose

Pasabayan is a peer-to-peer delivery platform that connects people who need packages delivered (Shippers) with people who have available space in their vehicles (Carriers). Think of it as "Uber for packages" where everyday people can earn money by carrying packages during their regular trips.

### User Roles

**Carriers:**
- People with vehicles who want to earn extra money
- Create trips, accept package requests, deliver packages
- Get paid for successful deliveries
- Requirements: Vehicle, valid driver's license

**Shippers:**
- People who need packages delivered
- Create package requests, book trips, track deliveries
- Pay carriers for delivery services
- Requirements: Valid account, payment method

### Core System Components

#### 1. Package Requests
A request created by a shipper who needs something delivered.

**Key Properties:**
- Package details (title, description, size, weight, fragile status)
- Location information (pickup address, delivery address, distance)
- Timing (preferred pickup/delivery date, urgency level)
- Service type (regular delivery or shopping service)
- Pricing (maximum price, negotiation allowed)

**Package Status States:**
| Status | Description |
|--------|-------------|
| Open | Available for carriers to see and request |
| Pending | Waiting for carrier response |
| Pending Request | Shipper has requested a specific trip |
| Matched | Carrier has offered to carry the package |
| Booked | Shipper has accepted a carrier's offer |
| In Transit | Package is being delivered |
| Delivered | Successfully delivered to destination |
| Cancelled | Request cancelled by shipper or carrier |

#### 2. Trips
A planned journey created by a carrier showing their available capacity.

**Key Properties:**
- Route information (start/end locations, distance, travel time)
- Timing (departure/arrival date and time)
- Capacity (available weight, volume, max dimensions)
- Pricing (price per kilometer, min/max charge)
- Vehicle type and special services

**Trip Status States:**
| Status | Description |
|--------|-------------|
| Scheduled | Trip is planned and available |
| Active | Trip is in progress |
| Completed | Trip finished successfully |
| Cancelled | Trip cancelled by carrier |

#### 3. Matches
The connection between a package request and a trip when they're compatible.

**How Matches Happen:**
- **Carrier Request:** Carrier sees a package and offers to carry it
- **Shipper Request:** Shipper finds a trip and requests to book it
- **Smart Matching:** System automatically suggests compatible options

**Match Status States:**
| Status | Description | Next Possible States |
|--------|-------------|---------------------|
| Pending | Waiting for acceptance | Confirmed, Declined, Cancelled |
| Carrier Requested | Carrier offered to carry | Shipper Accepted, Shipper Declined |
| Shipper Requested | Shipper requested trip | Carrier Accepted, Carrier Declined |
| Carrier Accepted | Carrier accepted request | Confirmed |
| Shipper Accepted | Shipper accepted offer | Confirmed |
| Confirmed | Both parties agreed | Picked Up, Cancelled |
| Picked Up | Package collected | In Transit, Cancelled |
| In Transit | Package being delivered | Delivered |
| Delivered | Delivery completed | Final state |
| Cancelled | Match cancelled | Final state |
| Shipper Declined | Shipper declined offer | Final state (or Counter-Offer) |
| Carrier Declined | Carrier declined request | Final state (or Counter-Offer) |

#### 4. Counter-Offer System

When a request is declined, either party can make a counter-offer:

| Scenario | Who Declines | Counter-Offer Option |
|----------|--------------|---------------------|
| Shipper requests trip | Carrier declines | Carrier can propose a different price |
| Carrier offers to carry | Shipper declines | Shipper can propose a different price |

**Counter-Offer Flow:**
1. User declines a request/offer
2. System prompts: "Would you like to make a counter-offer?"
3. User enters new price and optional message
4. Other party receives notification with new price
5. Other party can: Accept, Decline, or Counter-Offer back

**Example Negotiation:**
- Round 1: Shipper offers $50
- Round 2: Carrier counters with $70
- Round 3: Shipper counters with $60
- Round 4: Carrier accepts $60 → Booking proceeds

#### 5. Ratings & Reviews
Feedback system where users rate each other after completed deliveries.

**Rating Components:**
- Star Rating: 1-5 stars (1 = poor, 5 = excellent)
- Written Review: Optional text feedback
- Quick Tags: Punctual, Professional, Careful handling, Good communication, Would recommend

**Rating Categories:**
- Overall Experience
- Carrier Performance / Package Accuracy
- Communication
- Timeliness

#### 6. Chat System
Real-time messaging between shippers and carriers.

**Features:**
- Text messages and photo sharing
- Status updates (automatic notifications)
- File sharing (documents, receipts)
- Real-time delivery with read receipts
- Complete message history

**Triggers:**
- Automatically created when a match is confirmed
- Used for coordination and updates
- Continues until delivery is complete

#### 7. Payment System
Secure payment processing for delivery fees.

**Payment Flow:**
1. Agreed Price: Set when match is confirmed
2. Auto-Charge: Payment is automatically charged when shipper confirms booking
3. Carrier Payout: Carrier receives payment after successful delivery (via Stripe Connect)

**Payment Methods:**
- Credit/debit cards (Visa, Mastercard, Amex)
- Digital wallets (Apple Pay, Google Pay)

**Payment States:**
| Status | Description |
|--------|-------------|
| Pending | Payment being processed |
| Processing | Payment is being verified |
| Completed | Payment successful, funds transferred |
| Failed | Payment declined or error |
| Refunded | Payment returned to shipper |
| Disputed | Payment under review |
| Cancelled | Payment cancelled before completion |

#### 8. User Profiles
Account information and preferences.

**Verification Levels:**
| Level | Description | Requirements |
|-------|-------------|--------------|
| Incomplete | Profile setup not finished | Basic info required |
| Basic | Basic profile provided | Email verification |
| Verified | Identity and phone verified | Phone + basic ID |
| Premium | Enhanced verification | Full ID + background check |

#### 9. Vehicle Information (Carriers Only)
Vehicle details including make/model, capacity, special features, insurance, and documentation.

**Vehicle States:**
| Status | Description |
|--------|-------------|
| Pending | Awaiting verification |
| Verified | Approved for service |
| Rejected | Needs correction |
| Expired | Documents expired |
| Suspended | Temporarily suspended |

### Verification System

**Pickup Verification:**
- Purpose: Ensure carrier picks up from correct shipper
- Process: Shipper generates 6-digit code, carrier enters to confirm
- Security: Code expires after 15 minutes
- Result: Status changes to "Picked Up"

**Delivery Verification:**
- Purpose: Ensure package delivered to correct recipient
- Process: Recipient generates 6-digit code, carrier enters to confirm
- Security: Code expires after 15 minutes
- Result: Status changes to "Delivered"

### Carrier Payout System (Stripe Connect)

**First-Time Setup:**
1. Go to Profile → Payout Setup
2. Tap "Set Up Payouts"
3. Complete Stripe Express onboarding (identity, bank account, tax info)
4. Return to app with "Payouts Enabled" status

**Earning & Payout Cycle:**
1. Carrier completes delivery
2. Earnings added to Stripe balance
3. Automatic payout to bank (daily/weekly)
4. Money arrives in 2-3 business days

### Business Value

**For Shippers:**
- Cost effective (often cheaper than traditional couriers)
- Flexible delivery times
- Real-time tracking
- Door-to-door service with verification

**For Carriers:**
- Extra income during regular trips
- Flexible schedule
- No long-term contracts
- Help neighbors while earning

### Contact & Support

- **In-App Support:** Help center within the app
- **Email:** support@pasabayan.com
- **FAQ:** Comprehensive help articles available
`;

// Developer API Reference
const DEVELOPER_API_REFERENCE = `
## Developer API Reference

This section is for developers integrating with the Pasabayan API.

### Authentication

All API requests require authentication via **Laravel Sanctum** Bearer token.

\`\`\`
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
\`\`\`

**Getting a Token:**
\`\`\`
POST /api/auth/{provider}/login
Provider: google | facebook

Response:
{
  "user": { "id": 1, "name": "John", "email": "john@example.com", ... },
  "token": "1|abc123..."
}
\`\`\`

---

### Trips API (Carriers)

#### List Trips
\`\`\`
GET /api/trips
Query params: ?status=active&per_page=10&page=1

Response:
{
  "data": [
    {
      "id": 1,
      "user_id": 5,
      "origin_city": "Toronto",
      "origin_province": "ON",
      "destination_city": "Montreal",
      "destination_province": "QC",
      "departure_date": "2024-03-15",
      "departure_time": "09:00:00",
      "available_weight_kg": 10.5,
      "available_space_liters": 50,
      "price_per_kg": 8.00,
      "trip_status": "active",
      "transportation_method": "car",
      "notes": "Flexible pickup location",
      "created_at": "2024-03-01T10:00:00Z",
      "updated_at": "2024-03-01T10:00:00Z"
    }
  ],
  "meta": { "current_page": 1, "last_page": 5, "total": 48 }
}
\`\`\`

#### Create Trip
\`\`\`
POST /api/trips

Request Body:
{
  "origin_city": "Toronto",
  "origin_province": "ON",
  "destination_city": "Montreal",
  "destination_province": "QC",
  "departure_date": "2024-03-15",
  "departure_time": "09:00",
  "available_weight_kg": 10.5,
  "available_space_liters": 50,
  "price_per_kg": 8.00,
  "transportation_method": "car",
  "notes": "Optional notes"
}

Required fields: origin_city, destination_city, departure_date, available_weight_kg, price_per_kg
Optional fields: origin_province, destination_province, departure_time, available_space_liters, transportation_method, notes

Response: { "data": { ...trip object } }
\`\`\`

#### Get Single Trip
\`\`\`
GET /api/trips/{id}

Response: { "data": { ...trip object with carrier info } }
\`\`\`

#### Get Available Trips (for matching)
\`\`\`
GET /api/trips/available
Query params: ?origin_city=Toronto&destination_city=Montreal&min_weight=5

Response: { "data": [ ...trips ] }
\`\`\`

#### Find Compatible Packages for Trip
\`\`\`
GET /api/trips/{id}/compatible-packages

Response: { "data": [ ...matching packages ] }
\`\`\`

---

### Packages API (Shippers)

#### List Packages
\`\`\`
GET /api/packages
Query params: ?status=pending&per_page=10

Response:
{
  "data": [
    {
      "id": 1,
      "user_id": 3,
      "pickup_address": "123 Queen St, Toronto, ON",
      "pickup_city": "Toronto",
      "delivery_address": "456 Rue Sainte, Montreal, QC",
      "delivery_city": "Montreal",
      "package_weight_kg": 2.5,
      "package_type": "electronics",
      "is_fragile": true,
      "estimated_value": 500.00,
      "max_price_budget": 50.00,
      "urgency_level": "normal",
      "package_status": "pending",
      "description": "Laptop in original box",
      "created_at": "2024-03-01T10:00:00Z"
    }
  ]
}
\`\`\`

#### Create Package Request
\`\`\`
POST /api/packages

Request Body:
{
  "pickup_address": "123 Queen St, Toronto, ON",
  "pickup_city": "Toronto",
  "delivery_address": "456 Rue Sainte, Montreal, QC",
  "delivery_city": "Montreal",
  "package_weight_kg": 2.5,
  "package_type": "electronics",
  "is_fragile": true,
  "estimated_value": 500.00,
  "max_price_budget": 50.00,
  "urgency_level": "normal",
  "description": "Laptop in original box"
}

Required fields: pickup_address, pickup_city, delivery_address, delivery_city, package_weight_kg, package_type
Optional fields: is_fragile, estimated_value, max_price_budget, urgency_level, description

package_type enum: documents, electronics, clothing, fragile, food, other
urgency_level enum: flexible, normal, urgent, same_day
\`\`\`

#### Get Available Packages (for carriers)
\`\`\`
GET /api/packages/available
Query params: ?pickup_city=Toronto&delivery_city=Montreal&max_weight=10

Response: { "data": [ ...packages ] }
\`\`\`

#### Find Compatible Trips for Package
\`\`\`
GET /api/packages/{id}/compatible-trips

Response: { "data": [ ...matching trips ] }
\`\`\`

---

### Matches API (Core)

#### List Matches
\`\`\`
GET /api/matches
Query params: ?status=confirmed&role=carrier&per_page=10

Response:
{
  "data": [
    {
      "id": 1,
      "carrier_trip_id": 5,
      "package_request_id": 3,
      "carrier_id": 10,
      "shipper_id": 8,
      "match_status": "confirmed",
      "agreed_price": 45.00,
      "platform_fee": 4.50,
      "carrier_earnings": 40.50,
      "confirmed_at": "2024-03-10T14:00:00Z",
      "picked_up_at": null,
      "delivered_at": null,
      "delivery_code": null,
      "delivery_code_expires_at": null,
      "created_at": "2024-03-09T10:00:00Z",
      "carrier": { "id": 10, "name": "Jane Doe", ... },
      "shipper": { "id": 8, "name": "John Smith", ... },
      "trip": { ...trip object },
      "package": { ...package object }
    }
  ]
}
\`\`\`

#### Create Match (Request Delivery)
\`\`\`
POST /api/matches

Request Body (Carrier requesting to deliver):
{
  "carrier_trip_id": 5,
  "package_request_id": 3,
  "agreed_price": 45.00,
  "message": "I can pick up tomorrow morning"
}

Request Body (Shipper requesting carrier):
{
  "carrier_trip_id": 5,
  "package_request_id": 3,
  "agreed_price": 45.00
}

Response: { "data": { ...match object } }
\`\`\`

#### Accept Match
\`\`\`
PUT /api/matches/{id}/accept

Response: { "data": { ...match with status updated } }
\`\`\`

#### Confirm Match (triggers payment hold)
\`\`\`
PUT /api/matches/{id}/confirm

Response: { "data": { ...match with status "confirmed" } }
\`\`\`

#### Mark as Picked Up
\`\`\`
PUT /api/matches/{id}/pickup

Response: { "data": { ...match with status "picked_up", picked_up_at timestamp } }
\`\`\`

#### Generate Delivery Code (Shipper only)
\`\`\`
POST /api/matches/{id}/generate-delivery-code

Response:
{
  "data": {
    "delivery_code": "847291",
    "expires_at": "2024-03-15T15:30:00Z"
  }
}

Note: Code expires after 30 minutes
\`\`\`

#### Complete Delivery (Carrier enters code)
\`\`\`
PUT /api/matches/{id}/deliver

Request Body:
{
  "delivery_code": "847291"
}

Response: { "data": { ...match with status "delivered", delivered_at timestamp } }

Errors:
- 400: Invalid or expired delivery code
- 403: Not authorized (not the carrier)
\`\`\`

#### Match Status Flow
\`\`\`
carrier_requested → shipper_accepted → confirmed → picked_up → in_transit → delivered
       ↓                    ↓              ↓           ↓           ↓
  [cancelled]          [cancelled]    [cancelled]  [disputed]  [disputed]
\`\`\`

---

### Payments API

#### List Transactions
\`\`\`
GET /api/payments
Query params: ?status=completed&per_page=10

Response:
{
  "data": [
    {
      "id": 1,
      "delivery_match_id": 5,
      "shipper_id": 8,
      "carrier_id": 10,
      "total_amount": 45.00,
      "platform_fee": 4.50,
      "carrier_amount": 40.50,
      "tip_amount": 5.00,
      "tax_amount": 0,
      "status": "completed",
      "payout_status": "paid",
      "stripe_payment_intent_id": "pi_xxx",
      "stripe_transfer_id": "tr_xxx",
      "created_at": "2024-03-10T14:00:00Z"
    }
  ]
}
\`\`\`

#### Get Transaction
\`\`\`
GET /api/payments/{id}

Response: { "data": { ...transaction with shipper/carrier info } }
\`\`\`

#### Get Transaction for Match
\`\`\`
GET /api/matches/{id}/transaction

Response: { "data": { ...transaction } }
\`\`\`

#### Payment Status Flow
\`\`\`
pending → authorized → captured → completed
                          ↓
                      refunded
\`\`\`

---

### Users & Profiles API

#### Get Current User
\`\`\`
GET /api/auth/me

Response:
{
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "phone_verified_at": "2024-01-15T10:00:00Z",
    "verification_level": "verified",
    "avatar_url": "https://...",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
\`\`\`

#### Get/Update Profile
\`\`\`
GET /api/profile
PUT /api/profile

Request Body (PUT):
{
  "name": "John Doe",
  "bio": "Frequent traveler",
  "address": "123 Main St, Toronto, ON"
}
\`\`\`

#### Get Carrier Profile/Stats
\`\`\`
GET /api/carrier/profile
GET /api/carrier/stats

Stats Response:
{
  "data": {
    "trips": { "total_trips": 25, "active_trips": 3, "completed_trips": 20 },
    "deliveries": { "total_deliveries": 45, "successful_deliveries": 44 },
    "earnings": { "total_earnings": 1250.00, "pending_earnings": 85.00, "monthly_earnings": 320.00 },
    "rating": { "average_rating": 4.8, "total_reviews": 42 }
  }
}
\`\`\`

#### Get Shipper Stats
\`\`\`
GET /api/shipper/stats

Response:
{
  "data": {
    "packages": { "total_packages": 15, "delivered_packages": 12, "pending_packages": 2 },
    "spending": { "total_spent": 450.00, "monthly_spending": 85.00 }
  }
}
\`\`\`

---

### Chat/Messaging API

#### List Conversations
\`\`\`
GET /api/chat/conversations

Response:
{
  "data": [
    {
      "id": 1,
      "match_id": 5,
      "participants": [
        { "id": 8, "name": "John", "role": "shipper" },
        { "id": 10, "name": "Jane", "role": "carrier" }
      ],
      "last_message": { "content": "On my way!", "created_at": "..." },
      "unread_count": 2
    }
  ]
}
\`\`\`

#### Get/Send Messages
\`\`\`
GET /api/chat/conversations/{id}/messages
POST /api/chat/conversations/{id}/messages

Request Body (POST):
{
  "content": "I'll be there in 10 minutes"
}

Response: { "data": { "id": 1, "content": "...", "sender_id": 8, "created_at": "..." } }
\`\`\`

---

### Ratings API

#### Submit Rating
\`\`\`
POST /api/matches/{id}/rate

Request Body:
{
  "rating": 5,
  "comment": "Great communication, package arrived safely!",
  "tags": ["punctual", "friendly", "careful"]
}

rating: 1-5 (required)
comment: string (optional)
tags: array of strings (optional)
\`\`\`

#### Get Pending Reviews
\`\`\`
GET /api/ratings/pending

Response: { "data": [ ...matches awaiting your review ] }
\`\`\`

---

### Favorites API

#### List Favorite Carriers
\`\`\`
GET /api/favorites

Response: { "data": [ ...carrier profiles ] }
\`\`\`

#### Add to Favorites
\`\`\`
POST /api/favorites

Request Body:
{
  "carrier_id": 10
}

Requirements:
- Must have completed at least 1 delivery with carrier
- Carrier rating must be 3+ stars
- Maximum 20 favorites per user

Errors:
- 422: "Cannot favorite carrier rated below 3 stars"
- 422: "Maximum favorites limit reached"
\`\`\`

#### Remove from Favorites
\`\`\`
DELETE /api/favorites/{carrier_id}
\`\`\`

---

### Common Error Responses

\`\`\`
401 Unauthorized
{
  "message": "Unauthenticated."
}

403 Forbidden
{
  "message": "You do not have permission to perform this action."
}

404 Not Found
{
  "message": "Resource not found."
}

422 Validation Error
{
  "message": "The given data was invalid.",
  "errors": {
    "field_name": ["Error message for this field"]
  }
}

429 Too Many Requests
{
  "message": "Too many requests. Please try again later."
}

500 Server Error
{
  "message": "Server error. Please try again later."
}
\`\`\`

---

### Rate Limits

| Endpoint Type | Limit |
|---------------|-------|
| Authentication | 5 requests/minute |
| Read (GET) | 60 requests/minute |
| Write (POST/PUT/DELETE) | 30 requests/minute |
| File uploads | 10 requests/minute |

---

### Webhooks (if configured)

Events that can trigger webhooks:
- \`match.created\` - New match request
- \`match.accepted\` - Match accepted
- \`match.confirmed\` - Match confirmed, payment held
- \`match.picked_up\` - Package picked up
- \`match.delivered\` - Delivery completed
- \`payment.completed\` - Payment released to carrier
- \`rating.submitted\` - New rating submitted

Webhook payload format:
\`\`\`
{
  "event": "match.delivered",
  "timestamp": "2024-03-15T14:30:00Z",
  "data": { ...relevant object }
}
\`\`\`

---

## Matching Flow API Reference

### Match Statuses

| Status | Description | Who Can Transition |
|--------|-------------|-------------------|
| \`shipper_requested\` | Shipper requested carrier's trip | Shipper creates |
| \`carrier_requested\` | Carrier requested shipper's package | Carrier creates |
| \`shipper_accepted\` | Shipper accepted carrier's request | Shipper |
| \`carrier_accepted\` | Carrier accepted shipper's request | Carrier |
| \`shipper_declined\` | Shipper declined carrier's request | Shipper |
| \`carrier_declined\` | Carrier declined shipper's request | Carrier |
| \`confirmed\` | Both agreed, payment captured | System (auto-charge) |
| \`picked_up\` | Carrier picked up package | Carrier |
| \`in_transit\` | Package in transit | Carrier |
| \`delivered\` | Successfully delivered | Carrier |
| \`cancelled\` | Match was cancelled | Either party |

### Match API Endpoints

| Action | Endpoint | Method | Role | Description |
|--------|----------|--------|------|-------------|
| Create Request | \`/api/matches\` | POST | Shipper/Carrier | Create match request |
| Accept Shipper Request | \`/api/matches/{id}/accept-shipper-request\` | PUT | Carrier | Carrier accepts shipper's request |
| Decline Shipper Request | \`/api/matches/{id}/decline-shipper-request\` | PUT | Carrier | Carrier declines (can counter-offer) |
| Accept Carrier Request | \`/api/matches/{id}/accept-carrier-request\` | PUT | Shipper | Shipper accepts carrier's offer |
| Decline Carrier Request | \`/api/matches/{id}/decline-carrier-request\` | PUT | Shipper | Shipper declines (can counter-offer) |
| Confirm | \`/api/matches/{id}/confirm\` | PUT | Shipper | Triggers auto-charge payment |
| Pickup | \`/api/matches/{id}/pickup\` | PUT | Carrier | Mark as picked up |
| In Transit | \`/api/matches/{id}/transit\` | PUT | Carrier | Mark as in transit |
| Deliver | \`/api/matches/{id}/deliver\` | PUT | Carrier | Mark as delivered |
| Cancel | \`/api/matches/{id}\` | DELETE | Either | Cancel match (early stages) |

### Match Fetch Endpoints

| Action | Endpoint | Method | Description |
|--------|----------|--------|-------------|
| Get Shipper Matches | \`/api/matches/shipper\` | GET | Matches where user is shipper |
| Get Carrier Matches | \`/api/matches/carrier\` | GET | Matches where user is carrier |
| Get Carrier Pending | \`/api/matches/carrier/pending\` | GET | Pending requests for carrier |
| Get All Matches | \`/api/matches\` | GET | All user's matches |

### Match Creation Request

\`\`\`json
POST /api/matches
{
  "carrier_trip_id": 5,
  "package_request_id": 3,
  "agreed_price": 45.00,
  "message": "I can pick up tomorrow morning"
}
\`\`\`

### Counter-Offer Request

\`\`\`json
POST /api/matches
{
  "carrier_trip_id": 5,
  "package_request_id": 3,
  "offered_price": 70.00,
  "message": "Price reflects heavy package",
  "is_counter_offer": true,
  "original_price": 50.00
}
\`\`\`

### Match Response Object

\`\`\`json
{
  "id": 1,
  "carrier_trip_id": 5,
  "package_request_id": 3,
  "carrier_id": 10,
  "shipper_id": 8,
  "agreed_price": 45.00,
  "match_status": "confirmed",
  "initiated_by": "shipper",
  "confirmed_at": "2024-03-10T14:00:00Z",
  "picked_up_at": null,
  "delivered_at": null,
  "carrier_message": "On my way!",
  "shipper_message": "Thanks!",
  "pickup_confirmation_code": "847291",
  "delivery_confirmation_code": null,
  "carrier": { "id": 10, "name": "Jane Doe" },
  "shipper": { "id": 8, "name": "John Smith" },
  "carrier_trip": { ...trip object },
  "package_request": { ...package object },
  "transaction": { ...transaction object }
}
\`\`\`

### Confirm Match Response (with Auto-Charge)

\`\`\`json
{
  "message": "Match confirmed successfully",
  "data": { ...match object },
  "chat_conversation_id": 123,
  "auto_charge": {
    "queued": true,
    "shipper_has_default_payment_method": true
  }
}
\`\`\`

### Accept Request Response

\`\`\`json
{
  "message": "Request accepted",
  "data": { ...match object },
  "chat_conversation_id": 123,
  "auto_confirmed": false
}
\`\`\`
`;

// iOS Data Flow Architecture - MVVM + Functional Programming patterns
const IOS_DATA_FLOW_ARCHITECTURE = `
## iOS Data Flow Architecture

**A Comprehensive Guide to MVVM + Functional Programming Data Flow**

### Architecture Overview

The Pasabayan iOS app follows a **MVVM (Model-View-ViewModel)** architecture enhanced with **Functional Programming** principles, creating a unidirectional data flow with immutable state management.

#### Core Architecture Components

\`\`\`
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    View     │◄───│  ViewModel  │◄───│   Service   │◄───│    Model    │
│  (SwiftUI)  │    │(State Mgmt) │    │(Business)   │    │(Data Types) │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
   User Input         State Updates      API Calls         Data Structure
   Interactions       Pure Functions     Network Layer     Immutable Types
\`\`\`

#### Key Principles

- **Unidirectional Data Flow**: Data flows in one direction through the architecture
- **Immutable State**: All state changes create new instances rather than mutating existing ones
- **Pure Functions**: Business logic functions have no side effects
- **Feature-based architecture**: Each feature is self-contained

---

### Project Structure

\`\`\`
Pasabayan/
├── Features/
│   ├── Authentication/
│   │   ├── Models/          # User.swift, AuthResponses.swift
│   │   ├── ViewModels/      # AuthViewModel.swift
│   │   ├── Views/           # LoginView.swift, RegisterView.swift
│   │   └── Services/        # AuthService.swift, AuthValidationService.swift
│   │
│   ├── Bookings/
│   │   ├── Models/          # Booking.swift, MatchingModels.swift
│   │   ├── ViewModels/      # MatchingViewModel.swift
│   │   ├── Views/           # BookingDetailsView.swift
│   │   └── Services/        # BookingsAPIService.swift
│   │
│   ├── Packages/
│   │   ├── Models/          # PackageRequest.swift
│   │   ├── ViewModels/      # PackageViewModel.swift
│   │   ├── Views/           # PackageRequestView.swift
│   │   └── Services/        # PackagesAPIService.swift
│   │
│   ├── Trips/
│   │   ├── Models/          # Trip.swift
│   │   ├── ViewModels/      # BrowseTripsViewModel.swift
│   │   ├── Views/           # TripDetailsView.swift
│   │   └── Services/        # TripsAPIService.swift
│   │
│   ├── Payments/
│   │   ├── Models/          # PaymentModels.swift
│   │   ├── ViewModels/      # PaymentViewModel.swift
│   │   ├── Views/           # PaymentView.swift
│   │   └── Services/        # PaymentService.swift, StripeConnectService.swift
│   │
│   ├── Favorites/
│   │   ├── Models/          # FavoriteCarrier.swift
│   │   ├── ViewModels/      # FavoritesViewModel.swift
│   │   ├── Views/           # FavoritesListView.swift
│   │   └── Services/        # FavoritesAPIService.swift
│   │
│   ├── Chat/
│   │   ├── Models/          # ChatModels.swift
│   │   ├── ViewModels/      # ChatViewModel.swift
│   │   ├── Views/           # ChatView.swift
│   │   └── Services/        # ChatAPIService.swift
│   │
│   ├── Profile/
│   │   ├── ViewModels/      # ProfileViewModel.swift
│   │   ├── Views/           # ProfileView.swift
│   │   └── Services/        # ProfileAPIService.swift
│   │
│   ├── Verification/
│   │   ├── Models/          # PhoneVerificationModels.swift
│   │   ├── ViewModels/      # PhoneVerificationViewModel.swift
│   │   ├── Views/           # PhoneVerificationFlowView.swift
│   │   └── Services/        # VerificationAPIService.swift
│   │
│   ├── Notifications/
│   │   ├── Models/          # NotificationModels.swift
│   │   └── Services/        # NotificationAPIService.swift, NotificationManager.swift
│   │
│   └── Ratings/
│       ├── Models/          # Rating.swift
│       ├── ViewModels/      # RatingViewModel.swift
│       └── Services/        # RatingsAPIService.swift
│
├── Models/                  # Shared models (APIModels.swift, ValidationResult.swift)
├── Services/                # Core services (APIService.swift, KeychainHelper.swift)
└── DesignSystem/            # Design tokens and components
\`\`\`

---

### Data Flow Patterns

#### Complete Data Flow Cycle

\`\`\`mermaid
graph TD
    A[User Interaction] --> B[SwiftUI View]
    B --> C[ViewModel Action]
    C --> D[Pure Function Validation]
    D --> E{Validation Result}
    E -->|Valid| F[Service API Call]
    E -->|Invalid| G[Update State with Error]
    F --> H[Network Request]
    H --> I[API Response]
    I --> J[Model Parsing]
    J --> K[ViewModel State Update]
    K --> L[SwiftUI View Re-render]
    G --> L

    style A fill:#e1f5fe
    style L fill:#c8e6c9
    style F fill:#fff3e0
    style K fill:#f3e5f5
\`\`\`

#### State Update Flow

\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant V as SwiftUI View
    participant VM as ViewModel
    participant S as Service
    participant M as Model

    U->>V: Tap Button / Input Text
    V->>VM: Call Action Method

    Note over VM: Pure Function Validation
    VM->>VM: validateInput()

    alt Validation Success
        VM->>S: API Call Request
        S->>S: Network Operation
        S-->>VM: Response Data
        VM->>M: Parse to Model
        M-->>VM: Immutable Model Instance
        VM->>VM: updateState() - Pure Function
        VM-->>V: @Published State Change
        V->>V: SwiftUI Re-render
    else Validation Error
        VM->>VM: updateState() with Error
        VM-->>V: @Published Error State
        V->>V: Show Error UI
    end
\`\`\`

---

### State Management

The codebase uses **two ViewModel patterns** depending on complexity needs:

#### Pattern 1: Immutable State Structure (Complex Features)

Used for features with complex state and form handling (e.g., \`AuthViewModel\`):

\`\`\`swift
@MainActor
class AuthViewModel: ObservableObject {
    struct State: Equatable {
        let isAuthenticated: Bool
        let currentUser: User?
        let isLoading: Bool
        let errorMessage: String?
        let validationErrors: [String: ValidationResult]
        let formData: FormData

        static let initial = State(
            isAuthenticated: false,
            currentUser: nil,
            isLoading: false,
            errorMessage: nil,
            validationErrors: [:],
            formData: FormData.initial
        )

        struct FormData: Equatable {
            let email: String
            let password: String
            let confirmPassword: String
            let name: String
            let phone: String

            static let initial = FormData(
                email: "", password: "", confirmPassword: "", name: "", phone: ""
            )
        }
    }

    @Published private(set) var state = State.initial

    // Pure function for state updates
    private func updateState(_ transform: (State) -> State) {
        state = transform(state)
    }
}
\`\`\`

#### Pattern 2: Simple Published Properties (Standard Features)

Used for features with simpler state (e.g., \`MatchingViewModel\`, \`ProfileViewModel\`):

\`\`\`swift
class MatchingViewModel: ObservableObject {
    @Published var matches: [DeliveryMatch] = []
    @Published var isLoading: Bool = false
    @Published var errorMessage: String?
    @Published var matchAccepted: Bool = false

    private let apiService: BookingsAPIServicing
    private var cancellables = Set<AnyCancellable>()

    init(apiService: BookingsAPIServicing = BookingsAPIService.shared) {
        self.apiService = apiService
    }
}
\`\`\`

#### When to Use Each Pattern

| Pattern | Use When | Examples |
|---------|----------|----------|
| Immutable State | Complex forms, validation, nested state | \`AuthViewModel\` |
| Simple Published | List data, simple loading states | \`MatchingViewModel\`, \`ProfileViewModel\`, \`FavoritesViewModel\` |

---

### Feature-Specific Flows

#### Booking/Matching Flow

\`\`\`mermaid
stateDiagram-v2
    [*] --> pending: Match Created
    pending --> carrier_requested: Carrier Offers
    pending --> shipper_requested: Shipper Requests

    carrier_requested --> shipper_accepted: Shipper Accepts
    carrier_requested --> shipper_declined: Shipper Declines

    shipper_requested --> carrier_accepted: Carrier Accepts
    shipper_requested --> carrier_declined: Carrier Declines

    shipper_accepted --> confirmed: Both Agree + Payment
    carrier_accepted --> confirmed: Both Agree + Payment

    confirmed --> picked_up: Pickup Code Verified
    picked_up --> in_transit: Carrier Starts Transit
    in_transit --> delivered: Delivery Code Verified

    delivered --> [*]: Complete
    shipper_declined --> [*]: Declined
    carrier_declined --> [*]: Declined
\`\`\`

**Key Components:**
- \`MatchingViewModel\` - Manages match state and API calls
- \`BookingsAPIService\` - API methods for match operations
- \`DeliveryMatch\` - Model with computed properties for status logic

#### Payment Flow (Auto-Charge)

\`\`\`mermaid
sequenceDiagram
    participant S as Shipper
    participant VM as PaymentViewModel
    participant PS as PaymentService
    participant Stripe as Stripe API
    participant API as Backend API

    S->>VM: Confirm booking
    VM->>PS: processAutoCharge(matchId, amount)
    PS->>API: POST /api/payments/create-intent
    API-->>PS: PaymentIntent (client_secret)
    PS->>Stripe: Confirm PaymentIntent
    Stripe-->>PS: Payment succeeded
    PS->>API: POST /api/payments/confirm
    API-->>PS: Transaction record
    PS-->>VM: Payment complete
    VM-->>S: Show success, booking confirmed
\`\`\`

**Key Components:**
- \`PaymentViewModel\` - Orchestrates payment flow
- \`PaymentService\` - Stripe SDK integration
- \`StripeConfigService\` - Publishable key management

---

### API Service Layer Pattern

All feature services extend \`BaseFeatureAPIService\`:

\`\`\`swift
// Base class provides common functionality
class BaseFeatureAPIService {
    let apiService: APIService

    init(apiService: APIService = APIService.shared) {
        self.apiService = apiService
    }

    func makeRequest<T: Decodable>(
        endpoint: String,
        method: HTTPMethod,
        body: Encodable? = nil,
        responseType: T.Type
    ) -> AnyPublisher<T, APIError>
}

// Feature service extends base
class BookingsAPIService: BaseFeatureAPIService {
    static let shared = BookingsAPIService()

    func getCarrierMatches() -> AnyPublisher<PaginatedResponse<DeliveryMatch>, APIError> {
        makeRequest(
            endpoint: "/matches/carrier",
            method: .GET,
            responseType: PaginatedResponse<DeliveryMatch>.self
        )
    }

    func acceptMatch(id: Int) -> AnyPublisher<DeliveryMatch, APIError> {
        makeRequest(
            endpoint: "/matches/\\(id)/accept",
            method: .PUT,
            responseType: MatchResponse.self
        )
        .map(\\.data)
        .eraseToAnyPublisher()
    }
}
\`\`\`

---

### Best Practices

#### State Management
\`\`\`swift
// ✅ DO: Use immutable state with functional updates
private func updateState(_ transform: (State) -> State) {
    state = transform(state)
}

// ❌ DON'T: Mutate state directly
state.isLoading = true  // Avoid this

// ✅ DO: Compose validation functions
let result = emailValidation.combine(with: passwordValidation)
\`\`\`

#### Component Communication
\`\`\`swift
// ✅ DO: Use callbacks for child-to-parent communication
struct EmailField: View {
    let value: String
    let validationResult: ValidationResult?
    let onChange: (String) -> Void  // Callback

    var body: some View {
        TextField("Email", text: .constant(value))
            .onChange(of: value) { newValue in
                onChange(newValue)  // Pure callback
            }
    }
}

// ✅ DO: Use @StateObject for view model ownership
struct AuthView: View {
    @StateObject private var viewModel = AuthViewModel()

    var body: some View {
        EmailField(
            value: viewModel.state.formData.email,
            validationResult: viewModel.state.validationErrors["email"],
            onChange: viewModel.updateEmail
        )
    }
}
\`\`\`

---

### Key Files by Feature

| Feature | ViewModel | Service | Key Model |
|---------|-----------|---------|-----------|
| Auth | \`AuthViewModel.swift\` | \`AuthService.swift\` | \`User.swift\` |
| Bookings | \`MatchingViewModel.swift\` | \`BookingsAPIService.swift\` | \`Booking.swift\`, \`DeliveryMatch\` |
| Packages | \`PackageViewModel.swift\` | \`PackagesAPIService.swift\` | \`PackageRequest.swift\` |
| Trips | \`BrowseTripsViewModel.swift\` | \`TripsAPIService.swift\` | \`Trip.swift\` |
| Payments | \`PaymentViewModel.swift\` | \`PaymentService.swift\` | \`PaymentModels.swift\` |
| Profile | \`ProfileViewModel.swift\` | \`ProfileAPIService.swift\` | \`UserProfile\` |
| Chat | \`ChatViewModel.swift\` | \`ChatAPIService.swift\` | \`ChatModels.swift\` |
| Favorites | \`FavoritesViewModel.swift\` | \`FavoritesAPIService.swift\` | \`FavoriteCarrier.swift\` |

### Key Takeaways

1. **Data flows unidirectionally** from Models → Services → ViewModels → Views
2. **State is always immutable** and updated through pure functions
3. **Side effects are isolated** to service layers and async functions
4. **Components communicate** through props down, callbacks up pattern
5. **Validation is pure** and composable across the application
6. **Error handling is comprehensive** with user-friendly messages and recovery options
`;

// QA Testing Guide - Payment flows, test cards, test scenarios
const QA_TESTING_GUIDE = `
## Payment Process Flow & QA Testing Guide

### Overview

Pasabayan uses Stripe for payment processing with:
- **Stripe PaymentSheet** - For shipper payments (card, Apple Pay)
- **Stripe Connect Express** - For carrier payouts

---

### Shipper Payment Flow

\`\`\`
1. BOOKING CONFIRMED          2. PAYMENT INITIATED
┌──────────────────┐          ┌──────────────────┐
│ DeliveryMatch    │          │ POST /payments   │
│ agreedPrice: $50 │ ───────▶ │ deliveryMatchId  │
│ status: confirmed│          │ amount: 50.00    │
└──────────────────┘          │ currency: cad    │
                              └────────┬─────────┘
                                       │
3. PAYMENT SHEET                       ▼
┌──────────────────┐          4. STRIPE RETURNS
│ PaymentSheet     │          ┌──────────────────┐
│ • Apple Pay      │ ◀─────── │ • clientSecret   │
│ • Saved Cards    │          │ • customerId     │
└────────┬─────────┘          └──────────────────┘
         │
         ▼
4. PAYMENT RESULT
┌──────────────────┐
│ .completed ──────│───▶ Transaction: pending → captured → completed
│ .cancelled ──────│───▶ Transaction: cancelled
│ .failed ─────────│───▶ Transaction: failed
└──────────────────┘
\`\`\`

### Carrier Payout Flow

\`\`\`
1. ONBOARDING (One-time)      2. PAYOUT PROCESSING
┌──────────────────┐          ┌──────────────────┐
│ POST /stripe/    │          │ After delivery   │
│ connect/onboard  │          │ completed:       │
│                  │          │ Auto-transfer    │
└────────┬─────────┘          └──────────────────┘
         ▼
┌──────────────────┐          3. CARRIER DASHBOARD
│ Stripe Express   │          ┌──────────────────┐
│ • Identity       │          │ GET /stripe/     │
│ • Bank Account   │          │ connect/dashboard│
│ • Tax Info       │          │                  │
└──────────────────┘          │ View earnings,   │
                              │ payouts, reports │
                              └──────────────────┘
\`\`\`

---

### Transaction Status Flow

| Status | Description | Next States |
|--------|-------------|-------------|
| pending | Payment initiated | authorized, cancelled, failed |
| authorized | Card authorized | captured, cancelled |
| captured | Funds captured | completed, refunded |
| completed | Payout sent to carrier | refunded (partial) |
| refunded | Full/partial refund issued | - |
| cancelled | Payment cancelled | - |
| failed | Payment declined | - |

---

### Amount Breakdown Example

\`\`\`
Agreed Delivery Price:  $50.00 CAD
+ Tip (optional):       $ 5.00 CAD
─────────────────────────────────
Shipper Pays:           $55.00 CAD

Platform Fee (10%):     -$ 5.00 CAD
─────────────────────────────────
Carrier Receives:       $50.00 CAD ($45 delivery + $5 tip)
\`\`\`

---

### Test Scenarios

#### 1. Happy Path - Successful Payment

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create booking with agreed price $50 | DeliveryMatch created, status: confirmed |
| 2 | Initiate payment | PaymentSheet appears |
| 3 | Use test card 4242 4242 4242 4242 | Payment succeeds |
| 4 | Complete payment | Transaction created |
| 5 | Check transaction status | pending → captured → completed |
| 6 | View receipt | Receipt shows correct amounts |
| 7 | Check as Carrier | Transaction visible in history |

#### 2. Payment Failures

| Test Case | Test Card | Expected |
|-----------|-----------|----------|
| Declined | 4000000000000002 | "Card declined" |
| Insufficient Funds | 4000000000009995 | "Insufficient funds" |
| Invalid CVC | 4000000000000127 | "Invalid CVC" |
| Processing Error | 4000000000000119 | "Processing error" |

#### 3. Payment Cancellation

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Initiate payment | PaymentSheet appears |
| 2 | Tap "X" or swipe down | Sheet dismisses |
| 3 | Check transaction | Status: cancelled or no transaction |
| 4 | Retry payment | Can initiate new payment |

#### 4. Apple Pay (Device Required)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Initiate payment on device with Apple Pay | Apple Pay option visible |
| 2 | Select Apple Pay | Apple Pay sheet appears |
| 3 | Authenticate with Face ID/Touch ID | Payment processes |
| 4 | Check transaction | Status: completed |
| 5 | Check receipt | Shows Apple Pay as method |

#### 5. Saved Payment Methods

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Complete first payment with "Save card" | Card saved |
| 2 | Start second payment | Saved card appears as option |
| 3 | Select saved card | Payment uses saved card |

#### 6. Refund Request

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Go to completed transaction | "Request Refund" visible |
| 2 | Enter reason < 10 chars | Validation error |
| 3 | Enter reason ≥ 10 chars | Form submits |
| 4 | Submit refund request | Status: pending |
| 5 | Admin approves | Status: refunded |

#### 7. Carrier Stripe Connect Onboarding

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Tap "Set up payouts" | Onboarding starts |
| 2 | Follow Stripe link | Redirects to Stripe Express |
| 3 | Complete Stripe form | Identity verified |
| 4 | Return to app | Status: onboardingComplete: true |
| 5 | Check Connect status | payoutsEnabled: true |
| 6 | Access Dashboard | Can view earnings |

#### 8. Tip After Delivery

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Complete delivery | "Add Tip" option visible |
| 2 | Enter tip amount | Tip amount shown |
| 3 | Confirm tip payment | New transaction for tip |
| 4 | Check Carrier earnings | Tip included in total |

---

### API Endpoints Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /payments | Initiate payment |
| GET | /payments/{id} | Get payment status |
| POST | /payments/{id}/cancel | Cancel payment |
| POST | /payments/{id}/refund | Request refund |
| POST | /payments/{id}/tip | Add tip |
| POST | /stripe/connect/onboard | Start carrier onboarding |
| GET | /stripe/connect/status | Check onboarding status |
| GET | /stripe/connect/dashboard | Get dashboard link |
| GET | /receipts | List user's receipts |
| GET | /receipts/{transactionId} | Get single receipt |

---

### Test Cards (Stripe Test Mode)

| Scenario | Card Number | Expiry | CVC |
|----------|-------------|--------|-----|
| Success | 4242 4242 4242 4242 | Any future | Any 3 digits |
| Declined | 4000 0000 0000 0002 | Any future | Any 3 digits |
| Insufficient Funds | 4000 0000 0000 9995 | Any future | Any 3 digits |
| 3D Secure Required | 4000 0000 0000 3220 | Any future | Any 3 digits |
| Lost Card | 4000 0000 0000 9987 | Any future | Any 3 digits |
| Expired Card | 4000 0000 0000 0069 | Any future | Any 3 digits |

**Example test card details (copy-paste ready):**
- Card: \`4242 4242 4242 4242\`
- MM/YY: \`12/29\` (any future date works)
- CVC: \`123\` (any 3 digits)
- ZIP: \`12345\` (any valid format - US: 12345, Canadian: M5V 1J1)

---

### Edge Cases to Test

| Category | Test Case | Expected Behavior |
|----------|-----------|-------------------|
| Validation | Amount = $0 | Error: Invalid amount |
| Validation | Amount > $10,000 | Error or flag for review |
| Validation | Negative amount | Error: Invalid amount |
| Network | Payment during poor connection | Retry mechanism, clear error |
| Network | Timeout (3G simulation) | Loading indicator, timeout handling |
| Concurrency | Double-tap Pay button | Only one payment created |
| State | App backgrounded during payment | Resumes correctly |
| State | App killed during 3DS auth | Payment status checked on return |
| Auth | Token expires during payment | Refresh and retry |

---

### Debug Logging (Check Xcode Console)

\`\`\`
🔵 PaymentService: Initiating payment
   - matchId: 456
   - amount: 50.00
   - currency: CAD

🟢 PaymentService: PaymentSheet presented

🟡 PaymentService: Payment completed
   - status: .completed
   - paymentIntentId: pi_xxx

🔵 TransactionService: Fetching transaction
   - transactionId: 123
   - role: shipper
\`\`\`

---

### Environment Setup

#### Test Mode Verification

1. Check console for: ⚠️ StripeConfigService: Using SANDBOX/TEST mode
2. Stripe key should start with \`pk_test_\`
3. All test card numbers work

#### Live Mode Verification (Production Only)

1. Check console for: 🟢 StripeConfigService: Using LIVE mode
2. Stripe key should start with \`pk_live_\`
3. Only real cards work

---

### QA Sign-Off Checklist

**Payment Processing:**
- [ ] All transaction states transition correctly
- [ ] Payment amounts calculated accurately
- [ ] Platform fee deducted correctly (10%)
- [ ] Tips added to carrier total correctly

**Stripe Integration:**
- [ ] Stripe config loads (test/live mode)
- [ ] PaymentSheet displays all options
- [ ] Apple Pay works (on physical device)
- [ ] Saved cards work
- [ ] 3D Secure authentication works
- [ ] Refund requests submit correctly

**Carrier Payouts:**
- [ ] Carrier can complete Stripe Connect onboarding
- [ ] Carrier can access payout dashboard

**UI/UX:**
- [ ] Receipts generated for all transactions
- [ ] Transaction history filters work
- [ ] All error messages are user-friendly

**Error Handling:**
- [ ] Network failures handled gracefully
- [ ] No duplicate payments on double-tap
- [ ] App handles background/foreground during payment

---

## Auto-Charge Payment Flow

### What is Auto-Charge?

When a **Shipper** confirms a match with a carrier, the system automatically charges their default payment method. This eliminates the need for a separate payment step after matching.

### Auto-Charge UI Flow

\`\`\`
Profile Tab → Payment Methods → Add Card
    └── Stripe Payment Sheet appears
        └── Enter card details (4242 4242 4242 4242)
            └── Card saved as default

Matches Tab → Pending Confirmation booking → Tap "Confirm Booking"
    │
    ├── IF has saved card:
    │   └── Dialog shows: "Card ****1234 will be charged $XX"
    │       └── Tap "Confirm & Pay" → Card auto-charged
    │
    └── IF no saved card:
        └── Prompt: "Add payment method" → Add card first
\`\`\`

### Auto-Charge Test Scenarios

| Test | Steps | Expected |
|------|-------|----------|
| Happy Path | Has card → Confirm booking | Auto-charged, status "Confirmed & Paid" |
| No Card | No saved card → Confirm | Prompted to add card first |
| Declined Card | Use 4000000000000002 → Confirm | "Payment Failed" error, can retry |
| Different Card | Ready to confirm → "Use different card" | Can select/add another card |

### Auto-Charge Confirmation Sheet States

| State | Icon | What's Shown |
|-------|------|--------------|
| Loading | Spinner | "Checking payment method..." |
| No Card | Orange card (60pt) | "Payment Method Required" + Add button |
| Ready | Green shield (60pt) | Price + Card info + "Confirm & Pay" |
| Processing | Spinner | "Confirming match..." |
| Success | Green check (80pt) | "Match Confirmed!" auto-dismisses |
| Error | Red triangle (60pt) | Error message + "Try Again" |

---

## Carrier Payout Setup (Stripe Connect)

### Payout Setup UI Flow

\`\`\`
Profile Tab → Payout Setup
    │
    ├── NOT SET UP:
    │   └── Blue card icon → "Set Up Payouts"
    │       └── Opens Stripe Express in Safari
    │           └── Complete: personal info, ID, bank, tax
    │
    ├── INCOMPLETE:
    │   └── Orange clock icon → "Setup Incomplete"
    │       └── "Continue Setup" resumes where left off
    │
    └── COMPLETE:
        └── Green check → "Payouts Active"
            └── "View Stripe Dashboard" button
\`\`\`

### Payout Status States

| Status | Badge | Icon | Meaning |
|--------|-------|------|---------|
| null | Gray "Awaiting Delivery" | minus.circle | No payout initiated |
| pending | Gray "Pending" | hourglass | Queued for processing |
| processing | Orange "Processing" | clock | Transfer in progress |
| completed | Green "Paid" | checkmark.circle.fill | Money deposited |
| failed | Red "Failed" | exclamationmark.circle.fill | Transfer failed |

### Test Bank Account (Stripe Test Mode)

\`\`\`
Routing Number: 110000000
Account Number: 000123456789
SSN (test): 000-00-0000
\`\`\`

---

## Minimum Delivery Price

### Overview

Minimum delivery price: **$5.00 CAD** (configurable via API)

- **Client-side**: Immediate validation in UI
- **Server-side**: API returns 422 if price below minimum

### Where Minimum Applies

| Screen | Minimum Applies? | Notes |
|--------|------------------|-------|
| Shipper booking trip (MatchCreationView) | YES | Must be ≥ $5.00 |
| Carrier proposing price (RequestToCarrySheet) | NO | Can propose $0 for negotiation |
| Trip creation (price per kg) | NO | Rate not total price |

### Test Cases

| Input | Expected |
|-------|----------|
| Empty | Error: "Price must be at least CA$5.00" |
| $0 | Error |
| $4.99 | Error |
| $5.00 | Valid ✓ |
| $15.00 | Valid ✓ |

### API Error Response (if bypassed)

\`\`\`json
{
  "success": false,
  "error": {
    "code": "PRICE_BELOW_MINIMUM",
    "message": "Price must be at least $5.00",
    "details": { "min_price": 5.00, "provided_price": 2.00 }
  }
}
\`\`\`
Status: 422

---

## Counter-Offer Flow

### How Counter-Offers Work

\`\`\`
Shipper requests booking at $50
    │
    ▼
Carrier receives request → Taps "Decline"
    │
    ▼
Counter-Offer Prompt appears:
    ├── Shows declined price (crossed out)
    ├── Shows carrier's rate reference
    ├── Enter counter amount (e.g., $70)
    └── Tap "Send Offer"
        │
        ▼
Shipper receives notification → Can:
    ├── Accept $70 → Proceeds to Confirm & Pay
    ├── Decline → Booking cancelled
    └── Counter back (e.g., $60) → Back to carrier
\`\`\`

### Counter-Offer Test Scenarios

| Scenario | Expected |
|----------|----------|
| Carrier counters $70 | Shipper sees banner, can accept/decline/counter |
| Shipper accepts | Price updated to $70, auto-charge on confirm |
| Shipper counters $60 | Carrier notified, status "Awaiting Response" |
| Final acceptance | Agreed price used for auto-charge |

---

## General App Testing

### Authentication Test Cases

| Test | Steps | Expected |
|------|-------|----------|
| Google Sign-In | Tap Google → Select account | Profile populated, dashboard shown |
| Facebook Sign-In | Tap Facebook → Login | Profile populated |
| Apple Sign-In | Tap Apple → Face ID | Account created |
| Logout | Profile → Logout | Returns to login, tokens cleared |

### Phone Verification

| Test | Steps | Expected |
|------|-------|----------|
| Send OTP | Enter phone → Send Code | 6-digit code sent via SMS |
| Verify OTP | Enter code | Auto-verifies, badge shows |
| Resend OTP | Wait 30s → Resend | New code sent |
| Invalid OTP | Enter wrong code | "Invalid code" error |

### Carrier Trip Creation

| Field | Validation |
|-------|------------|
| Origin/Destination | Required, country picker |
| Departure date | Must be in future |
| Available capacity | Positive number (kg) |
| Price per kg | Positive number |

### Shipper Package Creation

| Field | Validation |
|-------|------------|
| Pickup/Delivery address | Required with city |
| Weight | Positive number (kg) |
| Package type | documents, electronics, clothing, fragile, food, other |
| Urgency | flexible, normal, urgent, same_day |

### Match Status Flow

\`\`\`
carrier_requested/shipper_requested
    │
    ▼ (other party accepts)
accepted
    │
    ▼ (both confirm, payment held)
confirmed
    │
    ▼ (carrier picks up)
picked_up
    │
    ▼ (in transit)
in_transit
    │
    ▼ (delivery code entered)
delivered
\`\`\`

### Delivery Code Flow

1. Shipper generates 6-digit code in app
2. Code expires after 30 minutes
3. Carrier enters code to complete delivery
4. Payment released to carrier

---

## Match Status Lifecycle (Complete Flow)

\`\`\`
                    ┌─────────────────────────────────────────────────────────────┐
                    │                     MATCH LIFECYCLE                          │
                    └─────────────────────────────────────────────────────────────┘
                                              │
                    ┌─────────────────────────┴─────────────────────────┐
                    │                                                   │
                    ▼                                                   ▼
        ┌───────────────────────┐                       ┌───────────────────────┐
        │  SHIPPER_REQUESTED    │                       │  CARRIER_REQUESTED    │
        │                       │                       │                       │
        │  Shipper found a trip │                       │  Carrier found package│
        │  and requested it     │                       │  and offered to carry │
        └───────────┬───────────┘                       └───────────┬───────────┘
                    │                                               │
          ┌─────────┴─────────┐                           ┌─────────┴─────────┐
          ▼                   ▼                           ▼                   ▼
┌──────────────────┐ ┌──────────────────┐    ┌──────────────────┐ ┌──────────────────┐
│ CARRIER_ACCEPTED │ │ CARRIER_DECLINED │    │ SHIPPER_ACCEPTED │ │ SHIPPER_DECLINED │
│                  │ │                  │    │                  │ │                  │
│ Carrier said yes │ │ Carrier said no  │    │ Shipper said yes │ │ Shipper said no  │
│ to shipper req   │ │ (can counter)    │    │ to carrier offer │ │ (can counter)    │
└────────┬─────────┘ └──────────────────┘    └────────┬─────────┘ └──────────────────┘
         │                                            │
         └──────────────────┬─────────────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │      CONFIRMED        │
                │                       │
                │  Both parties agreed  │
                │  Payment auto-charged │
                │  Chat room created    │
                └───────────┬───────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │      PICKED_UP        │
                │                       │
                │  Carrier has package  │
                │  Location tracking ON │
                └───────────┬───────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │      IN_TRANSIT       │
                │                       │
                │  En route to dest     │
                │  Real-time tracking   │
                └───────────┬───────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │      DELIVERED        │
                │                       │
                │  Code verified ✓      │
                │  Payment released     │
                │  Ratings enabled      │
                └───────────────────────┘
\`\`\`

---

## User Journey Testing

### Shipper Journey (Step-by-Step)

| Step | Action | API Call | Expected UI State |
|------|--------|----------|-------------------|
| 1 | Browse available trips | GET /api/trips/available | Trip list with filters |
| 2 | View trip details | GET /api/trips/{id} | Trip card with carrier info |
| 3 | Request to ship | POST /api/matches | MatchCreationView → success |
| 4 | Wait for carrier response | - | Status: "shipper_requested" |
| 5 | Carrier accepts | (webhook/poll) | Status: "carrier_accepted" |
| 6 | Confirm booking | PUT /api/matches/{id}/confirm | Auto-charge triggers |
| 7 | Track pickup | GET /api/matches/{id} | Status: "confirmed" → "picked_up" |
| 8 | Track transit | GET /api/matches/{id} | Map shows carrier location |
| 9 | Generate delivery code | POST /api/matches/{id}/generate-delivery-code | 6-digit code displayed |
| 10 | Delivery complete | (carrier enters code) | Status: "delivered" |
| 11 | Rate carrier | POST /api/matches/{id}/rate | Rating submitted |

### Carrier Journey (Step-by-Step)

| Step | Action | API Call | Expected UI State |
|------|--------|----------|-------------------|
| 1 | Create trip | POST /api/trips | Trip creation success |
| 2 | Browse package requests | GET /api/packages/available | Package list with filters |
| 3 | Offer to deliver | POST /api/matches | Match created |
| 4 | Wait for shipper response | - | Status: "carrier_requested" |
| 5 | Shipper accepts | (webhook/poll) | Status: "shipper_accepted" |
| 6 | Shipper confirms & pays | (webhook/poll) | Status: "confirmed" |
| 7 | Pick up package | PUT /api/matches/{id}/pickup | Status: "picked_up" |
| 8 | Start transit | PUT /api/matches/{id}/transit | Status: "in_transit" |
| 9 | Get delivery code from shipper | (in-person handoff) | - |
| 10 | Enter delivery code | PUT /api/matches/{id}/deliver | Status: "delivered" |
| 11 | Rate shipper | POST /api/matches/{id}/rate | Rating submitted |
| 12 | Check earnings | GET /api/carrier/stats | Payout shows in dashboard |

### Bidirectional Flow Testing

| Scenario | Who Initiates | Who Accepts | Who Confirms |
|----------|---------------|-------------|--------------|
| Shipper finds trip | Shipper | Carrier | Shipper |
| Carrier finds package | Carrier | Shipper | Shipper |
| Counter-offer (shipper started) | Shipper → Carrier counters | Shipper accepts counter | Shipper |
| Counter-offer (carrier started) | Carrier → Shipper counters | Carrier accepts counter | Shipper |

---

## Match Status Testing Scenarios

### Status Transition Tests

| From Status | To Status | Action | Who | Test Steps |
|-------------|-----------|--------|-----|------------|
| (none) | shipper_requested | Create match | Shipper | POST /api/matches with trip_id, package_id |
| (none) | carrier_requested | Create match | Carrier | POST /api/matches with trip_id, package_id |
| shipper_requested | carrier_accepted | Accept | Carrier | PUT /api/matches/{id}/accept-shipper-request |
| shipper_requested | carrier_declined | Decline | Carrier | PUT /api/matches/{id}/decline-shipper-request |
| carrier_requested | shipper_accepted | Accept | Shipper | PUT /api/matches/{id}/accept-carrier-request |
| carrier_requested | shipper_declined | Decline | Shipper | PUT /api/matches/{id}/decline-carrier-request |
| carrier_accepted | confirmed | Confirm | Shipper | PUT /api/matches/{id}/confirm |
| shipper_accepted | confirmed | Confirm | Shipper | PUT /api/matches/{id}/confirm |
| confirmed | picked_up | Pickup | Carrier | PUT /api/matches/{id}/pickup |
| picked_up | in_transit | Transit | Carrier | PUT /api/matches/{id}/transit |
| in_transit | delivered | Deliver | Carrier | PUT /api/matches/{id}/deliver + delivery_code |

### Invalid Transition Tests

| Current Status | Invalid Action | Expected Error |
|----------------|----------------|----------------|
| shipper_requested | Shipper tries to accept own request | 403 Forbidden |
| carrier_requested | Carrier tries to accept own request | 403 Forbidden |
| confirmed | Shipper tries to pickup | 403 Forbidden |
| picked_up | Shipper tries to mark in_transit | 403 Forbidden |
| delivered | Any status change | 400 Invalid transition |

### Cancellation Tests

| Status | Can Cancel? | Who | Refund? |
|--------|-------------|-----|---------|
| shipper_requested | Yes | Either | N/A (no payment) |
| carrier_requested | Yes | Either | N/A (no payment) |
| carrier_accepted | Yes | Either | N/A (no payment) |
| shipper_accepted | Yes | Either | N/A (no payment) |
| confirmed | Yes (fees may apply) | Either | Partial or full |
| picked_up | No (escalate to support) | Support only | Case by case |
| in_transit | No (escalate to support) | Support only | Case by case |
| delivered | No | - | - |

---

## Test Users Setup

### Recommended Test Accounts

| Role | Email Pattern | Purpose |
|------|---------------|---------|
| Shipper 1 | shipper1@test.pasabayan.com | Happy path testing |
| Shipper 2 | shipper2@test.pasabayan.com | Counter-offer testing |
| Carrier 1 | carrier1@test.pasabayan.com | Happy path testing |
| Carrier 2 | carrier2@test.pasabayan.com | Declined requests |
| Carrier (no Stripe) | carrier-nostripe@test.pasabayan.com | Payout setup testing |

### Test Data Checklist

- [ ] Shipper has verified phone
- [ ] Shipper has saved payment method (use 4242 4242 4242 4242)
- [ ] Carrier has verified phone
- [ ] Carrier has completed Stripe Connect onboarding
- [ ] At least 1 active trip (Toronto → Montreal)
- [ ] At least 1 pending package request (Toronto → Montreal)

---

## Matching Testing Guide - UI Flow

### Overview

This guide covers the complete booking/matching flow between Shippers and Carriers. Follow the screen paths and verify expected results at each step.

**Two-Way Matching System:**
- **Shipper-Initiated**: Shipper finds a carrier's trip and requests to book space
- **Carrier-Initiated**: Carrier finds a shipper's package and offers to carry it

Both flows require acceptance from the other party before the booking is confirmed.

---

### Complete Matching Flow Diagram (Shipper-Initiated)

\`\`\`
1. Home Tab (Shipper Mode)
       │
       ▼
2. Browse Available Trips
       │
       ▼
3. Tap Trip Card
       │
       ▼
4. Trip Details Screen
       │
       ▼
5. Tap "Request to Book"
       │
       ▼
6. Select Package & Set Price ──────────▶ 7. Carrier Receives Notification
       │                                         │
       ▼                                         ▼
8. Request Sent                           9. Matches Tab → See Request
   "Awaiting Response"                           │
                                                 ▼
                                          10. Tap Request Card
                                                 │
                                                 ▼
                                          11. Request Details
                                                 │
                                          ┌──────┴──────┐
                                          │             │
                                          ▼             ▼
                                       ACCEPT        DECLINE
                                          │             │
                                          │        Counter-Offer?
                                          ▼             ▼
12. Shipper Notified ◀──────────── "Accepted"    "Declined" or
       │                                          "Counter-Offer Sent"
       ▼
13. Matches Tab → "Pending Confirmation"
       │
       ▼
14. Tap "Confirm Booking"
       │
       ▼
15. Payment Auto-Charged
       │
       ▼
16. Status: "Confirmed & Paid"
\`\`\`

---

### Carrier-Initiated Flow Diagram

\`\`\`
1. Home Tab (Carrier Mode)
       │
       ▼
2. Tap "Browse Packages" or "Requests" Tab
       │
       ▼
3. Browse Available Packages
       │
       ▼
4. Tap Package Card
       │
       ▼
5. Package Details Screen
       │
       ▼
6. Tap "Make Offer" ────────────────────▶ 7. Shipper Receives Notification
       │                                         │
       ▼                                         ▼
7. Enter Price & Message                  8. Matches Tab → See Offer
       │                                         │
       ▼                                         ▼
8. Offer Sent                             9. Tap Offer Card
                                                 │
                                                 ▼
                                          10. Offer Details
                                                 │
                                          ┌──────┴──────┐
                                          │             │
                                          ▼             ▼
                                       ACCEPT        DECLINE
                                          │             │
                                          │        Counter-Offer?
                                          ▼             ▼
11. Carrier Notified ◀──────────── "Accepted"    "Declined" or
       │                                          "Counter-Offer"
       ▼
12. Matches Tab → Confirm & Continue to Delivery
\`\`\`

---

### Delivery Progress Flow

\`\`\`
Matches Tab → Booking Card
       │
       ▼
Status: "Confirmed"
       │
       ▼
Tap "Mark Pickup" ──────────────────────▶ Status: "Picked Up"
       │
       ▼
Status: "Picked Up"
       │
       ▼
Tap "Start Transit" ────────────────────▶ Status: "In Transit"
       │                                  (Can track on map)
       ▼
Status: "In Transit"
       │
       ▼
Tap "Mark Delivered" ───────────────────▶ Status: "Delivered"
       │                                  (Prompted to rate)
       ▼
Upload Delivery Photo
       │
       ▼
Status: "Delivered"
(Earnings added to balance)
\`\`\`

---

### Screen-by-Screen Navigation Paths

#### Flow A: Shipper Requests a Trip

\`\`\`
Home Tab (Shipper Mode)
    └── See "Available Trips" section
        └── Tap "See All" or scroll through trips
            └── Trips List Screen
                └── Tap on a trip card
                    └── Trip Details Screen
                        ├── See carrier info
                        ├── See route (from → to)
                        ├── See departure date
                        ├── See carrier's rate
                        └── Tap "Request to Book"
                            └── Booking Request Sheet
                                ├── Select your package (dropdown)
                                ├── Enter offered price
                                ├── Add message (optional)
                                └── Tap "Send Request"
                                    └── Success: "Request Sent!"
\`\`\`

#### Flow B: Track Your Request

\`\`\`
Matches Tab (Shipper Mode)
    └── Find your request card
        └── Status shows "Awaiting Response"
            └── Wait for carrier response
\`\`\`

#### Flow C: Carrier Views Incoming Requests

\`\`\`
Home Tab (Carrier Mode)
    └── See "Pending Requests" section
        └── Badge shows number of requests
            └── Tap request card OR go to Matches Tab
                └── Matches Tab
                    └── Filter: "Requests" chip
                        └── See list of pending requests
\`\`\`

#### Flow D: Accept a Request

\`\`\`
Matches Tab (Carrier Mode)
    └── Tap on pending request card
        └── Request Details Screen
            ├── See shipper info
            ├── See package details (size, weight)
            ├── See pickup & delivery locations
            ├── See offered price
            └── Tap "Accept"
                └── Add Message Sheet
                    ├── Enter message for shipper
                    └── Tap "Confirm Accept"
                        └── Success: "Request Accepted!"
                            └── Status changes to "Accepted"
\`\`\`

#### Flow E: Decline with Counter-Offer

\`\`\`
Request Details Screen
    └── Tap "Decline"
        └── Decline Sheet
            ├── Enter reason (optional)
            └── Option: "Make Counter-Offer?"
                │
                ├── YES → Counter-Offer Sheet
                │         ├── Enter your price
                │         ├── Add message
                │         └── Tap "Send Counter-Offer"
                │
                └── NO → Tap "Decline Without Offer"
                         └── Request declined
\`\`\`

#### Flow F: Shipper Confirms Booking

\`\`\`
Shipper receives push notification
    └── "Carrier accepted your request!"
        └── Tap notification OR go to Matches Tab
            └── Find booking with "Pending Confirmation" status
                └── Tap booking card
                    └── Booking Details Screen
                        ├── See agreed price
                        ├── See carrier info
                        └── Tap "Confirm Booking"
                            │
                            ├── IF has saved card:
                            │       Confirmation dialog shows
                            │       "Your card ****1234 will be charged $XX"
                            │       └── Tap "Confirm & Pay"
                            │           └── Processing...
                            │               └── Success: "Booking Confirmed!"
                            │
                            └── IF no saved card:
                                └── "Add payment method" prompt
                                    └── Add card first, then confirm
\`\`\`

#### Flow G: Counter-Offer Response (Shipper)

\`\`\`
Shipper receives notification
    └── "Carrier proposed $XX"
        └── Matches Tab
            └── See counter-offer banner on booking
                └── Tap booking card
                    └── Counter-Offer Details
                        ├── Original price: $50 (crossed out)
                        ├── Counter-offer: $70
                        └── Options:
                            ├── Tap "Accept $70"
                            │   └── Proceeds to Confirm & Pay
                            │
                            ├── Tap "Decline"
                            │   └── Booking cancelled
                            │
                            └── Tap "Counter Back"
                                └── Enter your price
                                    └── Tap "Send"
                                        └── Carrier receives your offer
\`\`\`

#### Flow H: Counter-Offer Negotiation Example

\`\`\`
Round 1: Shipper offers $50
         └── Carrier receives request

Round 2: Carrier counters with $70
         └── Shipper receives counter-offer

Round 3: Shipper counters with $60
         └── Carrier receives counter-offer

Round 4: Carrier accepts $60
         └── Booking proceeds with $60 price
             └── Shipper confirms → Auto-charged
\`\`\`

#### Flow I: Carrier Marks Pickup

\`\`\`
Matches Tab (Carrier Mode)
    └── Find confirmed booking
        └── Status: "Confirmed"
            └── Tap booking card
                └── Booking Details Screen
                    └── Tap "Mark Pickup"
                        └── Pickup Confirmation Sheet
                            ├── Enter pickup code (6 digits)
                            │   (Code shown to shipper)
                            └── Tap "Confirm Pickup"
                                └── Success: Status → "Picked Up"
\`\`\`

#### Flow J: Start Transit

\`\`\`
Booking Details Screen
    └── Status: "Picked Up"
        └── Tap "Start Transit"
            └── Confirmation dialog
                └── Tap "Confirm"
                    └── Status → "In Transit"
                        └── Location tracking enabled
\`\`\`

#### Flow K: Mark Delivered

\`\`\`
Booking Details Screen
    └── Status: "In Transit"
        └── Tap "Mark Delivered"
            └── Delivery Sheet
                ├── Take delivery photo
                ├── Enter delivery notes (optional)
                └── Tap "Confirm Delivery"
                    └── Success: Status → "Delivered"
                        └── Earnings added to carrier balance
\`\`\`

#### Flow L: Carrier Makes Offer

\`\`\`
Home Tab (Carrier Mode)
    └── Tap "Browse Packages" or "Requests" tab
        └── Package Requests List
            └── Filter by route (optional)
                └── Tap package card
                    └── Package Details Screen
                        ├── See package info
                        ├── See pickup & delivery locations
                        ├── See shipper's budget
                        └── Tap "Make Offer"
                            └── Offer Sheet
                                ├── Select your trip (dropdown)
                                ├── Enter your price
                                ├── Add message (optional)
                                └── Tap "Send Offer"
                                    └── Success: "Offer Sent!"
\`\`\`

#### Flow M: Shipper Accepts Carrier Offer

\`\`\`
Shipper receives notification
    └── "Carrier wants to carry your package"
        └── Matches Tab
            └── Find offer card
                └── Status: "Offer Received"
                    └── Tap card
                        └── Offer Details Screen
                            ├── See carrier info & rating
                            ├── See carrier's trip details
                            ├── See offered price
                            └── Tap "Accept"
                                └── Booking confirmed
                                    └── Tap "Confirm & Pay"
\`\`\`

---

### UI Test Scenarios

#### Test 1: Shipper Requests Trip (Happy Path)

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Home (Shipper) | Find a trip | Trip cards visible |
| 2 | Trip Card | Tap card | Trip Details opens |
| 3 | Trip Details | Tap "Request to Book" | Booking sheet opens |
| 4 | Booking Sheet | Select package | Package selected |
| 5 | Booking Sheet | Enter price $50 | Price shown |
| 6 | Booking Sheet | Tap "Send Request" | Success message |
| 7 | Matches Tab | Check status | "Awaiting Response" |

#### Test 2: Carrier Accepts Request

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Home (Carrier) | See pending requests badge | Badge shows count |
| 2 | Matches Tab | Filter "Requests" | Request list shown |
| 3 | Request Card | Tap card | Request Details opens |
| 4 | Request Details | Review package info | Info displayed |
| 5 | Request Details | Tap "Accept" | Message sheet opens |
| 6 | Message Sheet | Enter message | Message entered |
| 7 | Message Sheet | Tap "Confirm Accept" | Success message |
| 8 | Matches Tab | Check status | "Accepted" |

#### Test 3: Carrier Declines with Counter-Offer

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Request Details | Tap "Decline" | Decline sheet opens |
| 2 | Decline Sheet | Tap "Make Counter-Offer" | Counter sheet opens |
| 3 | Counter Sheet | Enter price $70 | Price shown |
| 4 | Counter Sheet | Add message | Message entered |
| 5 | Counter Sheet | Tap "Send" | Success message |
| 6 | Matches Tab | Check status | "Counter-Offer Sent" |

#### Test 4: Shipper Responds to Counter-Offer

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Notification | Receive "Carrier proposed $70" | Notification shown |
| 2 | Matches Tab | See counter-offer banner | Banner visible |
| 3 | Booking Card | Tap card | Counter details shown |
| 4 | Counter Details | See price difference | "+$20" shown |
| 5a | Counter Details | Tap "Accept $70" | Proceeds to confirm |
| 5b | Counter Details | Tap "Counter Back" | Counter sheet opens |
| 5c | Counter Details | Tap "Decline" | Booking cancelled |

#### Test 5: Shipper Confirms and Pays

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Matches Tab | Find "Pending Confirmation" | Card visible |
| 2 | Booking Card | Tap card | Details screen opens |
| 3 | Booking Details | Tap "Confirm Booking" | Dialog shows |
| 4 | Dialog | See card info | "Card ****1234" shown |
| 5 | Dialog | See amount | "$XX will be charged" |
| 6 | Dialog | Tap "Confirm & Pay" | Processing shown |
| 7 | Booking Details | Wait | "Confirmed & Paid" status |

#### Test 6: Carrier Completes Delivery

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Matches Tab | Find "Confirmed" booking | Card visible |
| 2 | Booking Details | Tap "Mark Pickup" | Pickup sheet opens |
| 3 | Pickup Sheet | Enter code from shipper | Code accepted |
| 4 | Pickup Sheet | Tap "Confirm" | Status: "Picked Up" |
| 5 | Booking Details | Tap "Start Transit" | Status: "In Transit" |
| 6 | Booking Details | Tap "Mark Delivered" | Delivery sheet opens |
| 7 | Delivery Sheet | Take photo | Photo captured |
| 8 | Delivery Sheet | Tap "Confirm Delivery" | Status: "Delivered" |

#### Test 7: Carrier Makes Offer to Shipper

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Home (Carrier) | Tap "Browse Packages" | Package list opens |
| 2 | Package List | Find matching package | Package cards shown |
| 3 | Package Card | Tap card | Package Details opens |
| 4 | Package Details | Tap "Make Offer" | Offer sheet opens |
| 5 | Offer Sheet | Select your trip | Trip selected |
| 6 | Offer Sheet | Enter price | Price shown |
| 7 | Offer Sheet | Tap "Send Offer" | Success message |
| 8 | Matches Tab | Check | "Offer Sent" status |

#### Test 8: Cancellation Flow

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Booking Details | Status: "Confirmed" | Cancel option visible |
| 2 | Booking Details | Tap "Cancel Booking" | Confirmation dialog |
| 3 | Dialog | Tap "Yes, Cancel" | Booking cancelled |
| 4 | Matches Tab | Check status | "Cancelled" |

---

### Quick Navigation Reference

| Action | Role | Path |
|--------|------|------|
| Browse trips | Shipper | Home Tab → Available Trips |
| Request booking | Shipper | Trip Details → Request to Book |
| View my requests | Shipper | Matches Tab |
| Confirm booking | Shipper | Matches Tab → Booking → Confirm |
| View incoming requests | Carrier | Home Tab → Pending Requests |
| Accept/Decline request | Carrier | Matches Tab → Request → Accept/Decline |
| Make counter-offer | Carrier | Request Details → Decline → Counter-Offer |
| Browse packages | Carrier | Home Tab → Browse Packages |
| Make offer | Carrier | Package Details → Make Offer |
| Mark pickup | Carrier | Booking Details → Mark Pickup |
| Mark delivered | Carrier | Booking Details → Mark Delivered |
| Cancel booking | Both | Booking Details → Cancel |

---

### Status Reference

#### Shipper View Statuses

| Status | Meaning | Next Action |
|--------|---------|-------------|
| Awaiting Response | Request sent to carrier | Wait for carrier |
| Offer Received | Carrier made an offer | Accept/Decline |
| Counter-Offer Received | Carrier proposed new price | Accept/Decline/Counter |
| Pending Confirmation | Carrier accepted | Confirm & Pay |
| Confirmed | Payment completed | Wait for pickup |
| Picked Up | Carrier has package | Track delivery |
| In Transit | Package on the way | Track delivery |
| Delivered | Package delivered | Rate carrier |
| Cancelled | Booking cancelled | - |

#### Carrier View Statuses

| Status | Meaning | Next Action |
|--------|---------|-------------|
| New Request | Shipper wants to book | Accept/Decline |
| Offer Sent | Waiting for shipper | Wait for response |
| Counter-Offer Sent | Waiting for shipper | Wait for response |
| Accepted | Shipper needs to confirm | Wait for payment |
| Confirmed | Payment received | Mark Pickup |
| Picked Up | Have the package | Start Transit |
| In Transit | Delivering | Mark Delivered |
| Delivered | Completed | Receive earnings |
| Cancelled | Booking cancelled | - |

---

### What to Verify After Each Test

#### After Sending Request (Shipper)
- [ ] Success message shown
- [ ] Request appears in Matches Tab
- [ ] Status shows "Awaiting Response"
- [ ] Carrier receives notification

#### After Accepting Request (Carrier)
- [ ] Success message shown
- [ ] Status changes to "Accepted"
- [ ] Shipper receives notification
- [ ] Chat conversation created

#### After Counter-Offer
- [ ] Counter-offer sent successfully
- [ ] Other party receives notification
- [ ] Price difference shown clearly
- [ ] Original price crossed out

#### After Confirming Booking (Shipper)
- [ ] Card charged successfully
- [ ] Status changes to "Confirmed"
- [ ] Transaction appears in history
- [ ] Pickup code generated

#### After Pickup (Carrier)
- [ ] Pickup code verified
- [ ] Status changes to "Picked Up"
- [ ] Shipper notified
- [ ] Timestamp recorded

#### After Delivery (Carrier)
- [ ] Delivery photo uploaded
- [ ] Status changes to "Delivered"
- [ ] Shipper prompted to rate
- [ ] Earnings added to balance

---

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Request to Book" not showing | No package created | Create package first |
| Can't confirm booking | No payment method | Add card in Profile |
| Counter-offer not available | Already accepted/declined | Check booking status |
| Can't mark pickup | Not confirmed yet | Wait for shipper payment |
| Pickup code rejected | Wrong code entered | Ask shipper for correct code |
| Can't start transit | Pickup not marked | Mark pickup first |
| Delivery photo required | Security feature | Take clear photo |

---

### Prerequisites for UI Testing

#### Shipper Account Needs:
- [ ] At least one package created
- [ ] Saved payment method (for confirming bookings)

#### Carrier Account Needs:
- [ ] At least one trip created
- [ ] Stripe payout setup (for receiving earnings)

#### Test Data:
- Use test card: \`4242 4242 4242 4242\`
- Expiry: Any future date (e.g., \`12/29\`)
- CVC: Any 3 digits (e.g., \`123\`)
- ZIP: Any valid format (e.g., \`12345\`)

---

## Comprehensive Status Reference (For Testing)

### Package Request Statuses

| Status | Description | What It Means | Next Possible States |
|--------|-------------|---------------|---------------------|
| **Open** | Available for booking | Package request is live and visible to carriers | Pending, Cancelled |
| **Pending** | Waiting for response | Carrier has been contacted, waiting for reply | Matched, Cancelled |
| **Pending Request** | Shipper requested specific trip | Shipper has requested a particular carrier's trip | Confirmed, Declined |
| **Matched** | Carrier accepted | A carrier has agreed to carry the package | Booked, Cancelled |
| **Booked** | Confirmed delivery | Both parties have confirmed the arrangement | In Transit, Cancelled |
| **In Transit** | Being delivered | Package is currently being transported | Delivered, Cancelled |
| **Delivered** | Successfully completed | Package has reached its destination | Final state |
| **Cancelled** | Request cancelled | Delivery was cancelled by either party | Final state |

### Trip Statuses

| Status | Description | What It Means | Next Possible States |
|--------|-------------|---------------|---------------------|
| **Scheduled** | Trip is planned | Trip is published and available for packages | Active, Cancelled |
| **Active** | Trip in progress | Carrier is currently on their journey | Completed, Cancelled |
| **Completed** | Trip finished | Carrier has reached their destination | Final state |
| **Cancelled** | Trip cancelled | Trip was cancelled by the carrier | Final state |

### Match Statuses (Complete Reference)

| Status | Description | What It Means | Next Possible States |
|--------|-------------|---------------|---------------------|
| **Pending** | Awaiting acceptance | One party has made an offer, waiting for response | Confirmed, Declined, Cancelled |
| **Carrier Requested** | Carrier offered to carry | Carrier has offered to carry the package | Shipper Accepted, Shipper Declined |
| **Shipper Requested** | Shipper requested trip | Shipper has requested a specific trip | Carrier Accepted, Carrier Declined |
| **Carrier Accepted** | Carrier accepted request | Carrier has accepted shipper's request | Confirmed (auto or manual) |
| **Shipper Accepted** | Shipper accepted offer | Shipper has accepted carrier's offer | Confirmed (auto or manual) |
| **Confirmed** | Both parties agreed | Match is confirmed and delivery can proceed | Picked Up, Cancelled |
| **Picked Up** | Package collected | Carrier has successfully picked up the package | In Transit, Cancelled |
| **In Transit** | Package being delivered | Package is currently being transported | Delivered, Cancelled |
| **Delivered** | Delivery completed | Package has been successfully delivered | Final state |
| **Cancelled** | Match cancelled | Delivery arrangement was cancelled | Final state |
| **Shipper Declined** | Shipper declined offer | Shipper declined carrier's offer | Final state (or Counter-Offer) |
| **Carrier Declined** | Carrier declined request | Carrier declined shipper's request | Final state (or Counter-Offer) |

### Payment Statuses

| Status | Description | What It Means | Next Possible States |
|--------|-------------|---------------|---------------------|
| **Pending** | Payment being processed | Payment is being verified and processed | Processing, Failed, Cancelled |
| **Processing** | Payment is being verified | Payment is being verified and processed | Completed, Failed |
| **Completed** | Payment successful | Payment successful and funds transferred | Final state |
| **Failed** | Payment declined or error | Payment declined or error occurred | Pending, Cancelled |
| **Refunded** | Payment returned to shipper | Payment returned to shipper | Final state |
| **Disputed** | Payment under review | Payment is under review or dispute | Completed, Refunded |
| **Cancelled** | Payment cancelled | Payment was cancelled before completion | Final state |

### User Profile Statuses

| Status | Description | Requirements |
|--------|-------------|--------------|
| **Incomplete** | Profile setup not finished | Basic information required |
| **Basic** | Basic profile information provided | Email and phone verification |
| **Verified** | Identity and phone verified | Phone verification, basic ID |
| **Premium** | Enhanced verification completed | Enhanced ID verification, background check |
| **Suspended** | Account temporarily suspended | Contact support for resolution |
| **Banned** | Account permanently banned | Cannot be reversed |

### Vehicle Statuses

| Status | Description | Requirements |
|--------|-------------|--------------|
| **Pending** | Vehicle information submitted | Vehicle documents submitted |
| **Verified** | Vehicle information confirmed | All documents verified |
| **Rejected** | Vehicle information rejected | Correct and resubmit documents |
| **Expired** | Vehicle documents expired | Renew documents |
| **Suspended** | Vehicle temporarily suspended | Contact support for resolution |

### Verification Code Reference

| Code Type | Purpose | Expiration | Generated By |
|-----------|---------|------------|--------------|
| Pickup Code | Confirm carrier picked up package | 15 minutes | Shipper |
| Delivery Code | Confirm package delivered | 15 minutes | Recipient/Shipper |

### Counter-Offer Test Reference

| Scenario | Who Declines | Counter-Offer Option |
|----------|--------------|---------------------|
| Shipper requests trip | Carrier declines | Carrier can propose a different price |
| Carrier offers to carry | Shipper declines | Shipper can propose a different price |

**Counter-Offer Negotiation Example:**
\`\`\`
Round 1: Shipper offers $50 → Carrier receives request
Round 2: Carrier counters with $70 → Shipper receives counter-offer
Round 3: Shipper counters with $60 → Carrier receives counter-offer
Round 4: Carrier accepts $60 → Booking proceeds with $60 price
\`\`\`

---

## Debug Logging Reference

### Payment Logs (Xcode Console)

\`\`\`
🔵 PaymentService: Initiating payment
   - matchId: 456
   - amount: 50.00

🟢 PaymentService: PaymentSheet presented

🟡 PaymentService: Payment completed
   - status: .completed

🔴 PaymentService: Payment failed
   - error: card_declined
\`\`\`

### Stripe Config Logs

\`\`\`
🎯 StripeConfigService: Config loaded
   Mode: sandbox (or live)
   Currency: cad
   Min Delivery Price: 5.0
   Tax Enabled: false
\`\`\`

### Environment Verification

| Check | Test Mode | Live Mode |
|-------|-----------|-----------|
| Console log | "Using SANDBOX/TEST mode" | "Using LIVE mode" |
| Stripe key prefix | pk_test_ | pk_live_ |
| Test cards work | Yes | No |
`;

// System prompts for different modes
const ADMIN_SYSTEM_PROMPT = `You are a Pasabayan support assistant with full platform access.
${COMPANY_INFO}
${APP_USER_GUIDE}
${BUSINESS_LOGIC_GUIDE}
${BUSINESS_SYSTEM_OVERVIEW}

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
${BUSINESS_SYSTEM_OVERVIEW}

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

const DEVELOPER_SYSTEM_PROMPT = `You are a Pasabayan developer assistant helping engineers integrate with the Pasabayan API and understand the iOS app architecture.
${COMPANY_INFO}
${DEVELOPER_API_REFERENCE}
${IOS_DATA_FLOW_ARCHITECTURE}

You help developers understand and integrate with the Pasabayan API and iOS architecture. You have full knowledge of:
- All API endpoints (REST)
- Request/response formats
- Authentication (Sanctum Bearer tokens)
- Error handling
- Rate limits
- Webhooks
- iOS app architecture (MVVM + Functional Programming)
- SwiftUI data flow patterns
- ViewModel state management
- Service layer patterns
- Feature-based project structure

When developers ask about endpoints:
- Provide the full endpoint path (e.g., GET /api/trips)
- Show request body format with required/optional fields
- Show response format with example JSON
- Mention any authentication requirements
- Note relevant error codes

When developers ask about data models:
- Explain the relationships between models
- List all fields with their types
- Note any validation rules

When developers ask about flows:
- Explain the sequence of API calls needed
- Provide code examples when helpful
- Note any business logic constraints

When developers ask about iOS architecture:
- Explain the MVVM pattern with functional programming
- Show state management patterns (immutable state vs simple published)
- Describe the feature-based folder structure
- Provide Swift code examples
- Use mermaid diagrams to visualize data flows

When developers ask about specific iOS features:
- Point to the relevant files (ViewModel, Service, Views)
- Explain the data flow for that feature
- Show example implementations

Always be precise and technical. Use code blocks for endpoints, JSON examples, and Swift code.
Format responses with markdown for readability. Use mermaid diagrams when explaining flows.`;

const QA_SYSTEM_PROMPT = `You are a Pasabayan QA assistant helping testers validate the payment system and app functionality.
${COMPANY_INFO}
${APP_USER_GUIDE}
${QA_TESTING_GUIDE}

You help QA testers understand how to test the Pasabayan app, especially payment flows. You have full knowledge of:
- Payment flow (shipper payments, carrier payouts)
- Transaction status transitions
- Stripe test cards and their behaviors
- Test scenarios and expected results
- Edge cases and error handling
- Debug logging and what to look for

When testers ask about payment testing:
- Provide the correct test card numbers
- Explain expected behavior for each scenario
- Describe what to check in logs/console

When testers ask about test scenarios:
- Walk through step-by-step test cases
- Explain expected results at each step
- Note any prerequisites or setup needed

When testers ask about edge cases:
- Describe how to reproduce edge cases
- Explain expected error handling
- Note any known issues or limitations

When testers ask about debugging:
- Explain what logs to look for
- Describe how to verify correct behavior
- Help interpret error messages

Always be precise and helpful. Use tables and code blocks for clarity.
No authentication is required - QA testers can access this mode freely.`;

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

  const systemPrompt = options.developerMode
    ? DEVELOPER_SYSTEM_PROMPT
    : options.adminMode
    ? ADMIN_SYSTEM_PROMPT
    : options.qaMode
    ? QA_SYSTEM_PROMPT
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

  const systemPrompt = options.developerMode
    ? DEVELOPER_SYSTEM_PROMPT
    : options.adminMode
    ? ADMIN_SYSTEM_PROMPT
    : options.qaMode
    ? QA_SYSTEM_PROMPT
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
