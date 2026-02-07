# Auto-Charge & Payout QA Testing Guide

A comprehensive guide for QA testers to verify the auto-charge payment flow and payout status features.

---

## Overview

### What is Auto-Charge?

When a **Shipper** confirms a match with a carrier, the system automatically charges their default payment method. This eliminates the need for a separate payment step after matching.

### Key Components

| Component | Description |
|-----------|-------------|
| **Auto-Charge Confirmation Sheet** | Modal shown when shipper confirms a match |
| **Payment Method Check** | Verifies shipper has a default card before confirming |
| **Error Handling** | Handles missing cards, payment failures, network issues |
| **Payout Status** | Shows carrier's payout setup status |

---

## Prerequisites

### Test Environment Setup

1. **Two test accounts:**
   - Shipper account (with package request)
   - Carrier account (with active trip)

2. **Test Stripe credentials:**
   ```
   Test Card:     4242 4242 4242 4242
   Expiry:        12/34 (any future date)
   CVC:           123 (any 3 digits)
   ZIP:           12345
   ```

3. **Decline test card** (for failure testing):
   ```
   Card Number:   4000 0000 0000 0002
   (This card will always be declined)
   ```

4. **Test bank account** (for carrier payouts):
   ```
   Routing:       110000000
   Account:       000123456789
   ```

---

## Part 1: Auto-Charge Confirmation Flow

### Test 1.1: Happy Path - Successful Auto-Charge

**Preconditions:**
- Shipper has a default payment method set
- Shipper has a pending match with a carrier
- Carrier has accepted the shipper's package request

**Steps:**
1. Log in as **Shipper**
2. Navigate to **Deliveries** tab
3. Find a match in **Pending** status
4. Tap on the match to open details
5. Tap **Confirm Match** button
6. Auto-Charge Confirmation Sheet appears

**Expected Results:**
- [ ] Sheet shows "Ready to Confirm" state
- [ ] Displays the agreed price (e.g., "CAD $50.00")
- [ ] Shows card info: "Card ending in 4242"
- [ ] Shows "Confirm & Pay" button
- [ ] Shows "Use a different card" link

**Continue:**
7. Tap **Confirm & Pay**
8. Wait for processing

**Expected Results:**
- [ ] Shows "Confirming match..." loading state
- [ ] Shows "Match Confirmed!" success state
- [ ] Shows "Payment is being processed" message
- [ ] Sheet auto-dismisses after ~1 second
- [ ] Match status updates to "Confirmed"

---

### Test 1.2: No Default Payment Method

**Preconditions:**
- Shipper has NO payment methods saved
- Shipper has a pending match

**Steps:**
1. Log in as **Shipper** (no saved cards)
2. Navigate to a pending match
3. Tap **Confirm Match**

**Expected Results:**
- [ ] Sheet shows "Payment Method Required" state
- [ ] Orange credit card icon displayed
- [ ] Message: "To confirm this match, you need to add a payment method..."
- [ ] Shows "Add Payment Method" button

**Continue:**
4. Tap **Add Payment Method**
5. Complete Stripe card setup
6. Return to app

**Expected Results:**
- [ ] Sheet transitions to "Ready to Confirm" state
- [ ] New card is displayed
- [ ] Can proceed with confirmation

---

### Test 1.3: Payment Method Removed During Confirmation

**Preconditions:**
- Shipper has a default payment method
- Payment method is removed/invalidated on Stripe's end between loading and confirming

**Steps:**
1. Start the confirm flow (see Test 1.1)
2. Tap **Confirm & Pay**
3. (Simulate: backend returns `shipper_has_default_payment_method: false`)

**Expected Results:**
- [ ] Sheet shows "Payment Method Needed" state
- [ ] Orange credit card icon displayed
- [ ] Message: "We couldn't start auto-charge because no default card was found..."
- [ ] Shows "Add Payment Method" button
- [ ] Shows "Close" button
- [ ] Match IS confirmed but payment needs retry

---

### Test 1.4: Payment Failure

**Preconditions:**
- Shipper has the decline test card (4000 0000 0000 0002) as default
- Has a pending match

**Steps:**
1. Log in as **Shipper**
2. Navigate to pending match
3. Tap **Confirm Match**
4. Verify card ending shows on confirmation screen
5. Tap **Confirm & Pay**

**Expected Results:**
- [ ] Sheet shows "Something went wrong" error state
- [ ] Red warning triangle icon displayed
- [ ] Error message mentions payment failure
- [ ] Shows "Try Again" button
- [ ] Shows "Cancel" button

**Continue:**
6. Tap **Try Again**

**Expected Results:**
- [ ] Returns to "Ready to Confirm" state
- [ ] Can add different payment method
- [ ] Can retry confirmation

---

### Test 1.5: Use Different Card

**Preconditions:**
- Shipper has a default payment method
- Has a pending match

**Steps:**
1. Start confirm flow (sheet shows "Ready to Confirm")
2. Tap **Use a different card** link

**Expected Results:**
- [ ] Stripe payment sheet opens
- [ ] Can add new card or select existing
- [ ] After completion, returns to confirmation sheet
- [ ] New card info displayed

---

### Test 1.6: Cancel Confirmation

**Preconditions:**
- Confirmation sheet is open

**Steps:**
1. Open Auto-Charge Confirmation sheet
2. Tap **Cancel** button (top-left)

**Expected Results:**
- [ ] Sheet dismisses
- [ ] No changes to match status
- [ ] Can re-open and try again

---

## Part 2: Carrier Payout Setup (Stripe Connect)

This is where **Carriers** connect their bank account to receive payments.

### Test 2.1: New Carrier - Payout Not Set Up

**Preconditions:**
- Carrier has NOT started Stripe Connect onboarding
- Carrier mode is active (not Shipper mode)

**Steps:**
1. Log in as **Carrier**
2. Navigate to **Profile** tab
3. Scroll to **Payments** section
4. Tap **Payout Setup**

**Expected Results:**
- [ ] Shows "Set Up Payouts" state
- [ ] Blue credit card icon (large, 48pt)
- [ ] Title: "Set Up Payouts"
- [ ] Description: "Connect your bank account to receive payments..."
- [ ] Info card shows "What you'll need:":
  - [ ] Government-issued ID
  - [ ] Bank account details
  - [ ] Address verification
- [ ] Shows "Secure verification powered by Stripe" badge
- [ ] Shows "Set Up Payouts" button (primary style)

---

### Test 2.2: Starting Payout Setup

**Preconditions:**
- On "Set Up Payouts" screen

**Steps:**
1. Tap **Set Up Payouts** button
2. Safari opens with Stripe Connect onboarding

**Expected Results:**
- [ ] Button shows loading spinner while preparing
- [ ] Safari opens in-app (not external browser)
- [ ] Stripe Connect form loads
- [ ] Form asks for:
  - [ ] Personal information (name, DOB, address)
  - [ ] Bank account (routing + account number)
  - [ ] Identity verification

**Test with test bank details:**
```
Routing Number: 110000000
Account Number: 000123456789
```

---

### Test 2.3: Incomplete Payout Setup

**Preconditions:**
- Carrier started but didn't finish Stripe onboarding

**Steps:**
1. Start payout setup (Test 2.2)
2. Close Safari **before** completing all steps
3. Return to Pasabayan app
4. Go back to **Profile** → **Payout Setup**

**Expected Results:**
- [ ] Shows "Setup Incomplete" state
- [ ] Orange clock icon (large, 48pt)
- [ ] Title: "Setup Incomplete"
- [ ] Description: "You started the setup but didn't finish..."
- [ ] Shows "Continue Setup" button
- [ ] Tapping button resumes where you left off

---

### Test 2.4: Completed Payout Setup

**Preconditions:**
- Carrier has completed ALL Stripe Connect onboarding steps

**Steps:**
1. Complete Stripe onboarding (all verification steps)
2. Close Safari and return to app
3. Go to **Profile** → **Payout Setup**

**Expected Results:**
- [ ] Shows "Payouts Active" state
- [ ] Green checkmark icon (large, 48pt)
- [ ] Title: "Payouts Active"
- [ ] Description: "You're all set to receive payments..."
- [ ] Info card shows:
  - [ ] "Your payout account is active" with seal icon
  - [ ] "Payments: Enabled" (green checkmark)
  - [ ] "Payouts: Enabled" (green checkmark)
  - [ ] "Connected on [date]"
- [ ] Shows "View Stripe Dashboard" button

---

### Test 2.5: View Stripe Dashboard

**Preconditions:**
- Payout setup is complete

**Steps:**
1. On Payout Setup screen (active state)
2. Tap **View Stripe Dashboard**

**Expected Results:**
- [ ] Safari opens with Stripe Express dashboard
- [ ] Can view bank account info
- [ ] Can view payout schedule
- [ ] Can view pending/completed payouts
- [ ] Closing Safari returns to app

---

## Part 3: Payout Status in Transactions

This shows **how the payout is progressing** for a specific transaction.

### Payout Status States

| Status | Badge Color | Icon | Description |
|--------|-------------|------|-------------|
| **null** | Gray | `minus.circle` | "Awaiting Delivery" - No payout initiated yet |
| **pending** | Gray | `hourglass` | "Pending" - Payout will be processed shortly |
| **processing** | Orange | `clock` | "Processing" - Funds being transferred |
| **completed** | Green | `checkmark.circle.fill` | "Paid" - Carrier received money |
| **failed** | Red | `exclamationmark.circle.fill` | "Failed" - Transfer failed |

---

### Test 3.1: View Payout Status - Awaiting Delivery

**Preconditions:**
- Carrier has a transaction where delivery is not yet complete

**Steps:**
1. Log in as **Carrier**
2. Go to **Profile** → **Transaction History**
3. Filter by **Carrier** tab
4. Tap on a transaction in "Authorized" or early status

**Expected Results:**
- [ ] PayoutStatusCard may not appear (or shows "Awaiting Delivery")
- [ ] No payout timing info shown

---

### Test 3.2: View Payout Status - Pending

**Preconditions:**
- Delivery is completed, payout initiated

**Steps:**
1. Find a transaction where delivery just completed
2. View transaction details

**Expected Results:**
- [ ] PayoutStatusCard appears
- [ ] Shows "Payout Status" header
- [ ] Badge shows "Pending" (gray, hourglass icon)
- [ ] Shows "Carrier Earnings: $XX.XX" in green
- [ ] Info text: "Payout will be processed shortly"

---

### Test 3.3: View Payout Status - Processing

**Preconditions:**
- Payout has been initiated and is being transferred

**Steps:**
1. Find a transaction with processing payout
2. View transaction details

**Expected Results:**
- [ ] Badge shows "Processing" (orange, clock icon)
- [ ] Info text: "Funds are being transferred to the carrier's bank"

---

### Test 3.4: View Payout Status - Completed

**Preconditions:**
- Payout has been successfully deposited

**Steps:**
1. Find a transaction with completed payout
2. View transaction details

**Expected Results:**
- [ ] Badge shows "Paid" (green, checkmark icon)
- [ ] Info text: "Paid on [date]" or "Payment completed"
- [ ] Date shown if available

---

### Test 3.5: View Payout Status - Failed

**Preconditions:**
- Payout failed (e.g., invalid bank account)

**Steps:**
1. Find a transaction with failed payout
2. View transaction details

**Expected Results:**
- [ ] Badge shows "Failed" (red, exclamation icon)
- [ ] Error message box appears (red background)
- [ ] Shows error notes (e.g., "Transfer failed: card declined")
- [ ] Info text: "Contact support for assistance"

---

### Test 3.6: Payout Status Card Visual Verification

**For each payout status, verify the PayoutStatusCard:**

- [ ] "Payout Status" header is bold
- [ ] Badge is right-aligned in header row
- [ ] "Carrier Earnings" shows correct amount
- [ ] Amount is green and bold
- [ ] Info row has blue info icon
- [ ] Failed state shows red error box with warning triangle

---

## Part 4: Edge Cases & Error Handling

### Test 4.1: Network Error During Confirmation

**Steps:**
1. Enable airplane mode
2. Try to confirm a match
3. Tap **Confirm & Pay**

**Expected Results:**
- [ ] Shows error state
- [ ] Error message indicates network issue
- [ ] "Try Again" button available
- [ ] Disabling airplane mode and retrying works

---

### Test 4.2: Session Timeout

**Steps:**
1. Open confirmation sheet
2. Wait 10+ minutes (session may expire)
3. Tap **Confirm & Pay**

**Expected Results:**
- [ ] Either succeeds normally OR
- [ ] Shows appropriate error with retry option
- [ ] Does NOT crash or hang

---

### Test 4.3: Background/Foreground During Payment

**Steps:**
1. Open confirmation sheet
2. Tap **Confirm & Pay**
3. Immediately switch to another app
4. Wait 10 seconds
5. Return to Pasabayan

**Expected Results:**
- [ ] App recovers gracefully
- [ ] Shows final state (success or error)
- [ ] No duplicate charges

---

## Part 5: UI/UX Verification

### Visual Checklist

For each state of the Auto-Charge Confirmation Sheet:

#### "Checking payment method..." (Loading)
- [ ] Spinner is visible and animating
- [ ] Text is centered
- [ ] No buttons visible during load

#### "Payment Method Required" (No Card)
- [ ] Orange credit card icon (60pt)
- [ ] Title: "Payment Method Required"
- [ ] Body text explains the situation
- [ ] "Add Payment Method" button (large, primary style)

#### "Ready to Confirm" (Has Card)
- [ ] Green shield checkmark icon (60pt)
- [ ] Title: "Ready to Confirm"
- [ ] Price displayed prominently (32pt bold)
- [ ] Card info shown with credit card icon
- [ ] "Confirm & Pay" button (large, primary style)
- [ ] "Use a different card" link below

#### "Confirming match..." (Processing)
- [ ] Spinner visible
- [ ] Text: "Confirming match..."
- [ ] Buttons disabled/hidden

#### "Match Confirmed!" (Success)
- [ ] Large green checkmark (80pt)
- [ ] Title: "Match Confirmed!"
- [ ] Subtitle: "Payment is being processed"
- [ ] Auto-dismisses after delay

#### "Something went wrong" (Error)
- [ ] Red warning triangle icon (60pt)
- [ ] Title: "Something went wrong"
- [ ] Error message displayed
- [ ] "Try Again" button (large, primary style)
- [ ] "Cancel" button (text style)

#### "Payment Method Needed" (Post-Confirm No Card)
- [ ] Orange credit card icon (60pt)
- [ ] Title: "Payment Method Needed"
- [ ] Explains auto-charge couldn't start
- [ ] "Add Payment Method" button
- [ ] "Close" button

---

## Automated UI Test Coverage

The following automated tests exist in `PasabayanUITests/Flows/Payments/`:

| Test File | Test Cases |
|-----------|------------|
| `AutoChargeConfirmationFlowTests.swift` | No default card shows payment required |
| | Default removed after confirm shows payment needed |
| | Confirm failure shows error state |
| `PayoutStatusFlowTests.swift` | Payout status UI states |

### Running Automated Tests

```bash
# Run all payment flow tests
xcodebuild test -scheme Pasabayan \
  -destination 'platform=iOS Simulator,name=iPhone 17,OS=26.0' \
  -only-testing:PasabayanUITests/AutoChargeConfirmationFlowTests

# Run payout status tests
xcodebuild test -scheme Pasabayan \
  -destination 'platform=iOS Simulator,name=iPhone 17,OS=26.0' \
  -only-testing:PasabayanUITests/PayoutStatusFlowTests
```

---

## Test Results Template

### Tester Information
- **Tester Name:** _______________
- **Date:** _______________
- **App Version:** _______________
- **Device:** _______________
- **iOS Version:** _______________

### Results Summary

| Test ID | Test Name | Pass/Fail | Notes |
|---------|-----------|-----------|-------|
| **Auto-Charge Flow** | | | |
| 1.1 | Happy Path - Successful Payment | | |
| 1.2 | No Default Payment Method | | |
| 1.3 | Card Removed During Confirm | | |
| 1.4 | Payment Failure (Decline Card) | | |
| 1.5 | Use Different Card | | |
| 1.6 | Cancel Confirmation | | |
| **Carrier Payout Setup** | | | |
| 2.1 | New Carrier - Not Set Up | | |
| 2.2 | Starting Payout Setup | | |
| 2.3 | Incomplete Payout Setup | | |
| 2.4 | Completed Payout Setup | | |
| 2.5 | View Stripe Dashboard | | |
| **Payout Status in Transactions** | | | |
| 3.1 | Payout Status - Awaiting Delivery | | |
| 3.2 | Payout Status - Pending | | |
| 3.3 | Payout Status - Processing | | |
| 3.4 | Payout Status - Completed | | |
| 3.5 | Payout Status - Failed | | |
| 3.6 | Payout Status Card UI | | |
| **Edge Cases** | | | |
| 4.1 | Network Error | | |
| 4.2 | Session Timeout | | |
| 4.3 | Background/Foreground | | |

### Issues Found

| Issue # | Description | Severity | Steps to Reproduce |
|---------|-------------|----------|-------------------|
| | | | |

---

## Reporting Bugs

When reporting issues, include:

1. **Test case ID** (e.g., Test 1.4)
2. **Expected vs Actual behavior**
3. **Screenshots/Screen recordings**
4. **Device and iOS version**
5. **App version**
6. **Console logs** (if available via Xcode)
7. **Stripe test mode transaction ID** (if applicable)

---

*Document Version: 1.0*
*Last Updated: January 2026*
