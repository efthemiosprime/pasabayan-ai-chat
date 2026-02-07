# Carrier Payout QA Testing Guide

A comprehensive guide for QA testers to verify the carrier payout system, including Stripe Connect onboarding and payout status tracking.

---

## Overview

### What is the Payout System?

The payout system allows **Carriers** to receive payments for completed deliveries. It consists of:

1. **Payout Setup** - Carrier connects their bank account via Stripe Connect
2. **Payout Status** - Tracks when/how money is transferred to the carrier

### Key Screens

| Screen | Location | Purpose |
|--------|----------|---------|
| **PayoutSetupView** | Profile → Payout Setup | Connect bank account |
| **TransactionDetailView** | Transaction History → Transaction | View payout status |
| **PayoutStatusCard** | Inside TransactionDetailView | Shows payout progress |
| **PayoutStatusBadge** | Transaction cards & details | Quick status indicator |

---

## Prerequisites

### Test Environment

1. **Carrier test account** with active carrier role
2. **Shipper test account** to create transactions

### Test Bank Account (Stripe Test Mode)
```
Routing Number: 110000000
Account Number: 000123456789
```

### Test SSN (for identity verification)
```
SSN: 000-00-0000 (use all zeros in test mode)
```

---

## Part 1: Carrier Payout Setup (Stripe Connect)

### Test 1.1: Accessing Payout Setup

**Preconditions:**
- Logged in as Carrier
- Carrier role is active (not Shipper mode)

**Steps:**
1. Go to **Profile** tab
2. Scroll to **Payments** section
3. Tap **Payout Setup**

**Expected Results:**
- [ ] Payout Setup screen opens
- [ ] Shows one of three states based on setup progress

---

### Test 1.2: New Carrier - No Payout Setup

**Preconditions:**
- Carrier has NEVER started Stripe Connect onboarding

**Steps:**
1. Access Payout Setup (Test 1.1)

**Expected Results:**
- [ ] **Icon:** Blue credit card (large, ~48pt)
- [ ] **Title:** "Set Up Payouts"
- [ ] **Description:** "Connect your bank account to receive payments when you complete deliveries."
- [ ] **Info Card shows "What you'll need:"**
  - [ ] Government-issued ID (person icon)
  - [ ] Bank account details (building icon)
  - [ ] Address verification (house icon)
- [ ] **Security badge:** "Secure verification powered by Stripe" (lock icon, green)
- [ ] **Button:** "Set Up Payouts" (primary style, full width)

**Screenshot checkpoint:** Capture this state

---

### Test 1.3: Starting Stripe Connect Onboarding

**Preconditions:**
- On "Set Up Payouts" screen

**Steps:**
1. Tap **Set Up Payouts** button
2. Wait for Safari to open

**Expected Results:**
- [ ] Button shows loading spinner
- [ ] Safari opens in-app (SFSafariViewController)
- [ ] Stripe Connect form loads
- [ ] URL contains "connect.stripe.com"

**Continue with Stripe Form:**
3. Fill in personal information:
   - First/Last name
   - Date of birth
   - Address
4. Enter bank details (use test values above)
5. Complete identity verification

**Expected Results during form:**
- [ ] Form validates inputs in real-time
- [ ] Can navigate back/forward in multi-step form
- [ ] Progress indicator shows completion status

---

### Test 1.4: Incomplete Setup - Closing Early

**Preconditions:**
- Started Stripe onboarding

**Steps:**
1. Start onboarding (Test 1.3)
2. Complete at least one step
3. Close Safari **before** finishing all steps
4. Return to Pasabayan app
5. Navigate back to **Payout Setup**

**Expected Results:**
- [ ] **Icon:** Orange clock (large, ~48pt)
- [ ] **Title:** "Setup Incomplete"
- [ ] **Description:** "You started the setup but didn't finish. Complete verification to receive payments."
- [ ] **Button:** "Continue Setup" (primary style)
- [ ] Tapping button opens Safari and resumes where you left off

**Screenshot checkpoint:** Capture incomplete state

---

### Test 1.5: Completed Payout Setup

**Preconditions:**
- Complete ALL Stripe Connect steps

**Steps:**
1. Finish Stripe onboarding completely
2. Close Safari
3. Return to Payout Setup screen (may need to pull-to-refresh or re-open)

**Expected Results:**
- [ ] **Icon:** Green checkmark in circle (large, ~48pt)
- [ ] **Title:** "Payouts Active"
- [ ] **Description:** "You're all set to receive payments from deliveries. Funds will be deposited to your bank account."
- [ ] **Info Card shows:**
  - [ ] Green seal: "Your payout account is active"
  - [ ] "Payments" row: green checkmark + "Enabled"
  - [ ] "Payouts" row: green checkmark + "Enabled"
  - [ ] "Connected on [date]" timestamp
- [ ] **Button:** "View Stripe Dashboard" (primary style)

**Screenshot checkpoint:** Capture active state

---

### Test 1.6: View Stripe Dashboard

**Preconditions:**
- Payout setup is complete (Test 1.5)

**Steps:**
1. On "Payouts Active" screen
2. Tap **View Stripe Dashboard**

**Expected Results:**
- [ ] Safari opens with Stripe Express dashboard
- [ ] Dashboard shows:
  - [ ] Bank account info (last 4 digits)
  - [ ] Payout schedule
  - [ ] Any pending payouts
  - [ ] Completed payouts history
- [ ] Closing Safari returns to app

---

### Test 1.7: Error Loading Payout Status

**Steps:**
1. Turn on Airplane mode
2. Open Payout Setup

**Expected Results:**
- [ ] Shows loading state initially
- [ ] Then shows error message (red)
- [ ] Error explains network issue
- [ ] Can retry when connection restored

---

## Part 2: Payout Status in Transactions

This tracks the **progress of money transfer** to the carrier for each transaction.

### Payout Status States Reference

| Status | Badge Text | Badge Color | Icon | Meaning |
|--------|------------|-------------|------|---------|
| `nil` | "Awaiting Delivery" | Gray | `minus.circle` | No payout initiated |
| `pending` | "Pending" | Gray | `hourglass` | Queued for processing |
| `processing` | "Processing" | Orange | `clock` | Transfer in progress |
| `completed` | "Paid" | Green | `checkmark.circle.fill` | Money deposited |
| `failed` | "Failed" | Red | `exclamationmark.circle.fill` | Transfer failed |

---

### Test 2.1: Payout Status - Awaiting Delivery

**Preconditions:**
- Carrier has a transaction that's authorized but delivery not complete

**Steps:**
1. Log in as **Carrier**
2. Go to **Profile** → **Transaction History**
3. Tap **Carrier** filter tab
4. Find a transaction in "Authorized" status
5. Tap to view details

**Expected Results:**
- [ ] PayoutStatusCard may not appear OR
- [ ] Shows "Awaiting Delivery" badge (gray)
- [ ] No payout timing information shown

---

### Test 2.2: Payout Status - Pending

**Preconditions:**
- Delivery completed, payment captured
- Payout not yet processed by Stripe

**Steps:**
1. Find transaction where delivery just completed
2. View transaction details

**Expected Results:**
- [ ] **PayoutStatusCard appears** with:
  - [ ] Header: "Payout Status"
  - [ ] Badge: "Pending" (gray background, hourglass icon)
  - [ ] "Carrier Earnings: $XX.XX" (green, bold)
  - [ ] Info: "Payout will be processed shortly" (blue info icon)

---

### Test 2.3: Payout Status - Processing

**Preconditions:**
- Payout has been initiated by Stripe

**Steps:**
1. Find transaction with processing payout
2. View transaction details

**Expected Results:**
- [ ] Badge: "Processing" (orange background, clock icon)
- [ ] Info: "Funds are being transferred to the carrier's bank"

---

### Test 2.4: Payout Status - Completed (Paid)

**Preconditions:**
- Payout successfully deposited to carrier's bank

**Steps:**
1. Find transaction with completed payout
2. View transaction details

**Expected Results:**
- [ ] Badge: "Paid" (green background, checkmark icon)
- [ ] Info shows one of:
  - [ ] "Paid on [date]" (if timestamp available)
  - [ ] "Payment completed" (if no timestamp)

---

### Test 2.5: Payout Status - Failed

**Preconditions:**
- Payout failed (invalid bank, etc.)

**Steps:**
1. Find transaction with failed payout
2. View transaction details

**Expected Results:**
- [ ] Badge: "Failed" (red background, exclamation icon)
- [ ] **Error box appears** (red background):
  - [ ] Warning triangle icon
  - [ ] Error message (e.g., "Transfer failed: card declined")
- [ ] Info: "Contact support for assistance"

---

### Test 2.6: PayoutStatusCard UI Verification

**For any transaction with payout status, verify:**

- [ ] Card has gray background (`systemGray6`)
- [ ] Card has 12pt corner radius
- [ ] Card has 16pt padding
- [ ] Header row: "Payout Status" (headline, bold) + badge (right-aligned)
- [ ] Earnings row: "Carrier Earnings" (secondary) + amount (green, bold, title3)
- [ ] Info row: blue info icon + descriptive text (caption, secondary)
- [ ] Failed state: additional red error box below info row

---

## Part 3: Full Payout Flow (End-to-End)

### Test 3.1: Complete Delivery to Payout Flow

**Setup:**
- Carrier A: Payout setup complete
- Shipper B: Has payment method

**Steps:**

1. **Shipper creates package request**
2. **Carrier offers to deliver**
3. **Shipper accepts and pays** (auto-charge or manual)
4. **Carrier picks up package** (status: picked_up)
5. **Carrier delivers package** (status: delivered)
6. **Shipper confirms delivery** (status: completed)
7. **Check payout status progression:**
   - Immediately: Pending or Processing
   - After Stripe processes: Completed

**Expected Results:**
- [ ] Transaction appears in both users' history
- [ ] Carrier sees payout status update over time
- [ ] Final status shows "Paid" with date
- [ ] Amount matches agreed price minus platform fee

---

## Part 4: Edge Cases

### Test 4.1: Carrier Without Payout Setup Receives Payment

**Preconditions:**
- Carrier has NOT completed payout setup
- Carrier completes a delivery

**Steps:**
1. Complete a delivery as carrier (no payout setup)
2. Check transaction details

**Expected Results:**
- [ ] Transaction shows payment received
- [ ] Payout status shows "Pending" or similar
- [ ] Carrier prompted to complete payout setup
- [ ] Money held until payout setup complete

---

### Test 4.2: Payout Setup Option Not Visible to Shippers

**Steps:**
1. Log in as **Shipper only** (no carrier role)
2. Go to Profile → Payments section

**Expected Results:**
- [ ] "Payout Setup" option is NOT visible
- [ ] Only shipper payment options shown

---

### Test 4.3: Role Switch and Payout Visibility

**Steps:**
1. Log in as user with BOTH roles
2. Switch to Shipper mode
3. Check if Payout Setup visible
4. Switch to Carrier mode
5. Check if Payout Setup visible

**Expected Results:**
- [ ] Shipper mode: Payout Setup NOT visible (or disabled)
- [ ] Carrier mode: Payout Setup IS visible

---

## Visual Reference

### PayoutSetupView States

```
┌─────────────────────────────────────┐
│         [Icon: 48pt]                │
│                                     │
│         [Title: Bold]               │
│     [Description: Secondary]        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ What you'll need:           │   │
│  │ 📄 Government-issued ID     │   │
│  │ 🏦 Bank account details     │   │
│  │ 🏠 Address verification     │   │
│  │ ─────────────────────────── │   │
│  │ 🔒 Secure verification...   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │    [Primary Action Button]   │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### PayoutStatusCard Layout

```
┌─────────────────────────────────────┐
│ Payout Status          [Badge]      │
│                                     │
│ Carrier Earnings        $45.00      │
│                                     │
│ ℹ️ [Timing information]             │
│                                     │
│ ⚠️ [Error message - if failed]      │
└─────────────────────────────────────┘
```

---

## Test Results Template

### Tester Information
- **Tester Name:** _______________
- **Date:** _______________
- **App Version:** _______________
- **Device/iOS:** _______________

### Results Summary

| Test ID | Test Name | Pass/Fail | Notes |
|---------|-----------|-----------|-------|
| **Payout Setup** | | | |
| 1.1 | Accessing Payout Setup | | |
| 1.2 | New Carrier State | | |
| 1.3 | Starting Onboarding | | |
| 1.4 | Incomplete Setup | | |
| 1.5 | Completed Setup | | |
| 1.6 | View Stripe Dashboard | | |
| 1.7 | Error Loading Status | | |
| **Payout Status** | | | |
| 2.1 | Awaiting Delivery | | |
| 2.2 | Pending | | |
| 2.3 | Processing | | |
| 2.4 | Completed (Paid) | | |
| 2.5 | Failed | | |
| 2.6 | Card UI Verification | | |
| **End-to-End** | | | |
| 3.1 | Full Delivery Flow | | |
| **Edge Cases** | | | |
| 4.1 | No Payout Setup | | |
| 4.2 | Shipper Visibility | | |
| 4.3 | Role Switch | | |

### Issues Found

| Issue # | Test ID | Description | Severity | Screenshot |
|---------|---------|-------------|----------|------------|
| | | | | |

---

## Automated Tests

```bash
# Run payout status UI tests
xcodebuild test -scheme Pasabayan \
  -destination 'platform=iOS Simulator,name=iPhone 17,OS=26.0' \
  -only-testing:PasabayanUITests/PayoutStatusFlowTests
```

---

*Document Version: 1.0*
*Last Updated: January 2026*
