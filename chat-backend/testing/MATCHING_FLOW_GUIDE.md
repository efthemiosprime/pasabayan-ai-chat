# Matching Testing Guide - UI Flow

## Overview

This guide covers the complete booking/matching flow between Shippers and Carriers. Follow the screen paths and verify expected results at each step.

---

## How Matching Works

**Two-Way Matching System:**
- **Shipper-Initiated**: Shipper finds a carrier's trip and requests to book space
- **Carrier-Initiated**: Carrier finds a shipper's package and offers to carry it

Both flows require acceptance from the other party before the booking is confirmed.

---

## Complete Matching Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           SHIPPER-INITIATED FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  SHIPPER                                  CARRIER                                   │
│  ───────                                  ───────                                   │
│                                                                                     │
│  1. Home Tab (Shipper Mode)                                                         │
│       │                                                                             │
│       ▼                                                                             │
│  2. Browse Available Trips                                                          │
│       │                                                                             │
│       ▼                                                                             │
│  3. Tap Trip Card                                                                   │
│       │                                                                             │
│       ▼                                                                             │
│  4. Trip Details Screen                                                             │
│       │                                                                             │
│       ▼                                                                             │
│  5. Tap "Request to Book"                                                           │
│       │                                                                             │
│       ▼                                                                             │
│  6. Select Package & Set Price ──────────▶ 7. Carrier Receives Notification        │
│       │                                         │                                   │
│       ▼                                         ▼                                   │
│  8. Request Sent                           9. Matches Tab → See Request             │
│     "Awaiting Response"                         │                                   │
│                                                 ▼                                   │
│                                           10. Tap Request Card                      │
│                                                 │                                   │
│                                                 ▼                                   │
│                                           11. Request Details                       │
│                                                 │                                   │
│                                          ┌──────┴──────┐                           │
│                                          │             │                           │
│                                          ▼             ▼                           │
│                                       ACCEPT        DECLINE                        │
│                                          │             │                           │
│                                          │        Counter-Offer?                   │
│                                          │             │                           │
│                                          ▼             ▼                           │
│  12. Shipper Notified ◀──────────── "Accepted"    "Declined" or                   │
│       │                                           "Counter-Offer Sent"             │
│       ▼                                                                             │
│  13. Matches Tab → "Pending Confirmation"                                          │
│       │                                                                             │
│       ▼                                                                             │
│  14. Tap "Confirm Booking"                                                          │
│       │                                                                             │
│       ▼                                                                             │
│  15. Payment Auto-Charged                                                           │
│       │                                                                             │
│       ▼                                                                             │
│  16. Status: "Confirmed & Paid"                                                     │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Carrier-Initiated Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           CARRIER-INITIATED FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  CARRIER                                  SHIPPER                                   │
│  ───────                                  ───────                                   │
│                                                                                     │
│  1. Home Tab (Carrier Mode)                                                         │
│       │                                                                             │
│       ▼                                                                             │
│  2. Tap "Browse Packages" or "Requests" Tab                                         │
│       │                                                                             │
│       ▼                                                                             │
│  3. Browse Available Packages                                                       │
│       │                                                                             │
│       ▼                                                                             │
│  4. Tap Package Card                                                                │
│       │                                                                             │
│       ▼                                                                             │
│  5. Package Details Screen                                                          │
│       │                                                                             │
│       ▼                                                                             │
│  6. Tap "Make Offer" ────────────────────▶ 7. Shipper Receives Notification        │
│       │                                         │                                   │
│       ▼                                         ▼                                   │
│  7. Enter Price & Message                  8. Matches Tab → See Offer               │
│       │                                         │                                   │
│       ▼                                         ▼                                   │
│  8. Offer Sent                             9. Tap Offer Card                        │
│     "Awaiting Response"                         │                                   │
│                                                 ▼                                   │
│                                           10. Offer Details                         │
│                                                 │                                   │
│                                          ┌──────┴──────┐                           │
│                                          │             │                           │
│                                          ▼             ▼                           │
│                                       ACCEPT        DECLINE                        │
│                                          │             │                           │
│                                          │        Counter-Offer?                   │
│                                          │             │                           │
│  11. Carrier Notified ◀──────────── "Accepted"    "Declined" or                   │
│       │                                           "Counter-Offer Sent"             │
│       ▼                                                                             │
│  12. Matches Tab → Confirm & Continue to Delivery                                  │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Counter-Offer Flow (New)

**Where it appears**
- **Matches tab** (both Shipper and Carrier)
- **View Details** screen
- Counter-offer banner shows when match is a counter-offer

**Shipper flow**
1. Matches tab → find **Carrier Requested** card.
2. Tap **3-dot menu** → **Counter Offer**.
3. Enter new price → **Send**.
4. Expected: Success message; counter-offer banner in **View Details**.

**Carrier flow**
1. Matches tab → find **Shipper Requested** card.
2. Tap **3-dot menu** → **Counter Offer**.
3. Enter new price → **Send**.
4. Expected: Success message; counter-offer banner in **View Details**.

**Counter-offer limits**
- Max **2 counter-offers** per negotiation.
- When limit is reached:
  - **Counter Offer** is hidden/disabled.
  - UI shows **"Counter-offer limit reached."**
  - Only **Accept** and **Decline** remain.

**Remaining counter-offers**
- The **CounterOfferStatusBanner** displays:
  - "X counter-offer(s) remaining" when remaining > 0
  - "Counter-offer limit reached" when remaining = 0

For full step-by-step QA flows and expected results, see:
`docs/CounterOffer_QA_Guide.md`

---

## Delivery Progress Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           DELIVERY PROGRESS                                         │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  After booking is CONFIRMED & PAID:                                                 │
│                                                                                     │
│  CARRIER ACTIONS                          SHIPPER SEES                              │
│  ──────────────                           ────────────                              │
│                                                                                     │
│  Matches Tab → Booking Card                                                         │
│       │                                                                             │
│       ▼                                                                             │
│  Status: "Confirmed"                      Status: "Confirmed"                       │
│       │                                                                             │
│       ▼                                                                             │
│  Tap "Mark Pickup" ──────────────────────▶ Status: "Picked Up"                     │
│       │                                                                             │
│       ▼                                                                             │
│  Enter Pickup Code (from Shipper)                                                   │
│       │                                                                             │
│       ▼                                                                             │
│  Status: "Picked Up"                                                                │
│       │                                                                             │
│       ▼                                                                             │
│  Tap "Start Transit" ────────────────────▶ Status: "In Transit"                    │
│       │                                    (Can track on map)                       │
│       ▼                                                                             │
│  Status: "In Transit"                                                               │
│       │                                                                             │
│       ▼                                                                             │
│  Tap "Mark Delivered" ───────────────────▶ Status: "Delivered"                     │
│       │                                    (Prompted to rate)                       │
│       ▼                                                                             │
│  Upload Delivery Photo                                                              │
│       │                                                                             │
│       ▼                                                                             │
│  Status: "Delivered"                                                                │
│  (Earnings added to balance)                                                        │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Part 1: Shipper - Request to Book a Trip

### Flow A: Browse and Request

```
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
                                
---
                                
## Counter-Offer Testing Guide (Shipper & Carrier)

### Prerequisites
- A request exists between a shipper and carrier (either flow is OK).
- Both users are signed in on separate devices or accounts.

### Shipper Counter-Offer (sender)
```
Shipper → Matches Tab
    └── Tap the match card (status: Carrier Requested)
        └── Match Details
            └── Tap "Decline"
                └── Counter-Offer sheet appears
                    └── Enter counter-offer amount
                        └── Submit
```
Expected:
- Carrier receives a notification. Counter-offer banner appears only when opening details from the notification.
- Shipper sees a success alert: "Counter-offer sent! The carrier has been notified."

### Carrier Counter-Offer
```
Carrier → Matches Tab
    └── Requests list (pending shipper requests)
        └── Tap "Decline" on a request card
            └── Counter-Offer prompt appears
                └── Enter counter-offer amount
                    └── Submit
```
Expected:
- Shipper receives a notification. Counter-offer banner appears only when opening details from the notification.
- Carrier sees a success alert: "Counter-offer submitted".

### Where to Verify UI
- Counter-offer banner shows only when arriving via counter-offer notification.
- Match Details shows updated pricing.
- Notifications show counter-offer messaging for the other party.
                                ├── Add message (optional)
                                └── Tap "Send Request"
                                    └── Success: "Request Sent!"
```

### Flow B: Track Your Request

```
Matches Tab (Shipper Mode)
    └── Find your request card
        └── Status shows "Awaiting Response"
            └── Wait for carrier to accept/decline
```

---

## Part 2: Carrier - Respond to Request

### Flow C: View Incoming Requests

```
Home Tab (Carrier Mode)
    └── See "Pending Requests" section
        └── Badge shows number of requests
            └── Tap request card OR go to Matches Tab
                └── Matches Tab
                    └── Filter: "Requests" chip
                        └── See list of pending requests
```

### Flow D: Accept a Request

```
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
```

### Flow E: Decline a Request

```
Request Details Screen
    └── Tap "Decline"
        └── Decline Options Sheet
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
```

---

## Part 3: Shipper - Confirm Booking

### Flow F: Accept Carrier's Acceptance

```
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
                            │   └── Confirmation dialog shows
                            │       "Your card ****1234 will be charged $XX"
                            │       └── Tap "Confirm & Pay"
                            │           └── Processing...
                            │               └── Success: "Booking Confirmed!"
                            │
                            └── IF no saved card:
                                └── "Add payment method" prompt
                                    └── Add card first, then confirm
```

---

## Part 4: Counter-Offer Flow

### Flow G: Respond to Counter-Offer (Shipper)

```
Shipper receives notification
    └── "Carrier proposed $XX"
        └── Matches Tab
            └── See counter-offer banner on booking
                └── Tap booking card
                    └── Counter-Offer Details
                        ├── Original price: $50 (crossed out)
                        ├── Counter-offer: $70
                        ├── Price difference: +$20
                        │
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
```

### Flow H: Counter-Offer Negotiation Example

```
Round 1: Shipper offers $50
         └── Carrier receives request

Round 2: Carrier counters with $70
         └── Shipper receives counter-offer

Round 3: Shipper counters with $60
         └── Carrier receives counter-offer

Round 4: Carrier accepts $60
         └── Booking proceeds with $60 price
             └── Shipper confirms → Auto-charged $60
```

---

## Part 5: Carrier - Deliver Package

### Flow I: Mark Pickup

```
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
```

### Flow J: Start Transit

```
Booking Details Screen
    └── Status: "Picked Up"
        └── Tap "Start Transit"
            └── Confirmation dialog
                └── Tap "Confirm"
                    └── Status → "In Transit"
                        └── Location tracking enabled
```

### Flow K: Mark Delivered

```
Booking Details Screen
    └── Status: "In Transit"
        └── Tap "Mark Delivered"
            └── Delivery Confirmation Sheet
                ├── Take delivery photo (required)
                ├── Enter delivery notes (optional)
                └── Tap "Confirm Delivery"
                    └── Success: Status → "Delivered"
                        └── Earnings added to carrier balance
```

---

## Part 6: Carrier - Initiate Offer

### Flow L: Browse Packages and Make Offer

```
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
```

---

## Part 7: Shipper - Respond to Carrier Offer

### Flow M: Accept Carrier's Offer

```
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
```

### Flow N: Decline Carrier's Offer

```
Offer Details Screen
    └── Tap "Decline"
        └── Decline Options
            ├── Tap "Decline" → Offer rejected
            └── Tap "Counter-Offer"
                └── Enter your price
                    └── Carrier receives your counter
```

---

## Part 8: Test Scenarios

### Test 1: Shipper Requests Trip (Happy Path)

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Home (Shipper) | Find a trip | Trip cards visible |
| 2 | Trip Card | Tap card | Trip Details opens |
| 3 | Trip Details | Tap "Request to Book" | Booking sheet opens |
| 4 | Booking Sheet | Select package | Package selected |
| 5 | Booking Sheet | Enter price $50 | Price shown |
| 6 | Booking Sheet | Tap "Send Request" | Success message |
| 7 | Matches Tab | Check status | "Awaiting Response" |

### Test 2: Carrier Accepts Request

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

### Test 3: Carrier Declines with Counter-Offer

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Request Details | Tap "Decline" | Decline sheet opens |
| 2 | Decline Sheet | Tap "Make Counter-Offer" | Counter sheet opens |
| 3 | Counter Sheet | Enter price $70 | Price shown |
| 4 | Counter Sheet | Add message | Message entered |
| 5 | Counter Sheet | Tap "Send" | Success message |
| 6 | Matches Tab | Check status | "Counter-Offer Sent" |

### Test 4: Shipper Responds to Counter-Offer

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Notification | Receive "Carrier proposed $70" | Notification shown |
| 2 | Matches Tab | See counter-offer banner | Banner visible |
| 3 | Booking Card | Tap card | Counter details shown |
| 4 | Counter Details | See price difference | "+$20" shown |
| 5a | Counter Details | Tap "Accept $70" | Proceeds to confirm |
| 5b | Counter Details | Tap "Counter Back" | Counter sheet opens |
| 5c | Counter Details | Tap "Decline" | Booking cancelled |

### Test 5: Shipper Confirms and Pays

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Matches Tab | Find "Pending Confirmation" | Card visible |
| 2 | Booking Card | Tap card | Details screen opens |
| 3 | Booking Details | Tap "Confirm Booking" | Dialog shows |
| 4 | Dialog | See card info | "Card ****1234" shown |
| 5 | Dialog | See amount | "$XX will be charged" |
| 6 | Dialog | Tap "Confirm & Pay" | Processing shown |
| 7 | Booking Details | Wait | "Confirmed & Paid" status |

### Test 6: Carrier Completes Delivery

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

### Test 7: Carrier Makes Offer to Shipper

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

### Test 8: Cancellation Flow

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Booking Details | Status: "Confirmed" | Cancel option visible |
| 2 | Booking Details | Tap "Cancel Booking" | Confirmation dialog |
| 3 | Dialog | Tap "Yes, Cancel" | Booking cancelled |
| 4 | Matches Tab | Check status | "Cancelled" |

---

## Part 9: Quick Navigation Reference

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

## Part 10: Status Reference

### Shipper View Statuses

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

### Carrier View Statuses

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

## Part 11: What to Verify After Each Test

### After Sending Request (Shipper)
- [ ] Success message shown
- [ ] Request appears in Matches Tab
- [ ] Status shows "Awaiting Response"
- [ ] Carrier receives notification

### After Accepting Request (Carrier)
- [ ] Success message shown
- [ ] Status changes to "Accepted"
- [ ] Shipper receives notification
- [ ] Chat conversation created

### After Counter-Offer
- [ ] Counter-offer sent successfully
- [ ] Other party receives notification
- [ ] Price difference shown clearly
- [ ] Original price crossed out

### After Confirming Booking (Shipper)
- [ ] Card charged successfully
- [ ] Status changes to "Confirmed"
- [ ] Transaction appears in history
- [ ] Pickup code generated

### After Pickup (Carrier)
- [ ] Pickup code verified
- [ ] Status changes to "Picked Up"
- [ ] Shipper notified
- [ ] Timestamp recorded

### After Delivery (Carrier)
- [ ] Delivery photo uploaded
- [ ] Status changes to "Delivered"
- [ ] Shipper prompted to rate
- [ ] Earnings added to balance

---

## Part 12: Common Issues & Solutions

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

## Part 13: Prerequisites for Testing

### Shipper Account Needs:
- [ ] At least one package created
- [ ] Saved payment method (for confirming bookings)

### Carrier Account Needs:
- [ ] At least one trip created
- [ ] Stripe payout setup (for receiving earnings)

### Test Data:
- Use test card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
