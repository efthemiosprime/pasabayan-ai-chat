# QA Test Plan: Minimum Delivery Price

**Feature:** Minimum Delivery Price Validation  
**Version:** 1.0  
**Date:** February 2026  
**Minimum Price:** $5.00 CAD

---

## Summary

When a Shipper (Sender) books a Carrier's trip, they must enter a delivery price of at least **$5.00 CAD**. This test plan covers all scenarios to verify the validation works correctly.

---

## Prerequisites

- [ ] iOS device or simulator with app installed
- [ ] Test account with Shipper role
- [ ] Test account with Carrier role
- [ ] At least one active trip available to book
- [ ] At least one package created

---

## Test Scenarios

### Scenario 1: Empty Price Field

**Role:** Shipper  
**Screen:** Request a Delivery (booking a trip)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login as Shipper | Dashboard appears |
| 2 | Tap "Browse Trips" or find a trip | Trip list appears |
| 3 | Select a trip | Trip details appear |
| 4 | Tap "Request Delivery" | Booking form opens |
| 5 | Select a package from the list | Package selected |
| 6 | Leave "Your Offer" field **empty** | - |
| 7 | Observe the price field | **Red error: "Price must be at least CA$5.00"** |
| 8 | Check "Send Request" button | **Button is DISABLED (greyed out)** |

**Result:** ☐ Pass ☐ Fail

---

### Scenario 2: Price Below Minimum ($2.00)

**Role:** Shipper  
**Screen:** Request a Delivery

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Follow steps 1-5 from Scenario 1 | Booking form with package selected |
| 2 | Enter **"2"** in "Your Offer" field | - |
| 3 | Observe the price field | **Red error: "Price must be at least CA$5.00"** |
| 4 | Check "Send Request" button | **Button is DISABLED** |

**Result:** ☐ Pass ☐ Fail

---

### Scenario 3: Price Just Below Minimum ($4.99)

**Role:** Shipper  
**Screen:** Request a Delivery

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Follow steps 1-5 from Scenario 1 | Booking form with package selected |
| 2 | Enter **"4.99"** in "Your Offer" field | - |
| 3 | Observe the price field | **Red error: "Price must be at least CA$5.00"** |
| 4 | Check "Send Request" button | **Button is DISABLED** |

**Result:** ☐ Pass ☐ Fail

---

### Scenario 4: Price at Minimum ($5.00) ✓

**Role:** Shipper  
**Screen:** Request a Delivery

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Follow steps 1-5 from Scenario 1 | Booking form with package selected |
| 2 | Enter **"5"** in "Your Offer" field | - |
| 3 | Observe the price field | **No error message** |
| 4 | Check hint text below field | **"Minimum price is $5.00"** (grey text) |
| 5 | Check "Send Request" button | **Button is ENABLED (tappable)** |

**Result:** ☐ Pass ☐ Fail

---

### Scenario 5: Price Above Minimum ($15.00) ✓

**Role:** Shipper  
**Screen:** Request a Delivery

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Follow steps 1-5 from Scenario 1 | Booking form with package selected |
| 2 | Enter **"15"** in "Your Offer" field | - |
| 3 | Observe the price field | **No error message** |
| 4 | Check "Send Request" button | **Button is ENABLED** |
| 5 | Tap "Send Request" | Request is submitted successfully |

**Result:** ☐ Pass ☐ Fail

---

### Scenario 6: Zero Price ($0)

**Role:** Shipper  
**Screen:** Request a Delivery

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Follow steps 1-5 from Scenario 1 | Booking form with package selected |
| 2 | Enter **"0"** in "Your Offer" field | - |
| 3 | Observe the price field | **Red error: "Price must be at least CA$5.00"** |
| 4 | Check "Send Request" button | **Button is DISABLED** |

**Result:** ☐ Pass ☐ Fail

---

### Scenario 7: Carrier Request to Carry (No Minimum) ✓

**Role:** Carrier  
**Screen:** Request to Carry (offering to carry a package)

> **Note:** Carriers CAN propose $0 because this is a negotiation offer, not a final price.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login as Carrier | Dashboard appears |
| 2 | Tap "Browse Packages" or "Available Packages" | Package list appears |
| 3 | Select a package | Package details appear |
| 4 | Tap "Request to Carry" | Request form opens |
| 5 | Select a trip | Trip selected |
| 6 | Leave "Proposed Price" field **empty** or enter **"0"** | - |
| 7 | Observe the form | **No error message** |
| 8 | Check Submit button | **Button is ENABLED** |

**Result:** ☐ Pass ☐ Fail

---

### Scenario 8: Trip Creation Price (Per KG Rate)

**Role:** Carrier  
**Screen:** Create Trip

> **Note:** Trip creation uses price per KG (rate), not total price. Minimum does NOT apply here.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login as Carrier | Dashboard appears |
| 2 | Tap "Create Trip" or "+" button | Trip creation form opens |
| 3 | Fill in route, dates, weight | Fields populated |
| 4 | Enter **"1"** in "Price per KG" field | - |
| 5 | Observe the form | **No minimum price error** |
| 6 | Complete form and submit | Trip created successfully |

**Result:** ☐ Pass ☐ Fail

---

## Edge Cases

| Test | Input | Expected |
|------|-------|----------|
| Negative number | "-5" | Error shown |
| Letters | "abc" | Field should only accept numbers |
| Very large number | "9999" | No error (valid) |
| Decimal | "5.50" | No error (valid) |
| Leading zeros | "005" | Treated as $5.00, valid |

---

## Localization Test (French)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Change device language to French | Settings → General → Language |
| 2 | Open app and go to Request a Delivery | - |
| 3 | Leave price empty | **"Le prix doit être d'au moins 5,00 $"** |

**Result:** ☐ Pass ☐ Fail

---

## Summary Checklist

### Must Pass ✓
- [ ] Empty price shows error
- [ ] $2.00 shows error
- [ ] $4.99 shows error
- [ ] $5.00 is accepted (no error)
- [ ] $15.00 is accepted
- [ ] Button disabled when price invalid
- [ ] Button enabled when price valid
- [ ] Hint text shows "Minimum price is $5.00"

### Should Not Break
- [ ] Carrier can still propose $0 (Request to Carry)
- [ ] Carrier can create trips with any price per KG > 0
- [ ] French language displays correctly

---

## Bug Report Template

If a test fails, please report with:

```
**Title:** [Short description]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected:** 
[What should happen]

**Actual:** 
[What actually happened]

**Screenshot:** 
[Attach if possible]

**Device:** 
[iPhone model, iOS version]
```

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Tester | | | |
| Developer | | | |
| Product Owner | | | |
