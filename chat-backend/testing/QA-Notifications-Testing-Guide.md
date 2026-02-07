# Notifications Testing Guide - UI Flow

## Overview

This guide covers all notification types in the Pasabayan app. Users receive notifications for booking updates, chat messages, payments, and more.

---

## How Notifications Work

**Two Types of Notifications:**
- **Push Notifications**: Appear on device lock screen and notification center (requires permission)
- **In-App Notifications**: Visible in the Notifications tab within the app

**When tapped**, notifications navigate to the relevant screen (booking details, chat, etc.)

---

## Notification Types Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           NOTIFICATION CATEGORIES                                   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  BOOKING NOTIFICATIONS                    DELIVERY NOTIFICATIONS                   │
│  ─────────────────────                    ──────────────────────                   │
│  • Match Request                          • Picked Up                              │
│  • Match Accepted                         • In Transit                             │
│  • Match Declined                         • Delivered                              │
│  • Counter Offer                          • Auto-Cancelled                         │
│                                                                                     │
│  PAYMENT NOTIFICATIONS                    OTHER NOTIFICATIONS                      │
│  ─────────────────────                    ───────────────────                      │
│  • Payment Received                       • Chat Message                           │
│  • Payment Released                       • Rating Received                        │
│  • Payout Completed                       • Premium Approved                       │
│  • Tip Received                           • Premium Rejected                       │
│  • Refund Processed                                                                │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Part 1: Booking Notifications

### Match Request
**When:** Carrier offers to carry your package OR Shipper requests your trip

| Who Receives | Trigger | Message Example |
|--------------|---------|-----------------|
| Shipper | Carrier offers to deliver | "John wants to carry your package" |
| Carrier | Shipper requests booking | "Sarah requested to book your trip" |

**Tap Action:** Opens booking/request details

---

### Match Accepted
**When:** The other party accepts your request/offer

| Who Receives | Trigger | Message Example |
|--------------|---------|-----------------|
| Shipper | Carrier accepted request | "John accepted your booking request" |
| Carrier | Shipper accepted offer | "Sarah accepted your delivery offer" |

**Tap Action:** Opens booking details with "Pending Confirmation" status

---

### Match Declined
**When:** The other party declines your request/offer

| Who Receives | Trigger | Message Example |
|--------------|---------|-----------------|
| Shipper | Carrier declined request | "John declined your booking request" |
| Carrier | Shipper declined offer | "Sarah declined your delivery offer" |

**Tap Action:** Opens booking details with "Declined" status

---

### Counter Offer
**When:** Other party proposes a different price

| Who Receives | Trigger | Message Example |
|--------------|---------|-----------------|
| Shipper | Carrier counter-offers | "John proposed $70 for your delivery" |
| Carrier | Shipper counter-offers | "Sarah offered $60 for the delivery" |

**Tap Action:** Opens booking details with counter-offer banner

---

## Part 2: Delivery Progress Notifications

### Picked Up
**When:** Carrier marks package as picked up

| Who Receives | Message Example |
|--------------|-----------------|
| Shipper | "Your package has been picked up by John" |

**Tap Action:** Opens booking details showing "Picked Up" status

---

### In Transit
**When:** Carrier starts transit

| Who Receives | Message Example |
|--------------|-----------------|
| Shipper | "Your package is now in transit" |

**Tap Action:** Opens booking details with tracking/map view

---

### Delivered
**When:** Carrier marks package as delivered

| Who Receives | Message Example |
|--------------|-----------------|
| Shipper | "Your package has been delivered!" |

**Tap Action:** Opens booking details with rating prompt

---

### Auto-Cancelled
**When:** Booking cancelled due to timeout or system action

| Who Receives | Message Example |
|--------------|-----------------|
| Both | "Booking #123 was auto-cancelled due to no response" |

**Tap Action:** Opens booking details showing "Cancelled" status

---

## Part 3: Payment Notifications

### Payment Received
**When:** Shipper's payment is captured

| Who Receives | Message Example |
|--------------|-----------------|
| Shipper | "Payment of $75.00 was successful" |

**Tap Action:** Opens transaction details

---

### Payment Released
**When:** Payment is released to carrier after delivery

| Who Receives | Message Example |
|--------------|-----------------|
| Carrier | "Payment of $70.00 has been released to your account" |

**Tap Action:** Opens earnings/transaction details

---

### Payout Completed
**When:** Carrier's earnings are transferred to bank

| Who Receives | Message Example |
|--------------|-----------------|
| Carrier | "Payout of $150.00 sent to your bank account" |

**Tap Action:** Opens payout history

---

### Tip Received
**When:** Shipper tips the carrier

| Who Receives | Message Example |
|--------------|-----------------|
| Carrier | "Sarah tipped you $10.00!" |

**Tap Action:** Opens transaction details

---

### Refund Processed
**When:** Refund is issued to shipper

| Who Receives | Message Example |
|--------------|-----------------|
| Shipper | "Refund of $75.00 has been processed" |

**Tap Action:** Opens transaction details

---

## Part 4: Other Notifications

### Chat Message
**When:** New message in booking chat

| Who Receives | Message Example |
|--------------|-----------------|
| Both | "John: Hi, I'll be there at 3pm" |

**Tap Action:** Opens chat conversation

---

### Rating Received
**When:** Other party rates you

| Who Receives | Message Example |
|--------------|-----------------|
| Both | "Sarah gave you 5 stars!" |

**Tap Action:** Opens rating details or profile

---

### Premium Approved
**When:** Premium verification is approved

| Who Receives | Message Example |
|--------------|-----------------|
| User | "Your premium verification has been approved!" |

**Tap Action:** Opens profile showing premium badge

---

### Premium Rejected
**When:** Premium verification is rejected

| Who Receives | Message Example |
|--------------|-----------------|
| User | "Your premium verification was not approved" |

**Tap Action:** Opens verification status with reason

---

## Part 5: Accessing Notifications

### View Notification History

```
Profile Tab
    └── Tap Bell Icon (top right)
        └── Notifications List Screen
            ├── See all notifications
            ├── Unread shown with dot indicator
            ├── Tap any notification to navigate
            └── "Mark All as Read" button
```

### Notification Badge

```
Profile Tab
    └── Bell icon shows unread count badge
        └── Badge shows number (e.g., "3")
            └── Badge disappears when all read
```

---

## Part 6: Notification Settings

### Enable/Disable Push Notifications

```
iPhone Settings App
    └── Scroll to "Pasabayan"
        └── Notifications
            ├── Allow Notifications: ON/OFF
            ├── Lock Screen: Show/Hide
            ├── Notification Center: Show/Hide
            ├── Banners: Show/Hide
            └── Sounds: ON/OFF
```

### In-App Notification Preferences

```
Profile Tab
    └── Settings
        └── Notifications
            ├── Booking Updates: ON/OFF
            ├── Chat Messages: ON/OFF
            ├── Payment Alerts: ON/OFF
            └── Promotional: ON/OFF
```

---

## Part 7: Test Scenarios

### Test 1: Permission Flow (First Time)

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | App Launch (first time) | Wait for prompt | "Allow Notifications?" dialog |
| 2 | Dialog | Tap "Allow" | Permission granted |
| 3 | Profile Tab | Check bell icon | Bell icon visible |

### Test 2: Receive Booking Notification

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Any screen | Carrier accepts your request | Push notification appears |
| 2 | Lock screen | See notification | Title and message visible |
| 3 | Notification | Tap notification | Opens booking details |
| 4 | Booking Details | Check status | Shows "Accepted" |

### Test 3: Counter-Offer Notification

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Any screen | Receive counter-offer | Push notification appears |
| 2 | Notification | Read message | Shows new price proposed |
| 3 | Notification | Tap notification | Opens booking with counter-offer |
| 4 | Booking Details | See banner | Counter-offer details visible |

### Test 4: Delivery Progress Notifications

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | - | Carrier marks pickup | "Picked Up" notification |
| 2 | - | Carrier starts transit | "In Transit" notification |
| 3 | - | Carrier completes delivery | "Delivered" notification |
| 4 | Notification | Tap any | Opens booking with correct status |

### Test 5: Payment Notification (Carrier)

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | - | Delivery completed | "Payment Released" notification |
| 2 | Notification | Read message | Shows amount earned |
| 3 | Notification | Tap notification | Opens transaction details |
| 4 | Transaction | Check amount | Correct amount displayed |

### Test 6: Chat Message Notification

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Outside chat | Other user sends message | Push notification appears |
| 2 | Notification | Read preview | Shows sender name and message |
| 3 | Notification | Tap notification | Opens chat conversation |
| 4 | Chat | Check message | New message visible |

### Test 7: View Notification History

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Profile Tab | Check bell icon | Badge shows unread count |
| 2 | Profile Tab | Tap bell icon | Notification list opens |
| 3 | List | See notifications | All notifications listed |
| 4 | List | Tap "Mark All as Read" | All marked as read |
| 5 | Profile Tab | Check bell icon | Badge disappears |

### Test 8: Notification When App Closed

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Home screen | Close app completely | App not running |
| 2 | - | Trigger notification | Push appears on lock screen |
| 3 | Lock screen | Tap notification | App opens to relevant screen |

### Test 9: Notification When App in Background

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Any screen | Press home button | App in background |
| 2 | - | Trigger notification | Push banner appears |
| 3 | Banner | Tap banner | Returns to app, opens relevant screen |

### Test 10: Notification When App in Foreground

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Any screen | Keep app open | App active |
| 2 | - | Trigger notification | In-app banner appears (top) |
| 3 | Banner | Tap banner | Navigates to relevant screen |

---

## Part 8: Quick Navigation Reference

| Notification Type | Tap Destination |
|-------------------|-----------------|
| Match Request | Booking/Request Details |
| Match Accepted | Booking Details |
| Match Declined | Booking Details |
| Counter Offer | Booking Details (with counter banner) |
| Picked Up | Booking Details |
| In Transit | Booking Details (with tracking) |
| Delivered | Booking Details (with rating prompt) |
| Auto-Cancelled | Booking Details |
| Payment Received | Transaction Details |
| Payment Released | Transaction/Earnings Details |
| Payout Completed | Payout History |
| Tip Received | Transaction Details |
| Refund Processed | Transaction Details |
| Chat Message | Chat Conversation |
| Rating Received | Profile/Rating Details |
| Premium Approved | Profile |
| Premium Rejected | Verification Status |

---

## Part 9: Notification Icons Reference

| Type | Icon | Color |
|------|------|-------|
| Match Request | 📦 Box | Orange |
| Match Accepted | ✅ Checkmark | Green |
| Match Declined | ❌ X-mark | Red |
| Counter Offer | ↔️ Arrows | Purple |
| Picked Up | 🚚 Truck | Purple |
| In Transit | 🚗 Car | Purple |
| Delivered | ✓ Seal | Purple |
| Auto-Cancelled | ⏰ Clock | Orange |
| Payment Received | 💳 Card | Green |
| Payment Released | 💵 Dollar | Green |
| Payout Completed | 💴 Banknote | Green |
| Tip Received | 🎁 Gift | Orange |
| Refund Processed | ↩️ Return | Blue |
| Chat Message | 💬 Message | Blue |
| Rating Received | ⭐ Star | Yellow |
| Premium Approved | 🛡️ Shield | Green |
| Premium Rejected | 🛡️❌ Shield | Red |

---

## Part 10: What to Verify After Each Test

### After Receiving Push Notification
- [ ] Notification appears on lock screen
- [ ] Title is correct
- [ ] Message preview is accurate
- [ ] Tap opens correct screen
- [ ] Unread badge increases

### After Viewing Notification History
- [ ] All notifications appear in list
- [ ] Unread notifications have indicator
- [ ] Newest notifications at top
- [ ] Time ago shows correctly
- [ ] Icons match notification type

### After Tapping Notification
- [ ] Correct screen opens
- [ ] Data is loaded properly
- [ ] Notification marked as read
- [ ] Badge count decreases
- [ ] Back navigation works

### After Mark All as Read
- [ ] All notifications marked as read
- [ ] Badge disappears
- [ ] Read indicators removed
- [ ] Success message shown

---

## Part 11: Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| No push notifications | Permission denied | Enable in iPhone Settings → Pasabayan → Notifications |
| Notifications delayed | Network issues | Check internet connection |
| Badge not updating | Cache issue | Pull to refresh notification list |
| Tap doesn't navigate | App in bad state | Force close and reopen app |
| Missing notifications | Logged out | Log in to receive notifications |
| Notification sound off | Sound disabled | Enable in iPhone Settings |

---

## Part 12: Prerequisites for Testing

### Device Requirements
- [ ] Real iOS device (push notifications don't work in simulator)
- [ ] Notification permission granted
- [ ] Internet connection active
- [ ] Logged into test account

### Test Accounts Needed
- [ ] Shipper account (to receive carrier notifications)
- [ ] Carrier account (to receive shipper notifications)
- [ ] Second device or tester (to trigger notifications)

### How to Trigger Test Notifications

| Notification | How to Trigger |
|--------------|----------------|
| Match Request | Have carrier offer to deliver your package |
| Match Accepted | Accept a request from other account |
| Counter Offer | Decline with counter-offer from other account |
| Chat Message | Send message from other account |
| Delivery Updates | Progress booking through pickup → transit → deliver |
| Payment | Complete a booking flow |
| Rating | Rate from other account after delivery |

---

## Part 13: Notification Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           NOTIFICATION FLOW                                         │
│                                                                                     │
│  Backend Event                                                                      │
│       │                                                                             │
│       ▼                                                                             │
│  Firebase Cloud Messaging                                                           │
│       │                                                                             │
│       ▼                                                                             │
│  ┌─────────────────────────────────────────┐                                       │
│  │          APP STATE CHECK                │                                       │
│  └────────────────┬────────────────────────┘                                       │
│                   │                                                                 │
│     ┌─────────────┼─────────────┐                                                  │
│     ▼             ▼             ▼                                                  │
│  CLOSED      BACKGROUND     FOREGROUND                                             │
│     │             │             │                                                  │
│     ▼             ▼             ▼                                                  │
│  Lock Screen   Banner       In-App                                                 │
│  Notification  Notification Banner                                                 │
│     │             │             │                                                  │
│     └─────────────┼─────────────┘                                                  │
│                   │                                                                 │
│                   ▼                                                                 │
│            User Taps Notification                                                  │
│                   │                                                                 │
│                   ▼                                                                 │
│            App Opens/Navigates                                                     │
│                   │                                                                 │
│                   ▼                                                                 │
│            Relevant Screen                                                         │
│            (Booking, Chat, etc.)                                                   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Part 14: Related Documentation

- [QA Payment Testing Guide](./QA-Payment-Testing-Guide.md)
- [QA Payout Testing Guide](./QA_PAYOUT_TESTING_GUIDE.md)
- [QA Auto Charge Testing Guide](./QA_AUTO_CHARGE_TESTING_GUIDE.md)
- [Testing Guide](./TESTING_GUIDE.md)
- [Testing Instructions](./TESTING_INSTRUCTIONS.md)
