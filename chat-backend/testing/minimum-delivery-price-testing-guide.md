# Minimum Delivery Price - Testing Guide

This guide covers how to test the minimum delivery price feature implementation.

## Overview

The minimum delivery price ($5.00 CAD default) ensures all delivery bookings meet a minimum price threshold. This is enforced:
- **Client-side**: Immediate validation feedback in UI
- **Server-side**: API returns 422 error if price is below minimum

## Files Changed

| File | Description |
|------|-------------|
| `StripeConfigModels.swift` | Added `minDeliveryPrice` and `taxEnabled` fields |
| `StripeConfigService.swift` | Added `validateMinimumPrice()` method |
| `MatchCreationView.swift` | Added client-side price validation |
| `Localizable.xcstrings` | Added localization strings |

## Test Files

| File | Type |
|------|------|
| `PasabayanTests/StripeConfigTests.swift` | Unit tests |
| `PasabayanUITests/Flows/Payments/MinimumPriceValidationTests.swift` | UI tests |

---

## 1. Running Unit Tests

### Run All Stripe Config Tests

```bash
xcodebuild test \
  -scheme Pasabayan \
  -destination 'platform=iOS Simulator,name=iPhone 16' \
  -only-testing:PasabayanTests/StripeConfigTests
```

### Expected Results

| Test | Expected |
|------|----------|
| `testStripeConfigDecoding_WithMinDeliveryPrice` | ✅ Pass - decodes `min_delivery_price` correctly |
| `testStripeConfigDecoding_WithoutMinDeliveryPrice` | ✅ Pass - backward compatible when field missing |
| `testValidateMinimumPrice_ValidPrice` | ✅ Pass - prices >= $5.00 return nil (no error) |
| `testValidateMinimumPrice_InvalidPrice` | ✅ Pass - prices < $5.00 return error message |
| `testMatchCreation_EmptyPrice_ShowsError` | ✅ Pass - empty price fails validation |
| `testMatchCreation_PriceAtMinimum_NoError` | ✅ Pass - $5.00 passes validation |
| `testMatchCreation_PriceBelowMinimum_ShowsError` | ✅ Pass - $4.99 fails validation |
| `testMatchCreation_PriceAboveMinimum_NoError` | ✅ Pass - $15.00 passes validation |

---

## 2. Manual Testing Steps

### Test Case 1: Empty Price Field

**Screen:** MatchCreationView (Request a Delivery)

**Steps:**
1. Login as Shipper
2. Navigate to Browse Trips
3. Select a trip and tap "Request Delivery"
4. Select a package
5. Leave the "Your Offer" field empty

**Expected:**
- ❌ Red error message: "Price must be at least CA$5.00"
- ❌ "Send Request" button is disabled
- ✅ Hint text shows: "Minimum price is $5.00"

### Test Case 2: Price Below Minimum

**Steps:**
1. Follow steps 1-4 from Test Case 1
2. Enter "$2.00" in the "Your Offer" field

**Expected:**
- ❌ Red error message: "Price must be at least CA$5.00"
- ❌ "Send Request" button is disabled

### Test Case 3: Price at Minimum

**Steps:**
1. Follow steps 1-4 from Test Case 1
2. Enter "$5.00" in the "Your Offer" field

**Expected:**
- ✅ No error message
- ✅ Hint text shows: "Minimum price is $5.00"
- ✅ "Send Request" button is enabled

### Test Case 4: Price Above Minimum

**Steps:**
1. Follow steps 1-4 from Test Case 1
2. Enter "$15.00" in the "Your Offer" field

**Expected:**
- ✅ No error message
- ✅ "Send Request" button is enabled

### Test Case 5: RequestToCarrySheet (No Minimum)

**Screen:** RequestToCarrySheet (Carrier requesting to carry a package)

**Steps:**
1. Login as Carrier
2. Navigate to Browse Packages
3. Select a package and tap "Request to Carry"
4. Select a trip
5. Leave the "Proposed Price" field empty OR enter "$0.00"

**Expected:**
- ✅ No error message (negotiation is allowed)
- ✅ Submit button is enabled
- Note: This is intentional - carriers can propose $0 to negotiate

---

## 3. API Response Testing

### Test Server Validation

If client-side validation is bypassed, the server should still reject prices below minimum.

**Endpoint:** `POST /api/trips/{trip_id}/book`

**Request with invalid price:**
```json
{
  "package_request_id": 123,
  "price_agreed": 2.00
}
```

**Expected Response:**
```json
{
  "success": false,
  "error": {
    "code": "PRICE_BELOW_MINIMUM",
    "message": "Price must be at least $5.00",
    "details": {
      "min_price": 5.00,
      "provided_price": 2.00
    }
  }
}
```
**Status Code:** 422 Unprocessable Entity

---

## 4. SwiftUI Preview Testing

### View the Price Validation Preview

1. Open `MatchCreationView.swift` in Xcode
2. Open the Canvas (Editor → Canvas)
3. Select preview: **"Match Creation – Price Below Minimum"**

This preview demonstrates:
- The minimum price from `StripeConfigService`
- A sample invalid price ($2.00)
- The red error message display

---

## 5. Edge Cases to Test

| Scenario | Input | Expected |
|----------|-------|----------|
| Empty field | "" | Error: "Price must be at least CA$5.00" |
| Zero | "0" | Error: "Price must be at least CA$5.00" |
| Negative | "-5" | Error: "Price must be at least CA$5.00" |
| Just below minimum | "4.99" | Error: "Price must be at least CA$5.00" |
| At minimum | "5.00" | ✅ Valid |
| Above minimum | "5.01" | ✅ Valid |
| Large amount | "999.99" | ✅ Valid |
| Invalid text | "abc" | No error (invalid number not validated as price) |
| Decimal precision | "5.001" | ✅ Valid (rounds to 5.00) |

---

## 6. Localization Testing

### Verify Localized Strings

**English:**
- Error: "Price must be at least $5.00"
- Hint: "Minimum price is $5.00"

**French:**
- Error: "Le prix doit être d'au moins 5,00 $"
- Hint: "Le prix minimum est 5,00 $"

**Test Steps:**
1. Change device language to French (Settings → General → Language)
2. Open MatchCreationView
3. Verify error messages appear in French

---

## 7. Configuration Testing

### Verify Config Fetch

The minimum price is fetched from the API at `/api/payments/config`.

**Check Debug Logs:**
```
🎯 StripeConfigService: Config loaded
   Mode: sandbox
   Currency: cad
   Min Delivery Price: 5.0
   Tax Enabled: false
```

**Test Different Minimums:**

If the backend changes the minimum price (e.g., to $10.00), the app should reflect this after restarting or re-fetching config.

---

## 8. Regression Testing

### Ensure No Breaking Changes

| Feature | Test |
|---------|------|
| Trip Creation | `pricePerKg` field still works (> 0 required) |
| Trip Editing | Price per kg can still be edited |
| RequestToCarrySheet | Proposed price can still be $0 (negotiation) |
| Payment Flow | Payments still process correctly |
| Config Loading | App loads without crashing if config fails |

---

## 9. Test Checklist

```
[ ] Unit tests pass
[ ] Empty price shows error
[ ] Price below minimum shows error
[ ] Price at minimum is valid
[ ] Price above minimum is valid
[ ] Send Request button disabled when invalid
[ ] Send Request button enabled when valid
[ ] Hint text shows minimum price
[ ] Error text is red
[ ] RequestToCarrySheet allows $0 (no minimum)
[ ] French localization works
[ ] Preview displays correctly
[ ] Server returns 422 for invalid price (API test)
```

---

## Troubleshooting

### Error: "common.cancel" showing instead of "Cancel"

The localization key was missing. Fixed by adding `common.cancel` and `common.ok` to `Localizable.xcstrings`.

### Config Not Loading

Check that the user is authenticated. The `/api/payments/config` endpoint requires authentication.

### Tests Failing on CI

Ensure the simulator is available:
```bash
xcrun simctl list devices available
```
