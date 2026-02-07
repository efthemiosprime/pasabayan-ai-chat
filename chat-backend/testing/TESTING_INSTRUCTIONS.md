# 📱 Pasabayan iOS App - Comprehensive Testing Instructions

## 🎯 **Testing Overview**
This document provides comprehensive instructions for testing the Pasabayan iOS app. The app connects people who need packages delivered (**shippers**) with people who have vehicles and available capacity (**carriers**) in a peer-to-peer delivery platform.

---

## 📋 Table of Contents
1. [Current Implementation Status](#current-implementation-status)
2. [Pre-Testing Setup](#pre-testing-setup)
3. [Authentication & Onboarding](#authentication--onboarding)
4. [Profile Management](#profile-management)
5. [Phone Verification](#phone-verification)
6. [Premium Verification](#premium-verification)
7. [Carrier Journey](#carrier-journey)
8. [Shipper Journey](#shipper-journey)
9. [Matching & Booking](#matching--booking)
10. [Delivery Management](#delivery-management)
11. [Payment System](#payment-system)
12. [Chat & Communication](#chat--communication)
13. [Ratings & Reviews](#ratings--reviews)
14. [Analytics Dashboard](#analytics-dashboard)
15. [History & Records](#history--records)
16. [Error Handling](#error-handling)
17. [Bug Reporting](#bug-reporting)

---

## 🔧 **Current Implementation Status**

### ✅ **Fully Implemented Features**
- **Authentication:** Google/Facebook/Apple OAuth login with backend token exchange
- **Onboarding:** 5-slide onboarding experience with role selection
- **Profile Management:** Edit profile, upload avatar, manage settings
- **Phone Verification:** OTP send and verify flow
- **Premium Verification:** Document upload for verification
- **Role Management:** Seamless switching between carrier/shipper roles
- **Carrier Features:** 
  - Complete profile setup with vehicle details
  - Trip creation, editing, status updates, cancellation
  - Booking management (accept/decline)
  - Pickup/delivery code generation and verification
  - Mark pickup/delivered with confirmation
  - Earnings tracking and analytics
- **Shipper Features:**
  - Package creation with **pickup_country** and **delivery_country** fields
  - Package editing and cancellation
  - Browse compatible trips
  - Request/book trips
  - Accept/decline carrier offers
  - Track deliveries
  - Generate/confirm pickup codes
  - Delivery confirmation
- **Matching System:** Smart trip-package matching algorithm
- **Booking Flow:** Complete end-to-end booking lifecycle
- **Status Tracking:** Real-time status updates across all features
- **Payment System:** Payment methods, transaction history, Stripe integration
- **Chat System:** Real-time messaging between users
- **Ratings & Reviews:** Mutual rating system with detailed feedback
- **Analytics Dashboard:** Comprehensive metrics for carriers and shippers
- **History Views:** Package and delivery history with search/filter
- **Error Handling:** Comprehensive error alerts with meaningful server messages

### 🎨 **UI Components**
- **Design System:** Complete color palette, typography, spacing (4pt grid), shadows
- **Advanced Button System:** 6 styles, 4 sizes, loading states, haptic feedback
- **Card System:** Generic cards, stat cards, trip cards, package cards, match cards
- **Forms:** Validation, error handling, real-time feedback
- **Status Badges:** Color-coded badges for all entity statuses

### ❌ **Not Yet Implemented**
- **Push Notifications:** Backend integration pending
- **Background Location Tracking:** iOS permissions and implementation
- **Payment Payout System:** Stripe Connect for carrier payouts
- **In-App File Viewer:** PDF/image viewer for receipts and documents

---

## 🚀 **Pre-Testing Setup**

### **Requirements:**
- iOS device or simulator (iOS 15.0+)
- Stable internet connection
- Google/Facebook/Apple account for OAuth login
- Backend server running (check with development team for URL)
- Test payment cards (for payment testing)

### **Test Accounts:**
Create 2+ accounts for comprehensive testing:
1. **Primary Tester:** Your main account for role switching
2. **Secondary Tester:** Friend/colleague account for interactions
3. **Optional:** Third account for complex scenarios

### **Test Data Preparation:**
- Have sample addresses ready (pickup and delivery locations)
- Prepare test package descriptions
- Know your test routes (e.g., Montreal → Toronto)
- Have test payment card details ready

---

## 🔐 **Authentication & Onboarding**

### **Test 1.1: First-Time Onboarding**
```
STEPS:
1. Fresh app install OR tap "Reset Onboarding" on login screen (debug button)
2. Launch app
3. Swipe through 5 onboarding slides:
   - Slide 1: Welcome
   - Slide 2: Carrier features
   - Slide 3: Shipper features
   - Slide 4: Permissions
   - Slide 5: Role selection (optional)
4. Test "Skip" button on slides 1-4
5. Optionally select Carrier or Shipper role
6. Tap "Get Started"

✅ VERIFY:
- All slides display correctly with consistent spacing
- Dot indicators show current position
- Skip button works (jumps to last slide)
- Role selection is optional
- Get Started navigates to login screen
- Onboarding doesn't appear again after completion

❌ ERROR CASES:
- Onboarding appears every launch
- Slides misaligned
- Get Started button doesn't work
```

### **Test 1.2: Google Sign-In**
```
STEPS:
1. On login screen, tap "Sign in with Google"
2. Select Google account
3. Grant permissions
4. Wait for authentication

✅ VERIFY:
- Google sign-in sheet appears
- Loading indicator shows during auth
- Successfully navigates to dashboard
- User profile populated (name, email, avatar)
- Token stored securely

❌ ERROR CASES:
- Error alert shows: "Failed to authenticate: [server message]"
- Network error displays with description
- Can retry after error
```

### **Test 1.3: Facebook Sign-In**
```
STEPS:
1. Tap "Sign in with Facebook"
2. Enter Facebook credentials
3. Grant permissions
4. Wait for authentication

✅ VERIFY:
- Facebook login flow works
- Profile data populated
- Successfully authenticated

❌ ERROR CASES:
- Clear error messages displayed
- Can retry authentication
```

### **Test 1.4: Apple Sign-In**
```
STEPS:
1. Tap "Sign in with Apple"
2. Authenticate with Face ID/Touch ID
3. Choose email sharing option
4. Complete authentication

✅ VERIFY:
- Apple authentication sheet appears
- Successfully creates account
- Profile created with Apple ID info

❌ ERROR CASES:
- Error alert with clear message
```

### **Test 1.5: Logout**
```
STEPS:
1. Navigate to Profile tab
2. Scroll down
3. Tap "Logout"
4. Confirm logout

✅ VERIFY:
- Returns to login screen
- OAuth provider signed out
- User data cleared
- Keychain token removed
```

---

## 👤 **Profile Management**

### **Test 2.1: View Profile**
```
STEPS:
1. Navigate to Profile tab
2. Observe profile information

✅ VERIFY:
- Profile picture displays (or placeholder)
- User name shown
- Email displayed
- Phone number visible (if verified)
- Verification badges present (phone, premium)
- Role status shown (Active Carrier/Shipper)
```

### **Test 2.2: Edit Profile**
```
STEPS:
1. Navigate to Profile tab
2. Tap "Edit Profile"
3. Modify:
   - Full name
   - Delivery address
   - Additional info
4. Tap "Save"

✅ VERIFY:
- Edit sheet appears
- Current values pre-populated
- Can modify all fields
- Success message appears
- Profile updates immediately
- Sheet dismisses

❌ ERROR CASES:
- Error alert: "Failed to update profile: [server message]"
- Can retry after error
- Sheet remains open on error
```

### **Test 2.3: Upload Profile Picture**
```
STEPS:
1. Navigate to Profile tab
2. Tap profile picture
3. Select "Choose from Library"
4. Pick an image
5. Confirm upload

✅ VERIFY:
- Photo picker appears
- Can select image
- Upload progress shows
- Profile picture updates
- Avatar syncs with backend

❌ ERROR CASES:
- "Upload failed" alert with error message
- Can retry upload
```

---

## 📱 **Phone Verification**

### **Test 3.1: Send OTP**
```
STEPS:
1. Navigate to Profile tab
2. Tap "Verify Phone Number"
3. Enter phone number with country code
4. Tap "Send Code"

✅ VERIFY:
- Phone input screen appears
- Country code selector works
- Loading indicator during send
- Success message appears
- Navigates to OTP input screen

❌ ERROR CASES:
- Error alert: "Failed to send OTP: [server message]"
- Invalid phone format shows validation error
- Can retry sending code
```

### **Test 3.2: Verify OTP**
```
STEPS:
1. Check SMS for 6-digit code
2. Enter code in input fields
3. Code auto-verifies when complete

✅ VERIFY:
- 6 separate input fields appear
- Auto-focuses next field
- Can paste entire code
- Auto-verifies when complete
- Success message appears
- Returns to profile
- Phone verified badge shows

❌ ERROR CASES:
- "Invalid code" error alert with server message
- Can resend code
- Can edit phone number
```

### **Test 3.3: Resend OTP**
```
STEPS:
1. In OTP screen, wait for timer
2. Tap "Resend Code" when enabled
3. Wait for new code

✅ VERIFY:
- Resend button disabled initially
- Countdown timer shows (30s)
- Button enables after countdown
- New code sent successfully
- Success toast appears

❌ ERROR CASES:
- Error alert if resend fails
```

---

## 🎖️ **Premium Verification**

### **Test 4.1: Upload Verification Documents**
```
STEPS:
1. Navigate to Profile tab
2. Tap "Get Premium Verification"
3. Review requirements
4. Upload:
   - Government ID (front)
   - Government ID (back)
   - Proof of address
   - Selfie with ID
5. Tap "Submit for Verification"

✅ VERIFY:
- Document upload screen appears
- Can select photos from library
- Image preview shows
- Can remove/replace images
- Submit button enabled when all docs uploaded
- Upload progress indicator shows
- Success message appears
- Status changes to "Pending Review"

❌ ERROR CASES:
- Error alert: "Upload failed: [server message]"
- Can retry individual uploads
- Unsupported file format error shown
```

---

## 🚛 **Carrier Journey**

### **Phase 1: Carrier Setup**

#### **Test 5.1: Enable Carrier Role**
```
STEPS:
1. Navigate to Profile tab
2. Tap "Become a Carrier"
3. Complete carrier profile:
   - Vehicle type (Car/Truck/Van/Motorcycle)
   - Vehicle capacity (weight kg, space liters)
   - Price per kg
   - Available routes
4. Tap "Activate Carrier Profile"

✅ VERIFY:
- Carrier setup sheet appears
- All fields required
- Capacity inputs numeric only
- Price validation works
- Successfully activates
- Carrier dashboard available
- Role switcher shows "Carrier"

❌ ERROR CASES:
- Validation errors shown clearly
- Server error alert with message
```

### **Phase 2: Trip Management**

#### **Test 5.2: Create New Trip**
```
STEPS:
1. Switch to Carrier role
2. Navigate to Trips tab
3. Tap "+" or "Create Trip"
4. Fill in trip details:
   - Origin city & country (use picker)
   - Destination city & country (use picker)
   - Departure date & time
   - Available capacity (weight kg, space liters)
   - Price per kg
   - Transportation method
   - Special notes (optional)
5. Tap "Create Trip"

✅ VERIFY:
- Trip creation form appears
- Country pickers show all 37+ countries with flags
- All required fields validated
- Date must be in future
- Delivery date after pickup
- Capacity and price must be positive
- Success message appears
- Trip appears in "My Trips" list
- Trip status is "Planning"

❌ ERROR CASES:
- Validation errors shown for invalid data
- Error alert: "Failed to create trip: [server message]"
- Can retry creation
```

#### **Test 5.3: Edit Trip (Planning Status)**
```
STEPS:
1. Navigate to Trips tab
2. Find trip in "Planning" status
3. Tap trip card
4. Tap 3-dot menu → "Edit Trip"
5. Modify any fields
6. Tap "Save Changes"

✅ VERIFY:
- Edit sheet appears with pre-filled data
- Can modify all fields including countries
- Validation works
- Success message appears
- Trip updates immediately

❌ ERROR CASES:
- Error alert with server message
- Cannot edit "Active" or "Completed" trips
```

#### **Test 5.4: Update Trip Status**
```
STEPS:
1. Navigate to Trips tab
2. Find trip
3. Tap 3-dot menu → "Update Status"
4. Select new status:
   - Planning → Scheduled
   - Scheduled → Active
   - Active → Completed
5. Confirm status change

✅ VERIFY:
- Status update sheet appears
- Only valid next statuses shown
- Success message appears
- Trip status updates immediately
- Badge color changes

❌ ERROR CASES:
- Error alert: "Failed to update status: [message]"
```

#### **Test 5.5: Cancel Trip**
```
STEPS:
1. Navigate to Trips tab
2. Find trip to cancel
3. Tap 3-dot menu → "Cancel Trip"
4. Confirm cancellation

✅ VERIFY:
- Confirmation alert appears
- Warning about irreversible action
- Status changes to "Cancelled"
- Trip moves to cancelled section
- Associated bookings notified

❌ ERROR CASES:
- Error alert with server message
- Cannot cancel completed trips
```

### **Phase 3: Booking Management**

#### **Test 5.6: View Active Bookings**
```
STEPS:
1. Navigate to Home tab (Carrier mode)
2. View "Active Bookings" section
3. Tap on a booking card

✅ VERIFY:
- Bookings list shows pending requests
- Each card shows:
  - Shipper name & rating
  - Package details
  - Pickup/delivery locations
  - Agreed price (CAD $)
  - Status badge
- Can tap "View Details"
- Action buttons available
```

#### **Test 5.7: Accept Booking Request**
```
STEPS:
1. Navigate to Matches tab → "Active Bookings"
2. Find booking with "Pending" status
3. Tap 3-dot menu → "Accept Booking"
4. Confirm acceptance

✅ VERIFY:
- Confirmation alert appears
- Loading indicator during API call
- Success message appears
- Booking status changes to "Confirmed"
- Shipper receives notification
- Trip capacity updates

❌ ERROR CASES:
- Error alert: "Failed to accept booking: [server message]"
- "Insufficient capacity" error if applicable
```

#### **Test 5.8: Decline Booking Request**
```
STEPS:
1. Navigate to Matches tab → "Active Bookings"
2. Find booking with "Pending" status
3. Tap 3-dot menu → "Decline Booking"
4. Confirm decline

✅ VERIFY:
- Confirmation alert appears
- Success message appears
- Booking removed from active list
- Shipper notified

❌ ERROR CASES:
- Error alert with server message
```

#### **Test 5.9: Mark Package as Picked Up**
```
STEPS:
1. Navigate to Active Bookings
2. Find confirmed booking
3. Tap 3-dot menu → "Mark Picked Up"
4. Confirm action

✅ VERIFY:
- Confirmation alert appears
- Status changes to "Picked Up"
- Shipper receives notification
- Delivery code becomes active

❌ ERROR CASES:
- Error alert with meaningful message
```

#### **Test 5.10: Mark Package as Delivered**
```
STEPS:
1. Navigate to Active Bookings
2. Find in-transit booking
3. Tap 3-dot menu → "Mark Delivered"
4. Confirm delivery

✅ VERIFY:
- Confirmation alert appears
- Status changes to "Delivered"
- Shipper notified
- Earnings updated
- Rating prompt appears

❌ ERROR CASES:
- Error alert with server error details
```

### **Phase 4: Code Management**

#### **Test 5.11: Generate Pickup Code**
```
STEPS:
1. Navigate to Active Bookings
2. Find confirmed booking
3. Tap 3-dot menu → "Generate Pickup Code"
4. Code auto-generates

✅ VERIFY:
- Code generation sheet appears
- 6-digit code displays
- Expiration time shown (15 minutes)
- Countdown timer visible
- Can share code with shipper
- Copy to clipboard option

❌ ERROR CASES:
- Error alert: "Failed to generate code: [server message]"
- Expired code shows clear message
```

#### **Test 5.12: Confirm Pickup with Code**
```
STEPS:
1. Receive 6-digit code from shipper
2. Navigate to booking
3. Tap "Confirm Pickup Code"
4. Enter 6-digit code
5. Tap "Verify"

✅ VERIFY:
- Code input screen appears
- 6 separate input fields
- Code validates successfully
- Status changes to "Picked Up"
- Success message appears

❌ ERROR CASES:
- "Invalid code" error with inline message
- "Expired code" error shown
- Can request new code
```

#### **Test 5.13: Generate Delivery Code**
```
STEPS:
1. Navigate to Active Bookings
2. Find picked-up booking
3. Tap 3-dot menu → "Generate Delivery Code"
4. Code auto-generates

✅ VERIFY:
- 6-digit delivery code displays
- Expiration timer shows (15 minutes)
- Can share with recipient
- Clipboard copy option

❌ ERROR CASES:
- Error alert with server message
```

#### **Test 5.14: Rate Shipper After Delivery**
```
STEPS:
1. Navigate to completed booking
2. Tap 3-dot menu → "Rate Shipper"
3. Select star rating (1-5)
4. Write review text (optional)
5. Select review categories
6. Tap "Submit Rating"

✅ VERIFY:
- Rating sheet appears
- Shows shipper details
- Star rating selectable
- Review categories available
- Success message appears
- Rating recorded
- Cannot rate twice

❌ ERROR CASES:
- Error alert: "Failed to submit rating: [server message]"
```

### **Phase 5: Analytics**

#### **Test 5.15: View Carrier Analytics**
```
STEPS:
1. Navigate to Analytics tab (Carrier mode)
2. Review dashboard sections:
   - Total Earnings (CAD)
   - Completed Trips
   - Active Trips
   - Success Rate (%)
   - Average Rating
3. Select time period (Week/Month/Year)
4. View earnings chart

✅ VERIFY:
- All metrics display correctly
- Earnings formatted as CAD $X.XX
- Charts render properly
- Time period filter works
- Data updates when changed
- Percentages calculated correctly
```

---

## 📦 **Shipper Journey**

### **Phase 1: Package Management**

#### **Test 6.1: Create Package Request (WITH COUNTRY FIELDS)**
```
STEPS:
1. Navigate to Packages tab
2. Tap "+" or "New Package Request"
3. Fill in ALL fields:
   
   PACKAGE DETAILS:
   - Package description: "Important business documents"
   - Weight (kg): "2.5" (REQUIRED)
   - Package value (CAD): "100.00"
   - Max budget (CAD): "50.00"
   - Package type: "Documents"
   - Urgency level: "Normal"
   - Is fragile?: Toggle ON/OFF
   - Special instructions: "Handle with care"
   
   PICKUP INFORMATION:
   - Pickup address: "123 Main St, Montreal, QC"
   - Pickup city: "Montreal"
   - **Pickup country: Select "🇨🇦 Canada"** (REQUIRED - NEW!)
   - Preferred pickup date: Tomorrow
   - Preferred pickup time: 10:00 AM
   - Pickup flexible?: Toggle ON
   
   DELIVERY INFORMATION:
   - Delivery address: "456 Bay St, Toronto, ON"
   - Delivery city: "Toronto"
   - **Delivery country: Select "🇨🇦 Canada"** (REQUIRED - NEW!)
   - Delivery date needed: Day after tomorrow
   - Delivery time needed: 3:00 PM
   
   PHOTOS:
   - Upload up to 5 package photos (optional)

4. Tap "Create Package Request"

✅ VERIFY:
- Form appears with all fields
- **Country pickers show 37+ countries with flag emojis**
- **Both pickup and delivery countries are in the form**
- Weight/value/budget accept numbers only
- Dates validated (future dates)
- Delivery date must be after pickup
- Photo picker allows up to 5 images
- Image thumbnails show in carousel
- Validation errors shown clearly:
  * "Package description is required"
  * "Pickup address is required"
  * "Pickup city is required"
  * **"Pickup country is required"** (NEW!)
  * "Delivery address is required"
  * "Delivery city is required"
  * **"Delivery country is required"** (NEW!)
  * "Package weight is required"
- Success message: "Package request created!"
- Package appears in "My Packages" list
- Status is "Open"

❌ ERROR CASES:
- **"Pickup country is required" if not selected**
- **"Delivery country is required" if not selected**
- Error alert: "Failed to create package: [server message]"
- Can retry after error
```

#### **Test 6.2: Edit Package Request**
```
STEPS:
1. Navigate to Packages tab
2. Find "Open" package
3. Tap package card → Details
4. Tap 3-dot menu → "Edit Package"
5. Modify any fields including countries
6. Tap "Save Changes"

✅ VERIFY:
- Edit sheet appears with pre-filled data
- **Country fields are editable with all countries**
- All fields can be modified
- Validation works
- Success message appears
- Updates reflect immediately

❌ ERROR CASES:
- Error alert with server message
- Cannot edit matched/delivered packages
```

#### **Test 6.3: Cancel Package Request**
```
STEPS:
1. Navigate to Packages tab
2. Find package to cancel
3. Tap 3-dot menu → "Cancel Request"
4. Confirm cancellation

✅ VERIFY:
- Confirmation alert appears
- Warning about irreversible action
- Status changes to "Cancelled"
- Package moves to cancelled section

❌ ERROR CASES:
- Error alert: "Failed to cancel: [server message]"
- Cannot cancel delivered packages
```

### **Phase 2: Trip Discovery**

#### **Test 6.4: Browse Compatible Trips**
```
STEPS:
1. Navigate to Packages tab
2. Tap on open package
3. Tap "Find Trips" or "Browse Compatible Trips"
4. View list of matching carriers

✅ VERIFY:
- Trip list appears
- Each trip shows:
  - Carrier name & rating
  - Vehicle type
  - Available capacity
  - Price per kg (CAD)
  - Route (origin → destination)
  - Departure date
  - "Book Trip" button
- Trips filtered by route compatibility
- Can tap "View Details"
```

#### **Test 6.5: Shipper Home Browse & Filters**
```
STEPS:
1. Launch the app as a shipper and land on Home tab (page 1 of 2)
2. Confirm trips auto-load on first appear (spinner disappears; empty state only if API returns zero trips)
3. Tap a popular route chip (e.g., "Manila, PH")
4. Verify the search field updates with generated summary (e.g., `Manila, PH`)
5. Tap the filter button in the search field, adjust a filter (e.g., Transportation Method → Air Cargo), then apply
6. Confirm the search field updates once with the new filter summary (no repeated updates)
7. Tap the clear (`x`) button in the search field and confirm all filters reset and default trip list returns when available
8. Swipe to the second page (Active Deliveries), then back to page 1, ensuring trips reload if the list was previously empty and not loading

✅ VERIFY:
- Trips auto-load on first visit; empty state only when backend returns zero trips
- Popular route selection populates destination filter and updates search summary without duplicating text
- Filter application updates search summary once; no filter-loop flicker
- Clearing the search field removes active filters in both the search field and filter sheet
- Returning to page 1 re-triggers trip loading when applicable

❌ ERROR CASES:
- Trips fail to load when backend returns data
- Search summary appends duplicate text after applying filters
- Clearing search leaves filters active in filter sheet
- Popular route chip fails to set destination filter
```

#### **Test 6.6: Book a Trip**
```
STEPS:
1. From compatible trips list
2. Tap "Book Trip" on desired carrier
3. Review booking details
4. Confirm booking

✅ VERIFY:
- Booking confirmation sheet appears
- Shows:
  - Trip details
  - Package details
  - Estimated cost (CAD)
  - Pickup/delivery dates
- Tap "Confirm Booking"
- Success message appears
- Booking status "Pending"
- Carrier notified

❌ ERROR CASES:
- "Insufficient capacity" error
- Error alert with server message
```

### **Phase 3: Delivery Tracking**

#### **Test 6.7: View My Deliveries**
```
STEPS:
1. Navigate to "Deliveries" tab
2. View list of active deliveries
3. Tap on a delivery card

✅ VERIFY:
- Deliveries list shows all statuses
- Each card shows:
  - Carrier name & rating
  - Package description
  - Status badge (color-coded)
  - Pickup/delivery locations
  - Dates
- Can tap "View Details"
- Action buttons in 3-dot menu
```

#### **Test 6.8: Track Package**
```
STEPS:
1. Navigate to Deliveries
2. Find in-transit delivery
3. Tap 3-dot menu → "Track Package"

✅ VERIFY:
- Tracking view appears
- Shows current status
- Status timeline visible
- Carrier location (if available)
- Estimated delivery time
- Can refresh status
```

### **Phase 4: Code Verification**

#### **Test 6.9: Generate Pickup Code (Shipper)**
```
STEPS:
1. Navigate to Deliveries
2. Find confirmed booking
3. Tap 3-dot menu → "Generate Pickup Code"
4. Code auto-generates
5. Share code with carrier

✅ VERIFY:
- 6-digit code displays
- Expiration timer shows (15 minutes)
- Can copy to clipboard
- Can regenerate if expired

❌ ERROR CASES:
- Error alert with server message
```

#### **Test 6.10: Confirm Delivery with Code**
```
STEPS:
1. Receive 6-digit delivery code from carrier
2. Navigate to delivery
3. Tap "Confirm Delivery Code"
4. Enter 6-digit code
5. Tap "Verify"

✅ VERIFY:
- Code input screen appears
- 6 separate input fields
- Code validates successfully
- Status changes to "Delivered"
- Success message appears
- Payment processed

❌ ERROR CASES:
- "Invalid code" error shown inline
- "Expired code" error
- Can contact carrier if issue
```

### **Phase 5: Match Management**

#### **Test 6.11: Accept Match Offer**
```
STEPS:
1. Navigate to Deliveries
2. Find match with "Pending" status
3. Tap 3-dot menu → "Accept Match"
4. Confirm acceptance

✅ VERIFY:
- Confirmation alert appears
- Status changes to "Confirmed"
- Carrier notified
- Success message appears

❌ ERROR CASES:
- Error alert with server message
```

#### **Test 6.12: Decline Match Offer**
```
STEPS:
1. Navigate to Deliveries
2. Find match with "Pending" status
3. Tap 3-dot menu → "Decline Match"
4. Confirm decline

✅ VERIFY:
- Confirmation alert appears
- Match removed from list
- Carrier notified

❌ ERROR CASES:
- Error alert with server message
```

#### **Test 6.13: Cancel Delivery**
```
STEPS:
1. Navigate to Deliveries
2. Find active delivery
3. Tap 3-dot menu → "Cancel Delivery"
4. Confirm cancellation

✅ VERIFY:
- Confirmation alert appears
- Warning about cancellation policy
- Status changes to "Cancelled"
- Carrier notified
- Refund processed (if applicable)

❌ ERROR CASES:
- Error alert with server message
- "Cannot cancel" if already picked up
```

#### **Test 6.14: Rate Carrier After Delivery**
```
STEPS:
1. Navigate to completed delivery
2. Tap 3-dot menu → "Rate Carrier"
3. Select star rating (1-5)
4. Write review text
5. Select review categories
6. Tap "Submit Rating"

✅ VERIFY:
- Rating sheet appears
- Shows carrier details & current rating
- Star rating selectable
- Review categories available
- Success message appears
- Rating recorded

❌ ERROR CASES:
- Error alert: "Failed to submit rating: [server message]"
```

### **Phase 6: Analytics**

#### **Test 6.15: View Shipper Analytics**
```
STEPS:
1. Navigate to Analytics tab (Shipper mode)
2. Review dashboard:
   - Total Packages Sent
   - Total Spent (CAD)
   - Active Deliveries
   - Average Delivery Time
   - Success Rate (%)
3. Select time period
4. View spending chart

✅ VERIFY:
- All metrics display correctly
- Spending formatted as CAD $X.XX
- Charts render properly
- Time period filter works
```

---

## 🔄 **Matching & Booking**

### **Test 7.1: Automatic Trip Matching**
```
STEPS:
1. Create package request
2. Wait for matching algorithm
3. Check "Compatible Trips" section

✅ VERIFY:
- System auto-suggests compatible trips
- Trips match route (cities/countries)
- Trips have sufficient capacity
- Trips within date range
- Sorted by relevance/price
```

### **Test 7.2: Manual Trip Search**
```
STEPS:
1. Navigate to Browse Trips
2. Apply filters:
   - Origin city/country
   - Destination city/country
   - Date range
   - Price range
   - Vehicle type
3. Tap "Search"

✅ VERIFY:
- Filter sheet appears
- All filter options work
- Results match filters
- Can clear filters
- Can save preferences
```

### **Test 7.3: End-to-End Booking Flow**
```
COMPLETE FLOW:
1. Shipper creates package
2. Shipper browses compatible trips
3. Shipper selects carrier
4. Shipper reviews booking details
5. Shipper confirms booking
6. Carrier receives notification
7. Carrier accepts booking
8. Both parties notified
9. Status updates to "Confirmed"

✅ VERIFY:
- Each step completes successfully
- Notifications sent at each stage
- Status updates tracked
- All parties informed
```

### **Test 7.4: Auto-Confirm Workflow (Carrier Accepts Shipper Request)**
```
OBJECTIVE: Verify automatic confirmation when both parties have accepted

PREREQUISITES: Shipper has sent a request to carrier

STEPS:
1. As carrier, navigate to Active Bookings
2. Find booking with "Pending Request" status
3. Tap "Accept Booking"
4. Wait for API response

✅ VERIFY:
- If auto_confirmed=true: Status immediately becomes "Confirmed"
- If auto_confirmed=false AND status="shipper_accepted": App auto-calls confirm → "Confirmed"
- If auto_confirmed=false AND status="carrier_accepted": App skips confirm, shows awaiting status
- No 409 "Can only confirm after shipper acceptance" errors
- UI updates immediately
- Pickup code button appears when status is "Confirmed"

❌ ERROR CASES:
- 409 error when calling confirm too early
- UI shows wrong status
- Pickup code available before confirmation
```

### **Test 7.5: Auto-Confirm Workflow (Shipper Accepts Carrier Request)**
```
OBJECTIVE: Verify shippers never call confirm endpoint

PREREQUISITES: Carrier has sent a request to shipper

STEPS:
1. As shipper, navigate to Deliveries
2. Find match with "Pending Acceptance" status
3. Tap "Accept"
4. Wait for API response

✅ VERIFY:
- If auto_confirmed=true: Status becomes "Confirmed" immediately
- If auto_confirmed=false: App skips confirm, returns match with current status
- Shippers NEVER call confirm endpoint (only carriers do)
- UI shows appropriate status
- No errors

❌ ERROR CASES:
- Error if shipper tries to call confirm
```

### **Test 7.6: Auto-Confirm Workflow (Carrier Accepts Package to Create Match)**
```
OBJECTIVE: Verify carrier creating a match from package acceptance

PREREQUISITES: Package request exists

STEPS:
1. As carrier, find a package request
2. Tap "Accept Package"
3. Wait for API response

✅ VERIFY:
- Match created with status "carrier_requested" (typical case)
- App skips confirm call for "carrier_requested" status
- If rare edge case of "carrier_accepted": App calls confirm
- UI shows correct status
- No premature confirm calls

❌ ERROR CASES:
- Confirm called too early
- Wrong status displayed
```

---

## 🚚 **Delivery Management**

### **Test 8.1: Complete Pickup Flow**
```
END-TO-END PICKUP:
1. Shipper generates pickup code
2. Carrier receives code
3. Carrier arrives at pickup location
4. Carrier enters code to confirm
5. Status updates to "Picked Up"
6. Both parties notified

✅ VERIFY:
- Code generates successfully
- Code expires after 15 minutes
- Carrier can verify code
- Status updates immediately
- Notifications sent

❌ ERROR CASES:
- "Expired code" handled gracefully
- "Invalid code" shows clear error
- Can regenerate code
```

### **Test 8.2: In-Transit Tracking**
```
STEPS:
1. Shipper opens tracking view
2. Monitor status updates
3. Check estimated arrival
4. View carrier location (if enabled)

✅ VERIFY:
- Real-time status visible
- Timeline shows progress
- Location updates (if permitted)
- ETA displayed
- Can refresh status
```

### **Test 8.3: Complete Delivery Flow**
```
END-TO-END DELIVERY:
1. Carrier generates delivery code
2. Carrier arrives at delivery location
3. Shipper receives package
4. Shipper enters code to confirm
5. Status updates to "Delivered"
6. Payment processed
7. Rating prompts appear

✅ VERIFY:
- Code generates successfully
- Shipper can verify delivery
- Status finalizes
- Payment completes
- Both can rate each other

❌ ERROR CASES:
- Code expiration handled
- Payment failures shown with alert
```

---

## 💳 **Payment System**

### **Test 9.1: View Payment Methods**
```
STEPS:
1. Navigate to Profile → Payment Methods
2. View list of saved cards/methods

✅ VERIFY:
- Payment methods list appears
- Shows card last 4 digits
- Shows card brand (Visa/MC/Amex)
- Shows expiration date
- Default method marked
```

### **Test 9.2: Add Payment Method**
```
STEPS:
1. Navigate to Payment Methods
2. Tap "Add Payment Method"
3. Enter card details:
   - Card number
   - Expiry date
   - CVV
   - Cardholder name
   - Billing address
4. Tap "Save Card"

✅ VERIFY:
- Secure payment form appears
- Card validation works
- Luhn check for card number
- Expiry validated (future date)
- CVV format checked
- Success message appears
- Card added to list

❌ ERROR CASES:
- "Invalid card number" validation
- "Card expired" error
- Error alert: "Failed to add card: [message]"
```

### **Test 9.3: Process Payment (Booking)**
```
STEPS:
1. Complete delivery
2. System auto-processes payment
3. Check transaction history

✅ VERIFY:
- Payment processed automatically
- Shipper charged agreed amount
- Carrier receives earnings (minus fees)
- Receipt generated
- Email confirmation sent
- Transaction in history

❌ ERROR CASES:
- "Payment failed" alert with reason
- Can retry payment
- Alternative payment option offered
```

### **Test 9.4: View Transaction History**
```
STEPS:
1. Navigate to Profile → Transaction History
2. View list of transactions
3. Tap on a transaction for details

✅ VERIFY:
- All transactions listed
- Shows date, amount (CAD), status
- Carrier: Earnings (green +)
- Shipper: Payments (red -)
- Can filter by date range
- Can search transactions
- Details show full breakdown
```

---

## 💬 **Chat & Communication**

### **Test 10.1: Send Message**
```
STEPS:
1. Navigate to booking/delivery
2. Tap "Chat" button
3. Type message
4. Tap send

✅ VERIFY:
- Chat interface appears
- Message appears in chat
- Sent timestamp shown
- Delivery status indicated
- Other user receives notification

❌ ERROR CASES:
- Inline error if send fails
- "Network error" message
- Can retry sending
- Alert: "Failed to send message: [message]"
```

### **Test 10.2: Receive Message**
```
STEPS:
1. Wait for message from other party
2. Check notification
3. Open chat

✅ VERIFY:
- Push notification received
- Badge count on tab
- Message appears in chat
- Unread indicator shown
```

### **Test 10.3: Send Image**
```
STEPS:
1. In chat, tap attachment button
2. Select "Photo"
3. Choose image
4. Tap send

✅ VERIFY:
- Photo picker appears
- Upload progress shown
- Image appears in chat
- Image downloadable by recipient

❌ ERROR CASES:
- "Upload failed" alert
- Can retry upload
```

---

## ⭐ **Ratings & Reviews**

### **Test 11.1: Submit Rating**
```
STEPS:
1. After delivery completion
2. Rating prompt appears OR navigate to completed delivery
3. Tap "Rate [Carrier/Shipper]"
4. Select star rating (1-5)
5. Write review text (optional)
6. Select quick tags:
   - Punctual
   - Professional
   - Careful handling
   - Good communication
   - Would recommend
7. Tap "Submit Rating"

✅ VERIFY:
- Rating sheet appears
- Shows other party's current rating
- Stars tappable
- Review text optional
- Tag selection works
- Success message appears
- Rating saved
- Other party's rating updated

❌ ERROR CASES:
- Error alert: "Failed to submit rating: [server message]"
- Can retry submission
- Cannot rate twice
```

### **Test 11.2: View Reviews**
```
STEPS:
1. Navigate to Profile
2. Tap on rating display
3. View all reviews

✅ VERIFY:
- Reviews list appears
- Each review shows:
  - Rater name
  - Star rating
  - Review text
  - Date
  - Tags
- Average rating displayed
- Total count shown
```

---

## 📊 **Analytics Dashboard**

### **Test 12.1: Carrier Analytics**
```
STEPS:
1. Navigate to Analytics tab (Carrier mode)
2. Review all sections:
   - Overview cards
   - Period selector
   - Earnings chart
   - Performance metrics
   - Trip statistics
   - Top routes

✅ VERIFY:
- All cards display correct data
- Currency formatted as CAD $
- Charts render properly
- Period filter updates data
- Percentages calculated correctly
```

### **Test 12.2: Shipper Analytics**
```
STEPS:
1. Navigate to Analytics tab (Shipper mode)
2. Review sections:
   - Spending overview
   - Packages sent
   - Active deliveries
   - Success rate
   - Spending chart
   - Package distribution

✅ VERIFY:
- All metrics display correctly
- Spending trends visible
- Package breakdown shown
- Charts update with period
```

---

## 📜 **History & Records**

### **Test 13.1: View Package History**
```
STEPS:
1. Navigate to History tab
2. Select "Package History"
3. View list of all packages

✅ VERIFY:
- All packages listed
- Status badges shown
- Sorted by date (newest first)
- Can filter by status
- Can search by keyword
- Tap to view details

❌ ERROR CASES:
- Inline error view if load fails
- "Pull to refresh" to retry
```

### **Test 13.2: View Delivery History**
```
STEPS:
1. Navigate to History tab
2. Select "Delivery History"
3. View list of deliveries

✅ VERIFY:
- All deliveries listed
- Shows completion date
- Shows final status
- Can tap for full details
- Receipt available
- Can re-rate if needed

❌ ERROR CASES:
- Error view shown if load fails
- Retry button available
```

### **Test 13.3: Search & Filter History**
```
STEPS:
1. In History view, tap search/filter
2. Enter search term OR select date range
3. View filtered results

✅ VERIFY:
- Search field appears
- Results update as typing
- Searches: description, locations, dates, names
- Can clear search/filter
- Date range picker works
```

---

## ⚠️ **Error Handling**

### **Test 14.1: Network Disconnection**
```
STEPS:
1. Enable airplane mode
2. Attempt various actions

✅ VERIFY:
- Clear "Network error" messages shown
- Offline indicator displayed
- Can retry when back online
- Queued actions resume automatically
```

### **Test 14.2: Invalid Verification Code**
```
STEPS:
1. Enter incorrect 6-digit code
2. Try expired code
3. Try already-used code

✅ VERIFY:
- "Invalid code" error shown inline
- "Expired code" message clear
- "Code already used" error
- Can request new code
```

### **Test 14.3: Payment Failure**
```
STEPS:
1. Use card that will be declined
2. Attempt payment

✅ VERIFY:
- "Payment declined" alert shown
- Shows reason (insufficient funds, etc.)
- Can update payment method
- Can retry payment
```

### **Test 14.4: API Error Handling**
```
TEST ALL FEATURES FOR:
✅ VERIFY:
- All API failures show error alerts
- Error messages include:
  - Server error message
  - HTTP status code
  - User-friendly description
- Network errors clearly indicated
- Can retry after errors
- No silent failures
```

---

## 🐛 **Bug Reporting**

### **When Reporting Issues:**

#### **Required Information:**
1. **Screenshot:** Capture screen where issue occurs
2. **Console Logs:** Copy error messages from Xcode
3. **Steps to Reproduce:** Exact steps (numbered)
4. **Expected vs Actual:** What should happen vs what happened
5. **Device Info:** iPhone model, iOS version
6. **App Version:** Check in Profile → About

#### **Bug Report Template:**
```
TITLE: [Short description]

PRIORITY: 🔴 Critical / 🟡 High / 🔵 Medium / ⚪ Low

TEST CASE: [Reference test number, e.g., Test 6.1]

STEPS TO REPRODUCE:
1. 
2. 
3. 

EXPECTED RESULT:


ACTUAL RESULT:


ERROR MESSAGE (if any):


SCREENSHOTS: [Attach]

DEVICE: iPhone [model]
iOS: [version]
APP VERSION: [version]

USER ROLE: Carrier / Shipper / Both

ADDITIONAL NOTES:

```

#### **Priority Levels:**
- **🔴 Critical:** App crashes, data loss, cannot complete core flows
- **🟡 High:** Feature broken, blocks testing, no workaround
- **🔵 Medium:** Feature partially works, has workaround
- **⚪ Low:** Minor UI/UX issues, cosmetic problems

---

## ✅ **Testing Checklist**

### **Critical Path (Must Pass Before Release)**
- [ ] Google/Facebook/Apple OAuth login
- [ ] Package creation with pickup_country and delivery_country fields
- [ ] Trip creation
- [ ] Booking flow end-to-end
- [ ] Auto-confirm workflow (Carrier accepts shipper request)
- [ ] Auto-confirm workflow (Shipper accepts carrier request)
- [ ] Auto-confirm workflow (Carrier accepts package to create match)
- [ ] Pickup code generation and verification
- [ ] Delivery code generation and verification
- [ ] Payment processing
- [ ] Rating submission
- [ ] Error alerts for ALL API failures with meaningful messages

### **High Priority**
- [ ] Profile editing with error handling
- [ ] Phone verification (OTP send/verify)
- [ ] Role switching (Carrier/Shipper)
- [ ] Trip editing and cancellation
- [ ] Package editing and cancellation
- [ ] Shipper Home browse and filter synchronization
- [ ] Accept/decline bookings
- [ ] Mark picked up/delivered
- [ ] Chat messaging with error handling
- [ ] Analytics dashboard (both roles)
- [ ] History views (package/delivery)

### **Medium Priority**
- [ ] Premium verification
- [ ] Payment methods management
- [ ] Transaction history
- [ ] Search and filters
- [ ] Profile picture upload
- [ ] Vehicle information

### **Nice-to-Have**
- [ ] Onboarding flow
- [ ] Performance testing
- [ ] Accessibility testing
- [ ] Dark mode verification

---

## 🎯 **Success Criteria**

### **Shipper Journey Success:**
- ✅ Can create packages with ALL required fields including countries
- ✅ Can browse and request trips
- ✅ Can accept/decline carrier requests
- ✅ Can track deliveries
- ✅ Can verify codes
- ✅ Status updates work correctly
- ✅ Error alerts show for all failures

### **Carrier Journey Success:**
- ✅ Can setup profile and activate carrier role
- ✅ Can create trips with proper validation
- ✅ Can manage bookings (accept/decline)
- ✅ Can generate and verify codes
- ✅ Can mark pickup/delivered
- ✅ All status changes work correctly
- ✅ Error alerts show for all failures

### **System Integration Success:**
- ✅ Role switching works smoothly
- ✅ Cross-role interactions complete successfully
- ✅ Real-time status updates function
- ✅ Message exchange works end-to-end
- ✅ Payment processing works
- ✅ Rating system functional
- ✅ Analytics data accurate
- ✅ All error handling in place

---

## 🔐 **Pickup & Delivery Verification**

### **Test 13.1: Carrier Pickup Verification**
```
STEPS:
1. As Carrier, accept a package request
2. Navigate to Matches tab
3. Find confirmed booking
4. Tap "Enter Pickup Code" button
5. Enter pickup verification code provided by shipper
6. Tap "Confirm Pickup"

✅ VERIFY:
- Pickup code sheet appears
- Code input field accepts 6-digit code
- "Confirm Pickup" button enabled when code entered
- Success message: "Package picked up successfully"
- Booking status changes to "Picked Up"
- Package moves to "In Transit" status

❌ ERROR CASES:
- Invalid code: "Invalid pickup code. Please try again."
- Expired code: "Pickup code has expired. Contact shipper."
- Network error: "Failed to verify pickup. Check connection."
- Can retry with correct code
```

### **Test 13.2: Carrier Delivery Verification**
```
STEPS:
1. After successful pickup (package in "Picked Up" status)
2. Navigate to Matches tab
3. Find picked up booking
4. Tap "Enter Delivery Code" button
5. Enter delivery verification code provided by shipper
6. Tap "Confirm Delivery"

✅ VERIFY:
- Delivery code sheet appears
- Code input field accepts 6-digit code
- "Confirm Delivery" button enabled when code entered
- Success message: "Package delivered successfully"
- Booking status changes to "Delivered"
- Package moves to "Delivered" status
- Rating prompt appears for shipper

❌ ERROR CASES:
- Invalid code: "Invalid delivery code. Please try again."
- Expired code: "Delivery code has expired. Contact shipper."
- Network error: "Failed to verify delivery. Check connection."
- Can retry with correct code
```

### **Test 13.3: Shipper Code Generation (Pickup)**
```
STEPS:
1. As Shipper, after carrier accepts request
2. Navigate to Deliveries tab
3. Find confirmed booking
4. Tap "Generate Pickup Code" button
5. Share code with carrier (via chat or in-person)

✅ VERIFY:
- Code generation sheet appears
- 6-digit code displayed
- Code expiration time shown (e.g., "Expires in 15 minutes")
- "Share Code" button works
- Code can be copied to clipboard
- Timer countdown visible

❌ ERROR CASES:
- "Failed to generate code" alert
- Can retry generation
- Code expires after time limit
```

### **Test 13.4: Shipper Code Generation (Delivery)**
```
STEPS:
1. As Shipper, after package is picked up
2. Navigate to Deliveries tab
3. Find "Picked Up" booking
4. Tap "Generate Delivery Code" button
5. Share code with carrier (via chat or in-person)

✅ VERIFY:
- Code generation sheet appears
- 6-digit code displayed
- Code expiration time shown
- "Share Code" button works
- Code can be copied to clipboard
- Timer countdown visible

❌ ERROR CASES:
- "Failed to generate code" alert
- Can retry generation
- Code expires after time limit
```

### **Test 13.5: Code Expiration Handling**
```
STEPS:
1. Generate pickup/delivery code
2. Wait for code to expire (or use expired code)
3. Try to use expired code

✅ VERIFY:
- Expired code shows: "Code has expired. Generate new code."
- Can generate new code
- Old code becomes invalid
- Timer shows "Expired" status

❌ ERROR CASES:
- Cannot use expired codes
- Must generate fresh code
- Clear error messages
```

### **Test 13.6: Cross-Role Verification Flow**
```
STEPS:
1. Shipper creates package request
2. Carrier accepts request
3. Shipper generates pickup code
4. Carrier enters pickup code → Package picked up
5. Shipper generates delivery code
6. Carrier enters delivery code → Package delivered
7. Rating prompt appears

✅ VERIFY:
- Complete end-to-end flow works
- Status updates in real-time for both users
- Chat notifications sent for each step
- Final delivery triggers rating system
- Both users can track progress

❌ ERROR CASES:
- Status sync issues between users
- Missing notifications
- Rating prompt not appearing
```

### **Test 13.7: Verification Code Security**
```
STEPS:
1. Generate multiple codes for different packages
2. Try using wrong code for package
3. Try using code from different user

✅ VERIFY:
- Each code is unique
- Codes are package-specific
- Cannot use code for wrong package
- Cannot use code from different user
- Clear error messages for mismatched codes

❌ ERROR CASES:
- "This code is for a different package"
- "Code not found for this package"
- Security validation works
```

---

## 📞 **Support & Resources**

### **Getting Help:**
- Check Xcode console logs for debugging info
- Verify backend server is running
- Try logout/login if authentication issues
- Clear app data and reinstall if needed
- Report bugs with detailed information

### **Contact Information:**
- **Developer Team:** [email/slack]
- **Product Manager:** [contact]
- **QA Lead:** [contact]

---

## 📝 **Document Information**

**Last Updated:** October 30, 2025  
**Document Version:** 2.2  
**App Version:** TBD  
**Test Coverage:** Comprehensive - All features including pickup/delivery verification and auto-confirm workflow

**Recent Updates**:
- October 30, 2025: Added auto-confirm workflow test cases (Test 7.4, 7.5, 7.6)

---

**Happy Testing! 🚀**

*Remember: Every bug you find makes the app better for our users!*
