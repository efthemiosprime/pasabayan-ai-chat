# Payment UI Flow - QA Testing Guide

## Overview

Payment flows handle:
- **Shipper**: Auto-charge on booking confirmation, manual payment when auto-charge fails
- **Carrier**: Payout/earnings after delivery completion

---

## Fee Model (Dual-Fee)

| Party | Calculation | Example (base $10) |
|-------|-------------|-------------------|
| **Sender (Shipper)** | Pays base + 10% service fee | $11.00 |
| **Carrier** | Receives base − 5% platform fee | $9.50 |
| **Platform** | 10% + 5% of base = 15% | $1.50 |

### Amount Breakdown Example

```
Agreed Delivery Price (Base):  $50.00 CAD
+ Service Fee (10%):           $ 5.00 CAD
+ Tip (optional):              $ 5.00 CAD
───────────────────────────────────────────
Shipper Pays (Total):          $60.00 CAD

Carrier Earnings:
  Base Amount:                 $50.00 CAD
  − Platform Fee (5%):         -$ 2.50 CAD
  + Tip (100%):                +$ 5.00 CAD
───────────────────────────────────────────
Carrier Receives:              $52.50 CAD

Platform Revenue:              $ 7.50 CAD (10% + 5% of base)
```

### API Response Fields

| Endpoint | Key Response Fields |
|----------|---------------------|
| `GET /api/payments/config` | `sender_fee_percentage`, `carrier_fee_percentage` |
| `POST /api/payments` | `amounts.total`, `amounts.carrier_receives`, `amounts.base_amount` |
| `GET /api/payments/{id}` | Same amounts structure |
| `GET /api/receipts` | `amount.total`, `amount.carrier_amount` |

---

## Payment Flow (Shipper)

### Screen Reference

| Component | File | Purpose |
|-----------|------|---------|
| Pay Button | `ShipperMatchDetailsView.swift` | Manual payment trigger |
| AutoChargeConfirmationSheet | `AutoChargeConfirmationSheet.swift` | Confirm auto-charge |
| AutoChargeConfirmationViewModel | `AutoChargeConfirmationViewModel.swift` | Auto-charge logic |
| AutoChargeFailureBanner | `AutoChargeFailureBanner.swift` | Failure notification |

**Paths**:
- `Pasabayan/Features/Bookings/Views/Shipper/ShipperMatchDetailsView.swift`
- `Pasabayan/Features/Bookings/Views/Shared/Components/AutoChargeConfirmationSheet.swift`
- `Pasabayan/Features/Bookings/ViewModels/AutoChargeConfirmationViewModel.swift`
- `Pasabayan/Features/Bookings/Components/AutoChargeFailureBanner.swift`

---

## 1. Auto-Charge Flow

**Trigger**: Shipper confirms a match and has a default payment method

```
Shipper → Matches Tab
    └── Tap match card (status: "Pending Confirmation")
        └── Match Details Screen
            └── Tap "Confirm Booking"
                └── AutoChargeConfirmationSheet appears
                    ├── Shows card ending in ****XXXX
                    ├── Shows amount to be charged
                    └── Tap "Confirm & Pay"
                        └── Processing...
                            └── Success: "Booking Confirmed!"
```

### Test: Auto-Charge Success (Happy Path)

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Profile | Add test card `4242 4242 4242 4242` | Card saved as default |
| 2 | Matches Tab | Find "Pending Confirmation" | Booking visible |
| 3 | Match Details | Tap "Confirm Booking" | Confirmation sheet opens |
| 4 | Sheet | Verify card shown | "****4242" displayed |
| 5 | Sheet | Tap "Confirm & Pay" | Processing indicator |
| 6 | Sheet | Wait | Success message |
| 7 | Match Details | Check status | "Confirmed & Paid" |

**Verification Checklist**:
- [ ] Correct card displayed (last 4 digits)
- [ ] Correct amount shown
- [ ] Loading state during processing
- [ ] Success confirmation shown
- [ ] Status updates to "Confirmed"
- [ ] Transaction appears in payment history

---

## 2. Manual Payment Flow (Auto-Charge Failed)

**Trigger**: `shouldShowPaymentButton` = true (auto-charge failed OR no default card)
**UI**: "Pay" button appears in `ShipperMatchDetailsView`

```
Shipper → Matches Tab
    └── Tap match card (status: "Payment Failed" or "Awaiting Payment")
        └── ShipperMatchDetailsView
            ├── AutoChargeFailureBanner displayed (if failed)
            └── "Pay" button visible
                └── Tap "Pay"
                    └── Stripe PaymentSheet opens
                        ├── Enter card details (or select saved card)
                        └── Tap "Pay $XX"
                            └── Processing...
                                └── Success: Payment completed
```

### Test: Auto-Charge Failure → Manual Payment

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Profile | Add test card `4000000000000002` (decline) | Card saved |
| 2 | Match Details | Tap "Confirm Booking" | Auto-charge attempted |
| 3 | Match Details | Wait | Failure banner appears |
| 4 | Match Details | Verify "Pay" button | Button visible |
| 5 | Match Details | Tap "Pay" | Stripe PaymentSheet opens |
| 6 | PaymentSheet | Use card `4242 4242 4242 4242` | Enter new card |
| 7 | PaymentSheet | Tap "Pay" | Success |
| 8 | Match Details | Check status | "Confirmed & Paid" |

**Verification Checklist**:
- [ ] "Pay" button appears when auto-charge failed
- [ ] "Pay" button appears when no default card exists
- [ ] AutoChargeFailureBanner displays correct message
- [ ] Stripe PaymentSheet opens correctly
- [ ] Amount in PaymentSheet matches booking price + 10% service fee
- [ ] Success updates booking status
- [ ] Failure banner removed after successful payment

---

## 3. Auto-Charge Failure Banner

**Component**: `AutoChargeFailureBanner`
**Trigger**: `transactionStatus == "failed"`
**Appears on**: `MatchDetailsView` and other match detail screens

| Scenario | Banner Message | Action Available |
|----------|----------------|------------------|
| Card declined | "Payment failed - card declined" | "Pay" button |
| Insufficient funds | "Payment failed - insufficient funds" | "Pay" button |
| Card expired | "Payment failed - card expired" | "Pay" button |
| No payment method | "No payment method on file" | "Add Card" / "Pay" button |

### Test: Failure Banner Scenarios

| Test | Setup Card | Expected Banner |
|------|------------|-----------------|
| Declined | `4000000000000002` | "declined" message |
| Insufficient funds | `4000000000009995` | "insufficient funds" |
| Expired | Use expired date | "expired" message |
| No card | Remove all saved cards | "no payment method" |

---

## 4. No Payment Method Flow

**Trigger**: Shipper has no saved cards

```
Shipper → Matches Tab
    └── Tap match card
        └── Match Details
            └── Tap "Confirm Booking"
                └── Prompt: "Add payment method"
                    └── Tap "Add Card"
                        └── Card entry flow
                            └── Return to confirm
```

### Test: No Payment Method → Add Card

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Profile | Remove all saved cards | No default card |
| 2 | Match Details | Tap "Confirm Booking" | Prompt to add card |
| 3 | Prompt | Tap "Add Payment Method" | Card entry flow |
| 4 | Card Entry | Enter test card | Card saved |
| 5 | Match Details | Tap "Confirm Booking" | Payment proceeds |

---

## Payout Flow (Carrier)

### Screen Reference

| Component | File | Purpose |
|-----------|------|---------|
| ReceiptListView | `ReceiptListView.swift` | Payment/receipt history |
| RefundSheetView | `RefundSheetView.swift` | Refund/payout details |

**Paths**:
- `Pasabayan/Features/Payments/Views/ReceiptListView.swift`
- `Pasabayan/Features/Payments/Views/RefundSheetView.swift`

**Data Source**: `PaymentService` → `/payments` endpoints

---

## 5. Carrier Earnings/Payout

```
Carrier → Profile Tab
    └── Tap "Earnings" or "Payment History"
        └── ReceiptListView
            ├── Shows list of completed deliveries
            ├── Shows payout amounts
            ├── Shows payout status (pending/paid)
            └── Tap receipt row
                └── Receipt Details
                    ├── Booking reference
                    ├── Amount earned
                    ├── Payout status
                    └── Payout date (if paid)
```

### Test: Carrier Payout After Delivery

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Carrier | Complete delivery flow | Status: "Delivered" |
| 2 | Profile | Go to "Earnings" | ReceiptListView opens |
| 3 | ReceiptListView | Find recent delivery | Receipt row visible |
| 4 | Receipt Row | Check amount | Correct earnings shown |
| 5 | Receipt Row | Check status | "Pending" initially |
| 6 | Receipt Row | (Wait for payout) | Status: "Paid" |

**Verification Checklist**:
- [ ] Earnings appear after delivery completion
- [ ] Correct amount shown (base price − 5% platform fee)
- [ ] `amounts.carrier_receives` matches displayed amount
- [ ] Payout status updates (Pending → Paid)
- [ ] Receipt details are accurate
- [ ] Stripe payout account linked (required for payouts)

---

## Stripe Test Cards Reference

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Success |
| `4000000000000002` | Card declined |
| `4000000000009995` | Insufficient funds |
| `4000000000000069` | Expired card |
| `4000000000000127` | Incorrect CVC |
| `4000002500003155` | Requires 3D Secure |

**All test cards use**:
- Expiry: Any future date (e.g., 12/34)
- CVC: Any 3 digits (e.g., 123)

---

## Quick Reference

| Flow | Trigger | Screen | Key File |
|------|---------|--------|----------|
| Auto-charge | Confirm + has card | AutoChargeConfirmationSheet | `AutoChargeConfirmationSheet.swift` |
| Manual pay | Failed / no card | ShipperMatchDetailsView | `ShipperMatchDetailsView.swift` |
| Failure banner | transactionStatus == "failed" | MatchDetailsView | `AutoChargeFailureBanner.swift` |
| Payout history | Carrier earnings | ReceiptListView | `ReceiptListView.swift` |
| Refund status | Cancelled booking | RefundSheetView | `RefundSheetView.swift` |

---

## Prerequisites for Testing

### Shipper Account:
- [ ] At least one package created
- [ ] Test payment method saved (or test adding one)

### Carrier Account:
- [ ] At least one trip created
- [ ] Stripe Connect account linked (for payouts)

### Test Environment:
- [ ] Stripe test mode enabled
- [ ] Use test card numbers above
