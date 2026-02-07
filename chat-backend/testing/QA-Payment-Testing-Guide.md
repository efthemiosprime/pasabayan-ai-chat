# Payment Testing Guide - UI Flow

## How Payments Work

**Payments are AUTO-CHARGED** when the shipper confirms a booking.

- Shipper must have a saved payment method (card) before confirming
- When shipper taps "Confirm", the card is automatically charged
- No separate "Pay Now" step needed

---

## Complete Payment Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              BOOKING & PAYMENT FLOW                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  SHIPPER                           CARRIER                                      │
│  ───────                           ───────                                      │
│                                                                                 │
│  1. Browse Trips                                                                │
│       │                                                                         │
│       ▼                                                                         │
│  2. Request to Book ─────────────▶ 3. Receives Request                         │
│     (propose price)                     │                                       │
│                                         ▼                                       │
│                                    4. Accept / Decline / Counter-Offer         │
│                                         │                                       │
│       ┌─────────────────────────────────┼─────────────────────────────┐        │
│       │                                 │                             │        │
│       ▼                                 ▼                             ▼        │
│   ACCEPTED                         DECLINED                    COUNTER-OFFER   │
│       │                                 │                             │        │
│       ▼                                 ▼                             ▼        │
│  5. Shipper Sees              Request Ends              6. Shipper Reviews     │
│     "Pending Confirmation"                                  New Price          │
│       │                                                       │                │
│       ▼                                                       ▼                │
│  7. Tap "Confirm Booking"                              Accept / Decline /      │
│       │                                                Counter Back            │
│       ▼                                                       │                │
│  ┌─────────────────┐                                         │                │
│  │ Has saved card? │◀────────────────────────────────────────┘                │
│  └────────┬────────┘                                                          │
│      YES  │  NO                                                                │
│       │   │                                                                    │
│       │   ▼                                                                    │
│       │  Add Payment Method                                                    │
│       │   │                                                                    │
│       ▼   ▼                                                                    │
│  8. Confirmation Dialog                                                        │
│     "Card ****1234 will be charged $XX"                                       │
│       │                                                                        │
│       ▼                                                                        │
│  9. AUTO-CHARGE ─────────────────▶ Payment Captured                           │
│       │                                                                        │
│       ▼                                                                        │
│  10. Booking Status: "Confirmed & Paid"                                       │
│                                                                                │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Carrier Payout Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CARRIER PAYOUT FLOW                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  FIRST TIME SETUP (One-time)                                                   │
│  ────────────────────────────                                                  │
│                                                                                 │
│  Profile Tab                                                                    │
│       │                                                                         │
│       ▼                                                                         │
│  Tap "Payout Setup"                                                            │
│       │                                                                         │
│       ▼                                                                         │
│  Tap "Set Up Payouts"                                                          │
│       │                                                                         │
│       ▼                                                                         │
│  ┌─────────────────────────────────────────┐                                   │
│  │         STRIPE EXPRESS WEBSITE          │                                   │
│  │  ┌───────────────────────────────────┐  │                                   │
│  │  │ 1. Enter Personal Information     │  │                                   │
│  │  │    • Full Name                    │  │                                   │
│  │  │    • Date of Birth                │  │                                   │
│  │  │    • Address                      │  │                                   │
│  │  └───────────────────────────────────┘  │                                   │
│  │  ┌───────────────────────────────────┐  │                                   │
│  │  │ 2. Identity Verification          │  │                                   │
│  │  │    • Upload ID (Passport/License) │  │                                   │
│  │  │    • Take Selfie                  │  │                                   │
│  │  └───────────────────────────────────┘  │                                   │
│  │  ┌───────────────────────────────────┐  │                                   │
│  │  │ 3. Add Bank Account               │  │                                   │
│  │  │    • Bank Name                    │  │                                   │
│  │  │    • Account Number               │  │                                   │
│  │  │    • Routing Number               │  │                                   │
│  │  └───────────────────────────────────┘  │                                   │
│  │  ┌───────────────────────────────────┐  │                                   │
│  │  │ 4. Tax Information                │  │                                   │
│  │  │    • SIN (Canada) or SSN (US)     │  │                                   │
│  │  └───────────────────────────────────┘  │                                   │
│  └─────────────────────────────────────────┘                                   │
│       │                                                                         │
│       ▼                                                                         │
│  Returns to App                                                                │
│       │                                                                         │
│       ▼                                                                         │
│  Status: "Payouts Enabled" ✓                                                   │
│                                                                                 │
│                                                                                 │
│  EARNING & PAYOUT CYCLE                                                        │
│  ──────────────────────                                                        │
│                                                                                 │
│  Delivery Completed                                                            │
│       │                                                                         │
│       ▼                                                                         │
│  Earnings Added to Balance                                                     │
│       │                                                                         │
│       ▼                                                                         │
│  ┌─────────────────────────────┐                                               │
│  │     PAYOUT SCHEDULE         │                                               │
│  │  ┌───────────────────────┐  │                                               │
│  │  │ Daily/Weekly Automatic│  │                                               │
│  │  │ (Stripe handles this) │  │                                               │
│  │  └───────────────────────┘  │                                               │
│  └─────────────────────────────┘                                               │
│       │                                                                         │
│       ▼                                                                         │
│  Money in Bank Account (2-3 business days)                                     │
│                                                                                 │
│                                                                                 │
│  VIEW EARNINGS                                                                 │
│  ─────────────                                                                 │
│                                                                                 │
│  Profile Tab → Transaction History → Filter: "Carrier"                         │
│       │                                                                         │
│       ▼                                                                         │
│  See list of completed deliveries & earnings                                   │
│                                                                                 │
│                                                                                 │
│  VIEW STRIPE DASHBOARD                                                         │
│  ────────────────────                                                          │
│                                                                                 │
│  Profile Tab → Payout Setup → "View Dashboard"                                 │
│       │                                                                         │
│       ▼                                                                         │
│  ┌─────────────────────────────┐                                               │
│  │   STRIPE EXPRESS DASHBOARD  │                                               │
│  │  • Current Balance          │                                               │
│  │  • Payout History           │                                               │
│  │  • Update Bank Details      │                                               │
│  │  • Tax Documents            │                                               │
│  └─────────────────────────────┘                                               │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Counter-Offer Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              COUNTER-OFFER FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  SCENARIO 1: Carrier Counter-Offers to Shipper                                 │
│  ─────────────────────────────────────────────                                 │
│                                                                                 │
│  Shipper requests booking at $50                                               │
│       │                                                                         │
│       ▼                                                                         │
│  Carrier receives request                                                      │
│       │                                                                         │
│       ▼                                                                         │
│  Carrier taps "Decline"                                                        │
│       │                                                                         │
│       ▼                                                                         │
│  ┌─────────────────────────────────────┐                                       │
│  │   COUNTER-OFFER PROMPT APPEARS      │                                       │
│  │  ┌───────────────────────────────┐  │                                       │
│  │  │ "Make a Counter-Offer?"       │  │                                       │
│  │  │                               │  │                                       │
│  │  │ Declined Price: $50 (crossed) │  │                                       │
│  │  │ Your Rate: $4.50/kg           │  │                                       │
│  │  │                               │  │                                       │
│  │  │ Your Counter-Offer:           │  │                                       │
│  │  │ ┌─────────────────────────┐   │  │                                       │
│  │  │ │ $ [  70.00  ]           │   │  │                                       │
│  │  │ └─────────────────────────┘   │  │                                       │
│  │  │                               │  │                                       │
│  │  │ Message (optional):           │  │                                       │
│  │  │ ┌─────────────────────────┐   │  │                                       │
│  │  │ │ "Price reflects weight" │   │  │                                       │
│  │  │ └─────────────────────────┘   │  │                                       │
│  │  │                               │  │                                       │
│  │  │ [Skip]        [Send Offer]    │  │                                       │
│  │  └───────────────────────────────┘  │                                       │
│  └─────────────────────────────────────┘                                       │
│       │                                                                         │
│       ▼                                                                         │
│  Shipper receives notification:                                                │
│  "Carrier proposed $70 (+$20 from your offer)"                                 │
│       │                                                                         │
│       ▼                                                                         │
│  Shipper opens Matches Tab → Sees counter-offer banner                         │
│       │                                                                         │
│       ▼                                                                         │
│  ┌─────────────────────────────────────┐                                       │
│  │         SHIPPER OPTIONS             │                                       │
│  │  ┌───────────────────────────────┐  │                                       │
│  │  │ ✓ Accept $70                  │──┼──▶ Proceeds to Confirm & Pay         │
│  │  │ ✗ Decline                     │──┼──▶ Booking cancelled                  │
│  │  │ ↔ Counter-Offer Back          │──┼──▶ Propose new price (e.g., $60)     │
│  │  └───────────────────────────────┘  │                                       │
│  └─────────────────────────────────────┘                                       │
│                                                                                 │
│                                                                                 │
│  SCENARIO 2: Shipper Counter-Offers Back                                       │
│  ───────────────────────────────────────                                       │
│                                                                                 │
│  Shipper receives $70 counter-offer                                            │
│       │                                                                         │
│       ▼                                                                         │
│  Shipper taps "Counter-Offer"                                                  │
│       │                                                                         │
│       ▼                                                                         │
│  ┌─────────────────────────────────────┐                                       │
│  │   COUNTER-OFFER PROMPT              │                                       │
│  │  ┌───────────────────────────────┐  │                                       │
│  │  │ Their Offer: $70              │  │                                       │
│  │  │ Your Budget: $50              │  │                                       │
│  │  │                               │  │                                       │
│  │  │ Your Counter-Offer:           │  │                                       │
│  │  │ ┌─────────────────────────┐   │  │                                       │
│  │  │ │ $ [  60.00  ]           │   │  │                                       │
│  │  │ └─────────────────────────┘   │  │                                       │
│  │  │                               │  │                                       │
│  │  │ [Cancel]      [Send Offer]    │  │                                       │
│  │  └───────────────────────────────┘  │                                       │
│  └─────────────────────────────────────┘                                       │
│       │                                                                         │
│       ▼                                                                         │
│  Carrier receives notification:                                                │
│  "Shipper proposed $60"                                                        │
│       │                                                                         │
│       ▼                                                                         │
│  Carrier can Accept / Decline / Counter again                                  │
│                                                                                 │
│                                                                                 │
│  COUNTER-OFFER ENDS WHEN:                                                      │
│  ────────────────────────                                                      │
│  • One party ACCEPTS → Booking proceeds to confirmation                        │
│  • One party DECLINES without counter → Booking cancelled                      │
│  • Price agreed upon → Auto-charge triggered on confirm                        │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

- Test account logged in
- For Shipper: Need a saved payment method first
- For Carrier payout testing: Carrier role account

---

## Part 1: Shipper Payment Flow

### Flow A: Add Payment Method (Required First)

```
Profile Tab
    └── Scroll to "Payments" section
        └── Tap "Payment Methods"
            └── Payment Methods Screen
                └── Tap "Add Card" or "+"
                    └── Stripe Payment Sheet appears
                        └── Enter card details
                            └── Tap "Save"
                                └── Card saved as default
```

### Flow B: Confirm Booking (Auto-Charges Card)

```
Home Tab
    └── Browse carrier trips
        └── Tap on trip card
            └── Trip Details
                └── Tap "Request to Book"
                    └── Enter package details & agree on price
                        └── Request sent to carrier

--- Carrier accepts the request ---

Matches Tab
    └── Find booking with "Pending Confirmation" status
        └── Tap booking card
            └── Booking Details Screen
                └── Review price shown
                    └── Tap "Confirm Booking"
                        │
                        ├── IF has saved card:
                        │   └── Confirmation dialog shows:
                        │       "Your card ending in ****1234 will be charged $XX.XX"
                        │       └── Tap "Confirm & Pay"
                        │           └── Card auto-charged
                        │               └── Booking status: "Confirmed & Paid"
                        │
                        └── IF no saved card:
                            └── Prompt: "Add payment method"
                                └── Add card first
                                    └── Then confirm & auto-charge
```

### Flow C: View Payment History

```
Profile Tab
    └── Scroll to "Payments" section
        └── Tap "Transaction History"
            └── Transaction List Screen
                └── Tap any transaction
                    └── Transaction Details
                        ├── Amount charged
                        ├── Date
                        ├── Status
                        └── "View Receipt" button
```

### Flow D: Request a Refund

```
Profile Tab
    └── Tap "Transaction History"
        └── Find completed transaction
            └── Tap transaction
                └── Transaction Details Screen
                    └── Tap "Request Refund"
                        └── Refund Request Form
                            ├── Enter reason (minimum 10 characters)
                            ├── Enter additional details (optional)
                            └── Tap "Submit Request"
                                └── Confirmation message
```

### Flow E: View Receipts

```
Profile Tab
    └── Tap "Receipts"
        └── Receipt List Screen
            └── Tap any receipt
                └── Receipt Detail View
                    └── Tap "Download" or "Share"
```

---

## Part 2: Counter-Offer Flow

### Flow F: Carrier Makes Counter-Offer

```
Carrier Matches Tab
    └── Find incoming booking request
        └── Tap request card
            └── Request Details Screen
                └── Tap "Decline"
                    └── Counter-Offer Prompt appears
                        ├── See declined price (crossed out)
                        ├── See your rate reference
                        ├── Enter counter-offer amount
                        ├── Add message (optional)
                        └── Tap "Send Offer"
                            └── Shipper notified
```

### Flow G: Shipper Responds to Counter-Offer

```
Shipper receives push notification
    └── "Carrier proposed $XX"
        └── Tap notification OR go to Matches Tab
            └── See counter-offer banner on booking
                └── Tap booking card
                    └── Booking Details with counter-offer info
                        ├── Tap "Accept" → Proceeds to Confirm & Pay
                        ├── Tap "Decline" → Booking cancelled
                        └── Tap "Counter-Offer" → Make your own offer
                            └── Counter-Offer Prompt
                                ├── Enter your price
                                └── Tap "Send Offer"
                                    └── Carrier notified
```

### Flow H: Counter-Offer Negotiation

```
Round 1: Shipper offers $50
Round 2: Carrier counters $70
Round 3: Shipper counters $60
Round 4: Carrier accepts $60
    └── Booking proceeds with agreed price $60
        └── Shipper confirms → Auto-charged $60
```

---

## Part 3: Carrier Payout Setup

### Flow I: Set Up Stripe Payouts (First Time)

```
Profile Tab
    └── Scroll to "Payments" section
        └── Tap "Payout Setup"
            └── Payout Setup Screen
                └── Tap "Set Up Payouts"
                    └── Redirects to Stripe website
                        ├── Enter personal information
                        ├── Upload ID for verification
                        ├── Enter bank account details
                        ├── Provide tax information
                        └── Complete setup
                            └── Returns to app
                                └── "Payouts Enabled" status shown
```

### Flow J: View Carrier Earnings

```
Profile Tab
    └── Tap "Transaction History"
        └── Toggle to "Earnings" or filter by "Carrier"
            └── List of deliveries completed
                └── Tap any earning
                    └── Earning Details
                        ├── Delivery amount
                        ├── Platform fee deducted
                        ├── Tip received (if any)
                        └── Net amount earned
```

### Flow K: Access Stripe Dashboard

```
Profile Tab
    └── Tap "Payout Setup"
        └── Payout Setup Screen (after setup complete)
            └── Tap "View Dashboard"
                └── Opens Stripe Express Dashboard
                    ├── View current balance
                    ├── View payout history
                    ├── Update bank details
                    └── Download tax documents
```

---

## Part 4: Test Scenarios - Step by Step

### Test 1: Add Payment Method First

| Step | Screen | Action | Expected |
|------|--------|--------|----------|
| 1 | Profile | Tap "Payment Methods" | Payment methods screen |
| 2 | Payment Methods | Tap "Add Card" | Stripe sheet appears |
| 3 | Stripe Sheet | Enter `4242 4242 4242 4242` | Card accepted |
| 4 | Stripe Sheet | Enter expiry `12/28` | Accepted |
| 5 | Stripe Sheet | Enter CVC `123` | Accepted |
| 6 | Stripe Sheet | Tap "Save" | Card saved |
| 7 | Payment Methods | Check list | Card shows as default |

### Test 2: Confirm Booking (Auto-Charge)

| Step | Screen | Action | Expected |
|------|--------|--------|----------|
| 1 | Home | Tap "Matches" tab | Matches list appears |
| 2 | Matches | Find "Pending Confirmation" booking | Card visible |
| 3 | Matches | Tap booking card | Details screen |
| 4 | Booking Details | Review agreed price | Price shown |
| 5 | Booking Details | Tap "Confirm Booking" | Confirmation dialog |
| 6 | Dialog | See card ending & amount | "Card ****1234 will be charged $XX" |
| 7 | Dialog | Tap "Confirm & Pay" | Processing... |
| 8 | Booking Details | Wait for completion | "Confirmed & Paid" status |

### Test 3: Confirm Without Saved Card

| Step | Screen | Action | Expected |
|------|--------|--------|----------|
| 1 | Booking Details | Tap "Confirm Booking" | Prompt appears |
| 2 | Prompt | See "Add payment method" message | Add card option |
| 3 | Prompt | Tap "Add Card" | Stripe sheet |
| 4 | Stripe Sheet | Add card details | Card saved |
| 5 | Back to Booking | Tap "Confirm Booking" again | Now shows card info |
| 6 | Dialog | Tap "Confirm & Pay" | Auto-charged |

### Test 4: Auto-Charge with Declined Card

| Step | Screen | Action | Expected |
|------|--------|--------|----------|
| 1 | Payment Methods | Add card `4000 0000 0000 0002` | Card saved |
| 2 | Booking Details | Tap "Confirm Booking" | Dialog shows |
| 3 | Dialog | Tap "Confirm & Pay" | Processing... |
| 4 | Dialog | Wait | Error: "Payment failed" |
| 5 | Booking | Check status | Shows "Payment Failed" banner |
| 6 | Booking | Tap "Update Payment Method" | Can add new card |

### Test 5: Carrier Makes Counter-Offer

| Step | Screen | Action | Expected |
|------|--------|--------|----------|
| 1 | Carrier Matches | Find incoming request | Request card visible |
| 2 | Request Details | Tap "Decline" | Counter-offer prompt |
| 3 | Prompt | See original price crossed out | Price displayed |
| 4 | Prompt | Enter counter price (e.g., $70) | Amount accepted |
| 5 | Prompt | Tap "Send Offer" | Offer sent |
| 6 | Matches | Check status | Shows "Counter-Offer Sent" |

### Test 6: Shipper Accepts Counter-Offer

| Step | Screen | Action | Expected |
|------|--------|--------|----------|
| 1 | Shipper | Receive push notification | "Carrier proposed $70" |
| 2 | Matches Tab | See counter-offer banner | Banner shows price diff |
| 3 | Booking Details | Review new price | $70 shown |
| 4 | Booking Details | Tap "Accept" | Price updated to $70 |
| 5 | Booking Details | Tap "Confirm Booking" | Charged $70 |

### Test 7: Shipper Counter-Offers Back

| Step | Screen | Action | Expected |
|------|--------|--------|----------|
| 1 | Booking Details | See carrier's $70 offer | Price displayed |
| 2 | Booking Details | Tap "Counter-Offer" | Prompt appears |
| 3 | Prompt | Enter $60 | Amount accepted |
| 4 | Prompt | Tap "Send Offer" | Offer sent to carrier |
| 5 | Matches | Status | Shows "Awaiting Response" |

### Test 8: Carrier Onboarding

| Step | Screen | Action | Expected |
|------|--------|--------|----------|
| 1 | Profile | Tap "Payout Setup" | Setup screen appears |
| 2 | Payout Setup | Tap "Set Up Payouts" | Browser opens |
| 3 | Stripe Page | Fill personal info | Form progresses |
| 4 | Stripe Page | Upload ID photo | Verified |
| 5 | Stripe Page | Add bank account | Account added |
| 6 | Stripe Page | Enter tax info | Accepted |
| 7 | Stripe Page | Tap "Complete" | Success page |
| 8 | Stripe Page | Return to app | Back in app |
| 9 | Payout Setup | Check status | Shows "Payouts Enabled" |

### Test 9: Request Refund

| Step | Screen | Action | Expected |
|------|--------|--------|----------|
| 1 | Profile | Tap "Transaction History" | List appears |
| 2 | Transaction List | Find completed payment | Tap to open |
| 3 | Transaction Details | Tap "Request Refund" | Form appears |
| 4 | Refund Form | Enter reason (short) | Error: "minimum 10 characters" |
| 5 | Refund Form | Enter valid reason | Accepted |
| 6 | Refund Form | Tap "Submit" | Confirmation shown |
| 7 | Transaction Details | Check status | Shows "Refund Requested" |

---

## Part 5: Quick Navigation Reference

| Feature | Path |
|---------|------|
| Add payment method | Profile Tab → Payment Methods → Add Card |
| Confirm & pay booking | Matches Tab → Booking → Confirm Booking |
| Transaction history | Profile Tab → Transaction History |
| Receipts | Profile Tab → Receipts |
| Request refund | Profile → Transaction History → Transaction → Request Refund |
| Make counter-offer (Carrier) | Matches Tab → Request → Decline → Enter Amount |
| Respond to counter-offer (Shipper) | Matches Tab → Booking with banner → Accept/Decline/Counter |
| Payout setup (Carrier) | Profile Tab → Payout Setup |
| View earnings (Carrier) | Profile Tab → Transaction History (filter: Carrier) |
| Stripe dashboard (Carrier) | Profile Tab → Payout Setup → View Dashboard |

---

## Part 6: Test Cards to Use

| Purpose | Card Number | Use When |
|---------|-------------|----------|
| Successful payment | `4242 4242 4242 4242` | Normal testing |
| Declined card | `4000 0000 0000 0002` | Test auto-charge failure |
| Requires authentication | `4000 0025 0000 3155` | Test 3D Secure |

For all test cards:
- Expiry: Any future date (e.g., `12/28`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

---

## Part 7: What to Check After Each Test

### After Adding Payment Method
- [ ] Card appears in payment methods list
- [ ] Card marked as "Default"
- [ ] Last 4 digits shown correctly

### After Confirming Booking (Auto-Charge)
- [ ] Booking status updated to "Confirmed & Paid"
- [ ] Transaction appears in history
- [ ] Receipt is generated
- [ ] Correct amount charged

### After Auto-Charge Failure
- [ ] Error message is clear
- [ ] "Payment Failed" banner shows on booking
- [ ] Can update payment method
- [ ] Can retry confirmation

### After Counter-Offer Sent
- [ ] Other party receives notification
- [ ] Banner shows on booking card
- [ ] Price difference displayed correctly
- [ ] Can accept, decline, or counter back

### After Counter-Offer Accepted
- [ ] Agreed price updated
- [ ] Can proceed to confirm booking
- [ ] Auto-charge uses agreed price

### After Refund Request
- [ ] Confirmation message shown
- [ ] Transaction shows refund status
- [ ] Cannot request refund again on same transaction

### After Carrier Onboarding
- [ ] Status shows "Payouts Enabled"
- [ ] Can access Stripe dashboard
- [ ] Future earnings will be paid out

---

## Part 8: Key Flows Summary

### Payment Flow
| When | What Happens |
|------|--------------|
| Shipper confirms booking | Card auto-charged immediately |
| No saved card | Prompted to add card first |
| Card declined | Booking shows "Payment Failed" banner |

### Counter-Offer Flow
| When | What Happens |
|------|--------------|
| Carrier declines request | Option to make counter-offer |
| Counter-offer sent | Other party notified |
| Counter-offer accepted | Price updated, proceed to confirm |
| Counter-offer declined | Can counter back or cancel |

### Payout Flow
| When | What Happens |
|------|--------------|
| First time carrier | Must complete Stripe onboarding |
| Delivery completed | Earnings added to balance |
| Payout schedule | Automatic daily/weekly to bank |

---

## Part 9: Common Issues & Solutions

| Issue | What to Check |
|-------|---------------|
| "Confirm" button not working | Must have saved payment method |
| "Payment Failed" after confirm | Card was declined, add new card |
| Can't see "Payment Methods" | Check if in Profile → Payments section |
| Counter-offer not showing | Check Matches tab for banner |
| Can't make counter-offer | Only appears after tapping "Decline" |
| Payout setup not available | Must be logged in as Carrier role |
| Receipts not showing | Wait a few seconds and refresh |
| Refund button missing | Only available for completed transactions |
