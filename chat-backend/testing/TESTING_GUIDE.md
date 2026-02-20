# Pasabayan iOS App - Testing Guide

## 📋 Table of Contents
1. [Authentication & Onboarding](#authentication--onboarding)
2. [Profile Management](#profile-management)
3. [Phone Verification](#phone-verification)
4. [Premium Verification](#premium-verification)
5. [Carrier Features](#carrier-features)
6. [Shipper Features](#shipper-features)
7. [Matching & Booking](#matching--booking)
8. [Delivery Management](#delivery-management)
9. [Payment System](#payment-system)
10. [Chat & Communication](#chat--communication)
11. [Ratings & Reviews](#ratings--reviews)
12. [Analytics Dashboard](#analytics-dashboard)
13. [History & Records](#history--records)

---

## 🚀 Authentication & Onboarding

### Test Case 1.1: First-Time User Onboarding
**Objective**: Verify onboarding screen appears for new users

**Prerequisites**: 
- Fresh app install OR reset onboarding (use debug button on login screen)

**Steps**:
1. Launch the app
2. Observe the onboarding screen with 5 slides
3. Swipe through all slides:
   - Slide 1: Welcome screen with app description
   - Slide 2: Carrier features (send packages, earn money, flexible schedule)
   - Slide 3: Shipper features (affordable delivery, real-time tracking, reliable carriers)
   - Slide 4: Location permissions explanation
   - Slide 5: Role selection (optional)
4. Test "Skip" button on any slide (should jump to last slide)
5. Select a role (Carrier/Shipper) or skip
6. Tap "Get Started"

**Expected Results**:
- ✅ Onboarding slides appear with consistent spacing
- ✅ Dot indicators show current position
- ✅ Skip button works on all slides except the last
- ✅ Role selection is optional
- ✅ Get Started button navigates to login screen
- ✅ Onboarding doesn't appear again after completion

**Error Cases**:
- ❌ Onboarding appears every time app launches
- ❌ Slides are misaligned or have spacing issues
- ❌ Get Started button doesn't work

---

### Test Case 1.2: Google Sign-In
**Objective**: Test OAuth authentication with Google

**Prerequisites**: 
- Valid Google account
- Internet connection

**Steps**:
1. On login screen, tap "Sign in with Google"
2. Select Google account
3. Grant permissions
4. Wait for authentication

**Expected Results**:
- ✅ Google sign-in sheet appears
- ✅ User can select account
- ✅ Loading indicator appears during authentication
- ✅ Successfully navigates to dashboard
- ✅ User profile populated with Google info (name, email, avatar)

**Error Cases**:
- ❌ "Failed to authenticate" error alert appears with meaningful message
- ❌ Network error shows: "Network error: [description]"
- ❌ Server error shows: "Server error (HTTP 500): [message]"

---

### Test Case 1.3: Facebook Sign-In
**Objective**: Test OAuth authentication with Facebook

**Prerequisites**: 
- Valid Facebook account
- Internet connection

**Steps**:
1. On login screen, tap "Sign in with Facebook"
2. Enter Facebook credentials
3. Grant permissions
4. Wait for authentication

**Expected Results**:
- ✅ Facebook login sheet appears
- ✅ Loading indicator appears during authentication
- ✅ Successfully navigates to dashboard
- ✅ User profile populated with Facebook info

**Error Cases**:
- ❌ Error alert shows meaningful server/network message
- ❌ Can retry authentication after error

---

### Test Case 1.4: Apple Sign-In
**Objective**: Test OAuth authentication with Apple

**Prerequisites**: 
- Apple ID
- iOS device (Apple Sign-In not available on simulator in some cases)

**Steps**:
1. On login screen, tap "Sign in with Apple"
2. Authenticate with Face ID/Touch ID
3. Choose to share or hide email
4. Wait for authentication

**Expected Results**:
- ✅ Apple authentication sheet appears
- ✅ Successfully authenticates
- ✅ Profile created with Apple account info

**Error Cases**:
- ❌ Error alert displays with clear message

---

### Test Case 1.5: Logout
**Objective**: Verify logout clears all user data

**Steps**:
1. Navigate to Profile tab
2. Scroll down and tap "Logout"
3. Confirm logout

**Expected Results**:
- ✅ Returns to login screen
- ✅ OAuth provider signed out (Google/Facebook/Apple)
- ✅ User data cleared from app
- ✅ Keychain token cleared

---

## 👤 Profile Management

### Test Case 2.1: View Profile
**Objective**: View current user profile information

**Prerequisites**: User logged in

**Steps**:
1. Navigate to Profile tab
2. Observe profile information

**Expected Results**:
- ✅ Profile picture displays (or placeholder)
- ✅ User name shows correctly
- ✅ Email displays
- ✅ Phone number shows (if verified)
- ✅ Verification badges visible (phone, premium)
- ✅ Role status shown (Active Carrier/Shipper)

---

### Test Case 2.2: Edit Profile Information
**Objective**: Update user profile details

**Prerequisites**: User logged in

**Steps**:
1. Navigate to Profile tab
2. Tap "Edit Profile"
3. Modify:
   - Full name
   - Delivery address
   - Additional info
4. Tap "Save"

**Expected Results**:
- ✅ Edit sheet appears
- ✅ Current values pre-populated
- ✅ Can modify all fields
- ✅ Success message appears after save
- ✅ Profile updates reflect immediately
- ✅ Sheet dismisses automatically

**Error Cases**:
- ❌ Error alert shows: "Failed to update profile: [server message]"
- ❌ Can retry after error
- ❌ Sheet remains open on error

---

### Test Case 2.3: Upload Profile Picture
**Objective**: Change user profile picture

**Prerequisites**: User logged in, photo library access

**Steps**:
1. Navigate to Profile tab
2. Tap profile picture
3. Select "Choose from Library"
4. Pick an image
5. Confirm upload

**Expected Results**:
- ✅ Photo picker appears
- ✅ Can select image
- ✅ Upload progress indicator shows
- ✅ Profile picture updates
- ✅ Avatar syncs with backend

**Error Cases**:
- ❌ "Upload failed" alert with server error message
- ❌ Can retry upload

---

### Test Case 2.4: Edit Carrier Vehicle Information
**Objective**: Update carrier profile and vehicle details

**Prerequisites**: User is an active carrier

**Steps**:
1. Navigate to Profile tab
2. Tap "Vehicle Information"
3. Update:
   - Vehicle type
   - Vehicle capacity
   - License plate
   - Insurance info
4. Tap "Save"

**Expected Results**:
- ✅ Vehicle info sheet appears
- ✅ Current values loaded
- ✅ Can modify all fields
- ✅ Saves successfully
- ✅ Updates reflect on carrier profile

**Error Cases**:
- ❌ Error alert with meaningful message
- ❌ Form validation errors shown clearly

---

## 📱 Phone Verification

### Test Case 3.1: Send OTP
**Objective**: Request phone verification code

**Prerequisites**: User logged in, unverified phone

**Steps**:
1. Navigate to Profile tab
2. Tap "Verify Phone Number"
3. Enter phone number with country code
4. Tap "Send Code"

**Expected Results**:
- ✅ Phone input screen appears
- ✅ Country code selector works
- ✅ Loading indicator during OTP send
- ✅ Success message: "Code sent"
- ✅ Navigates to OTP input screen

**Error Cases**:
- ❌ Error alert: "Failed to send OTP: [server message]"
- ❌ Invalid phone format shows validation error
- ❌ Can retry sending code

---

### Test Case 3.2: Verify OTP
**Objective**: Complete phone verification with OTP code

**Prerequisites**: OTP sent to phone

**Steps**:
1. Check SMS for 6-digit code
2. Enter code in OTP input fields
3. Code auto-verifies when complete

**Expected Results**:
- ✅ 6 separate input fields appear
- ✅ Auto-focuses next field after digit entry
- ✅ Can paste entire code
- ✅ Auto-verifies when all 6 digits entered
- ✅ Success message appears
- ✅ Returns to profile
- ✅ Phone verified badge shows

**Error Cases**:
- ❌ "Invalid code" error alert with server message
- ❌ Can resend code
- ❌ Can edit phone number

---

### Test Case 3.3: Resend OTP
**Objective**: Request new verification code

**Prerequisites**: In OTP verification screen

**Steps**:
1. Wait for "Resend" button to enable (30 seconds)
2. Tap "Resend Code"
3. Wait for new code

**Expected Results**:
- ✅ Resend button disabled initially
- ✅ Countdown timer shows (30s)
- ✅ Button enables after countdown
- ✅ New code sent successfully
- ✅ Success toast appears

**Error Cases**:
- ❌ Error alert shows if resend fails

---

## 🎖️ Premium Verification

### Test Case 4.1: Upload Verification Documents
**Objective**: Submit documents for premium verification

**Prerequisites**: User logged in, phone verified

**Steps**:
1. Navigate to Profile tab
2. Tap "Get Premium Verification"
3. Review requirements
4. Upload:
   - Government ID (front)
   - Government ID (back)
   - Proof of address
   - Selfie with ID
5. Tap "Submit for Verification"

**Expected Results**:
- ✅ Document upload screen appears
- ✅ Can select photos from library
- ✅ Image preview shows
- ✅ Can remove/replace images
- ✅ Submit button enabled when all docs uploaded
- ✅ Upload progress indicator shows
- ✅ Success message appears
- ✅ Status changes to "Pending Review"

**Error Cases**:
- ❌ Error alert: "Upload failed: [server message]"
- ❌ Can retry individual document uploads
- ❌ Unsupported file format error shown

---

### Test Case 4.2: Check Verification Status
**Objective**: Monitor premium verification progress

**Prerequisites**: Documents submitted

**Steps**:
1. Navigate to Profile tab
2. Check verification status badge

**Expected Results**:
- ✅ Shows "Pending Review" status
- ✅ Shows "Approved" when verified
- ✅ Shows "Rejected" with reason if denied
- ✅ Premium badge visible when approved

---

## 🚛 Carrier Features

### Test Case 5.1: Enable Carrier Role
**Objective**: Activate carrier functionality

**Prerequisites**: User logged in

**Steps**:
1. Navigate to Profile tab
2. Tap "Become a Carrier"
3. Complete carrier profile:
   - Vehicle type
   - Vehicle capacity (weight kg, space liters)
   - Price per kg
   - Available routes
4. Tap "Activate Carrier Profile"

**Expected Results**:
- ✅ Carrier setup sheet appears
- ✅ All fields required
- ✅ Capacity inputs numeric only
- ✅ Price validation works
- ✅ Successfully activates
- ✅ Carrier dashboard becomes available
- ✅ Role switcher shows "Carrier" option

**Error Cases**:
- ❌ Validation errors shown clearly
- ❌ Server error alert with message

---

### Test Case 5.2: Create New Trip
**Objective**: Post a new carrier trip

**Prerequisites**: Active carrier

**Steps**:
1. Switch to Carrier role
2. Navigate to Trips tab
3. Tap "+" or "Create Trip" button
4. Fill in trip details:
   - Origin city & country
   - Destination city & country
   - Departure date & time
   - Available capacity (weight kg, space liters)
   - Price per kg
   - Transportation method (Car/Truck/Van/Motorcycle)
   - Special notes
5. Tap "Create Trip"

**Expected Results**:
- ✅ Trip creation form appears
- ✅ All fields required except special notes
- ✅ Date must be in future
- ✅ Delivery date must be after pickup
- ✅ Capacity and price must be positive numbers
- ✅ Country pickers show all available countries
- ✅ Success message appears
- ✅ Trip appears in "My Trips" list
- ✅ Trip status is "Planning"

**Error Cases**:
- ❌ Validation errors shown for invalid data
- ❌ Error alert: "Failed to create trip: [server message]"
- ❌ Can retry creation

---

### Test Case 5.3: Edit Trip
**Objective**: Modify existing trip details

**Prerequisites**: Carrier has trip in "Planning" status

**Steps**:
1. Navigate to Trips tab
2. Find trip in "Planning" status
3. Tap trip card
4. Tap 3-dot menu → "Edit Trip"
5. Modify any fields
6. Tap "Save Changes"

**Expected Results**:
- ✅ Edit sheet appears with pre-filled data
- ✅ Can modify all fields
- ✅ Validation works
- ✅ Success message appears
- ✅ Trip updates reflect immediately

**Error Cases**:
- ❌ Error alert with server message
- ❌ Cannot edit trips in "Active" or "Completed" status

---

### Test Case 5.4: Update Trip Status
**Objective**: Change trip status through lifecycle

**Prerequisites**: Carrier has trips in various statuses

**Steps**:
1. Navigate to Trips tab
2. Find trip
3. Tap 3-dot menu → "Update Status"
4. Select new status:
   - Planning → Scheduled
   - Scheduled → Active
   - Active → Completed
5. Confirm status change

**Expected Results**:
- ✅ Status update sheet appears
- ✅ Only valid next statuses shown
- ✅ Success message appears
- ✅ Trip status updates immediately
- ✅ Trip card badge color changes

**Error Cases**:
- ❌ Error alert: "Failed to update status: [message]"

---

### Test Case 5.5: Cancel Trip
**Objective**: Cancel a scheduled trip

**Prerequisites**: Carrier has trip not yet completed

**Steps**:
1. Navigate to Trips tab
2. Find trip to cancel
3. Tap 3-dot menu → "Cancel Trip"
4. Confirm cancellation

**Expected Results**:
- ✅ Confirmation alert appears
- ✅ Warning about irreversible action
- ✅ Trip status changes to "Cancelled"
- ✅ Trip moves to cancelled section
- ✅ Associated bookings notified

**Error Cases**:
- ❌ Error alert with server message
- ❌ Cannot cancel completed trips

---

### Test Case 5.6: View Active Bookings
**Objective**: Monitor incoming booking requests

**Prerequisites**: Carrier has trips with bookings

**Steps**:
1. Navigate to Home tab (Carrier mode)
2. View "Active Bookings" section
3. Tap on a booking card

**Expected Results**:
- ✅ Bookings list shows pending requests
- ✅ Each card shows:
  - Shipper name & rating
  - Package details
  - Pickup/delivery locations
  - Agreed price
  - Status badge
- ✅ Can tap "View Details"
- ✅ Action buttons available (Accept/Decline)

---

### Test Case 5.7: Accept Booking Request
**Objective**: Confirm a shipper's booking request

**Prerequisites**: Carrier has pending booking

**Steps**:
1. Navigate to Matches tab → "Active Bookings"
2. Find booking with "Pending" status
3. Tap 3-dot menu → "Accept Booking"
4. Confirm acceptance

**Expected Results**:
- ✅ Confirmation alert appears
- ✅ Loading indicator during API call
- ✅ Success message appears
- ✅ Booking status changes to "Confirmed"
- ✅ Shipper receives notification
- ✅ Trip capacity updates

**Error Cases**:
- ❌ Error alert: "Failed to accept booking: [server message]"
- ❌ "Insufficient capacity" error if applicable

---

### Test Case 5.8: Decline Booking Request
**Objective**: Reject a shipper's booking request

**Prerequisites**: Carrier has pending booking

**Steps**:
1. Navigate to Matches tab → "Active Bookings"
2. Find booking with "Pending" status
3. Tap 3-dot menu → "Decline Booking"
4. Confirm decline

**Expected Results**:
- ✅ Confirmation alert appears
- ✅ Success message appears
- ✅ Booking removed from active list
- ✅ Shipper notified

**Error Cases**:
- ❌ Error alert with server message

---

### Test Case 5.9: Mark Package as Picked Up
**Objective**: Confirm package pickup from shipper

**Prerequisites**: Booking status is "Confirmed"

**Steps**:
1. Navigate to Active Bookings
2. Find confirmed booking
3. Tap 3-dot menu → "Mark Picked Up"
4. Confirm action

**Expected Results**:
- ✅ Confirmation alert appears
- ✅ Status changes to "Picked Up"
- ✅ Shipper receives notification
- ✅ Delivery code becomes active

**Error Cases**:
- ❌ Error alert with meaningful message

---

### Test Case 5.10: Mark Package as Delivered
**Objective**: Complete delivery to recipient

**Prerequisites**: Booking status is "Picked Up" or "In Transit"

**Steps**:
1. Navigate to Active Bookings
2. Find in-transit booking
3. Tap 3-dot menu → "Mark Delivered"
4. Confirm delivery

**Expected Results**:
- ✅ Confirmation alert appears
- ✅ Status changes to "Delivered"
- ✅ Shipper notified
- ✅ Earnings updated
- ✅ Rating prompt appears

**Error Cases**:
- ❌ Error alert with server error details

---

### Test Case 5.11: Generate Pickup Code
**Objective**: Create verification code for package pickup

**Prerequisites**: Booking confirmed, not yet picked up

**Steps**:
1. Navigate to Active Bookings
2. Find confirmed booking
3. Tap 3-dot menu → "Generate Pickup Code"
4. Code auto-generates

**Expected Results**:
- ✅ Code generation sheet appears
- ✅ 6-digit code displays
- ✅ Expiration time shown (15 minutes)
- ✅ Countdown timer visible
- ✅ Can share code with shipper
- ✅ Code copied to clipboard option

**Error Cases**:
- ❌ Error alert: "Failed to generate code: [server message]"
- ❌ Expired code shows clear message

---

### Test Case 5.12: Confirm Pickup with Code
**Objective**: Verify shipper's code at pickup

**Prerequisites**: Shipper has generated pickup code

**Steps**:
1. Receive 6-digit code from shipper
2. Navigate to booking
3. Tap "Confirm Pickup Code"
4. Enter 6-digit code
5. Tap "Verify"

**Expected Results**:
- ✅ Code input screen appears
- ✅ 6 separate input fields
- ✅ Code validates successfully
- ✅ Status changes to "Picked Up"
- ✅ Success message appears

**Error Cases**:
- ❌ "Invalid code" error with inline message
- ❌ "Expired code" error shown
- ❌ Can request new code

---

### Test Case 5.13: Generate Delivery Code
**Objective**: Create verification code for package delivery

**Prerequisites**: Package picked up, in transit

**Steps**:
1. Navigate to Active Bookings
2. Find picked-up booking
3. Tap 3-dot menu → "Generate Delivery Code"
4. Code auto-generates

**Expected Results**:
- ✅ 6-digit delivery code displays
- ✅ Expiration timer shows (15 minutes)
- ✅ Can share with recipient
- ✅ Clipboard copy option

**Error Cases**:
- ❌ Error alert with server message

---

### Test Case 5.14: Rate Shipper After Delivery
**Objective**: Provide feedback for shipper

**Prerequisites**: Delivery completed

**Steps**:
1. Navigate to completed booking
2. Tap 3-dot menu → "Rate Shipper"
3. Select star rating (1-5)
4. Write review text (optional)
5. Select review categories
6. Tap "Submit Rating"

**Expected Results**:
- ✅ Rating sheet appears
- ✅ Shows shipper details
- ✅ Star rating selectable
- ✅ Review categories available
- ✅ Success message appears
- ✅ Rating recorded
- ✅ Cannot rate twice

**Error Cases**:
- ❌ Error alert: "Failed to submit rating: [server message]"

---

### Test Case 5.15: View Carrier Analytics
**Objective**: Monitor carrier performance metrics

**Prerequisites**: Active carrier with trip history

**Steps**:
1. Navigate to Analytics tab (Carrier mode)
2. Review dashboard sections:
   - Total Earnings
   - Completed Trips
   - Active Trips
   - Success Rate
   - Average Rating
3. Select time period (Week/Month/Year)
4. View earnings chart

**Expected Results**:
- ✅ All metrics display correctly
- ✅ Earnings formatted as CAD $X.XX
- ✅ Charts render properly
- ✅ Time period filter works
- ✅ Data updates when changed

---

## 📦 Shipper Features

### Test Case 6.1: Create Package Request
**Objective**: Post a new package for delivery

**Prerequisites**: User logged in (as shipper)

**Steps**:
1. Navigate to Packages tab
2. Tap "+" or "New Package Request"
3. Fill in all fields:
   - Package description
   - Weight (kg)
   - Package value (CAD)
   - Max budget (CAD)
   - Package type (Electronics/Documents/Food/etc.)
   - Urgency level
   - Is fragile? (toggle)
   - Pickup address
   - Pickup city
   - **Pickup country** (required)
   - Preferred pickup date & time
   - Pickup flexible? (toggle)
   - Delivery address
   - Delivery city
   - **Delivery country** (required)
   - Preferred delivery date & time
   - Special instructions
   - Upload photos (up to 5)
4. Tap "Create Package Request"

**Expected Results**:
- ✅ Form appears with all fields
- ✅ Country pickers show all 37+ countries
- ✅ Weight/value/budget accept numbers only
- ✅ Pickup/delivery dates validated (future dates)
- ✅ Delivery date must be after pickup
- ✅ Photo picker allows up to 5 images
- ✅ Image thumbnails show in carousel
- ✅ Validation errors shown clearly
- ✅ Success message: "Package request created!"
- ✅ Package appears in "My Packages" list
- ✅ Status is "Open"

**Error Cases**:
- ❌ "Pickup country is required" if empty
- ❌ "Delivery country is required" if empty
- ❌ "Weight is required" validation
- ❌ "Pickup address is required" validation
- ❌ "Delivery address is required" validation
- ❌ Error alert: "Failed to create package: [server message]"
- ❌ Can retry after error

---

### Test Case 6.2: Edit Package Request
**Objective**: Modify existing package details

**Prerequisites**: Shipper has package in "Open" status

**Steps**:
1. Navigate to Packages tab
2. Find "Open" package
3. Tap package card → Details
4. Tap 3-dot menu → "Edit Package"
5. Modify any fields
6. Tap "Save Changes"

**Expected Results**:
- ✅ Edit sheet appears with pre-filled data
- ✅ All fields editable
- ✅ Country fields remain editable
- ✅ Validation works
- ✅ Success message appears
- ✅ Updates reflect immediately

**Error Cases**:
- ❌ Error alert with server message
- ❌ Cannot edit matched/delivered packages

---

### Test Case 6.3: Cancel Package Request
**Objective**: Cancel an open package request

**Prerequisites**: Package in "Open" status

**Steps**:
1. Navigate to Packages tab
2. Find package to cancel
3. Tap 3-dot menu → "Cancel Request"
4. Confirm cancellation

**Expected Results**:
- ✅ Confirmation alert appears
- ✅ Warning about irreversible action
- ✅ Status changes to "Cancelled"
- ✅ Package moves to cancelled section

**Error Cases**:
- ❌ Error alert: "Failed to cancel: [server message]"
- ❌ Cannot cancel delivered packages

---

### Test Case 6.4: Browse Compatible Trips
**Objective**: Find carriers for package delivery

**Prerequisites**: Package request created

**Steps**:
1. Navigate to Packages tab
2. Tap on open package
3. Tap "Find Trips" or "Browse Compatible Trips"
4. View list of matching carriers

**Expected Results**:
- ✅ Trip list appears
- ✅ Each trip shows:
  - Carrier name & rating
  - Vehicle type
  - Available capacity
  - Price per kg
  - Route (origin → destination)
  - Departure date
  - "Book Trip" button
- ✅ Trips filtered by route compatibility
- ✅ Can tap "View Details" for more info

---

### Test Case 6.5: Shipper Home Browse & Filters
**Objective**: Validate "Find Carriers" home experience pulls trips and syncs filters

**Prerequisites**: Shipper role active, backend seeded with at least one available trip

**Steps**:
1. Launch app as shipper and land on Home tab (page 1 of 2)
2. Verify trips load automatically on first appearance (watch console/logs for `loadAvailableTrips()` if debugging)
3. Tap a popular route chip (e.g., "Manila, PH")
4. Confirm search field updates with generated summary (e.g., `Manila, PH`)
5. Open filter sheet, adjust a filter (Transportation Method → Air Cargo), apply
6. Verify search text refreshes to include new filter summary
7. Tap the clear (`x`) button in search input
8. Confirm all filters reset and default trip list returns when available
9. Swipe to second page and back, ensure trips reload when returning to page 1 if list was empty

**Expected Results**:
- ✅ Trips auto-load on first visit; empty state shows only if API returns zero trips
- ✅ Popular route selection populates destination filter and search summary without clearing manual text
- ✅ Applying filters updates search text only once; no repeated filtering or flicker
- ✅ Clearing search via `x` removes active filters and resets list
- ✅ Returning to page 1 re-triggers load when previously empty and not loading
- ✅ Filter sheet remains in sync with search summary (filters → search only, not vice versa)

**Error Cases**:
- ❌ Trips fail to load when API returns data (investigate network/service)
- ❌ Search text continues to append duplicate summaries after applying filters
- ❌ Clearing search leaves stale filters active in sheet
- ❌ Popular route tap does not set destination filter

---

### Test Case 6.5: Book a Trip
**Objective**: Request delivery with a carrier

**Prerequisites**: Found compatible trip

**Steps**:
1. From compatible trips list
2. Tap "Book Trip" on desired carrier
3. Review booking details
4. Confirm booking

**Expected Results**:
- ✅ Booking confirmation sheet appears
- ✅ Shows:
  - Trip details
  - Package details
  - Estimated cost
  - Pickup/delivery dates
- ✅ Tap "Confirm Booking"
- ✅ Success message appears
- ✅ Booking status "Pending"
- ✅ Carrier notified

**Error Cases**:
- ❌ "Insufficient capacity" error
- ❌ Error alert with server message

---

### Test Case 6.6: View My Deliveries
**Objective**: Monitor active shipments

**Prerequisites**: Shipper has bookings

**Steps**:
1. Navigate to "Deliveries" tab
2. View list of active deliveries
3. Tap on a delivery card

**Expected Results**:
- ✅ Deliveries list shows all statuses
- ✅ Each card shows:
  - Carrier name & rating
  - Package description
  - Status badge
  - Pickup/delivery locations
  - Dates
- ✅ Status color-coded
- ✅ Can tap "View Details"

---

### Test Case 6.7: Track Package
**Objective**: Monitor real-time package status

**Prerequisites**: Package in transit

**Steps**:
1. Navigate to Deliveries
2. Find in-transit delivery
3. Tap 3-dot menu → "Track Package"

**Expected Results**:
- ✅ Tracking view appears
- ✅ Shows current status
- ✅ Status timeline visible
- ✅ Carrier location (if available)
- ✅ Estimated delivery time
- ✅ Can refresh status

---

### Test Case 6.8: Generate Pickup Code (Shipper)
**Objective**: Create code for carrier to confirm pickup

**Prerequisites**: Booking confirmed, pickup scheduled

**Steps**:
1. Navigate to Deliveries
2. Find confirmed booking
3. Tap 3-dot menu → "Generate Pickup Code"
4. Code auto-generates
5. Share code with carrier

**Expected Results**:
- ✅ 6-digit code displays
- ✅ Expiration timer shows (15 minutes)
- ✅ Can copy to clipboard
- ✅ Can regenerate if expired

**Error Cases**:
- ❌ Error alert with server message

---

### Test Case 6.9: Confirm Delivery with Code
**Objective**: Verify package delivery using code

**Prerequisites**: Package delivered, code received

**Steps**:
1. Receive 6-digit delivery code from carrier
2. Navigate to delivery
3. Tap "Confirm Delivery Code"
4. Enter 6-digit code
5. Tap "Verify"

**Expected Results**:
- ✅ Code input screen appears
- ✅ 6 separate input fields
- ✅ Code validates successfully
- ✅ Status changes to "Delivered"
- ✅ Success message appears
- ✅ Payment processed

**Error Cases**:
- ❌ "Invalid code" error shown inline
- ❌ "Expired code" error
- ❌ Can contact carrier if issue

---

### Test Case 6.10: Accept Match Offer
**Objective**: Accept carrier's offer for package

**Prerequisites**: Carrier sent match request

**Steps**:
1. Navigate to Deliveries
2. Find match with "Pending" status
3. Tap 3-dot menu → "Accept Match"
4. Confirm acceptance

**Expected Results**:
- ✅ Confirmation alert appears
- ✅ Status changes to "Confirmed"
- ✅ Carrier notified
- ✅ Success message appears

**Error Cases**:
- ❌ Error alert with server message

---

### Test Case 6.11: Decline Match Offer
**Objective**: Reject carrier's match offer

**Prerequisites**: Carrier sent match request

**Steps**:
1. Navigate to Deliveries
2. Find match with "Pending" status
3. Tap 3-dot menu → "Decline Match"
4. Confirm decline

**Expected Results**:
- ✅ Confirmation alert appears
- ✅ Match removed from list
- ✅ Carrier notified

**Error Cases**:
- ❌ Error alert with server message

---

### Test Case 6.12: Cancel Delivery
**Objective**: Cancel confirmed delivery booking

**Prerequisites**: Active delivery booking

**Steps**:
1. Navigate to Deliveries
2. Find active delivery
3. Tap 3-dot menu → "Cancel Delivery"
4. Confirm cancellation

**Expected Results**:
- ✅ Confirmation alert appears
- ✅ Warning about cancellation policy
- ✅ Status changes to "Cancelled"
- ✅ Carrier notified
- ✅ Refund processed (if applicable)

**Error Cases**:
- ❌ Error alert with server message
- ❌ "Cannot cancel" if already picked up

---

### Test Case 6.13: Rate Carrier After Delivery
**Objective**: Provide feedback for carrier

**Prerequisites**: Delivery completed

**Steps**:
1. Navigate to completed delivery
2. Tap 3-dot menu → "Rate Carrier"
3. Select star rating (1-5)
4. Write review text
5. Select review categories
6. Tap "Submit Rating"

**Expected Results**:
- ✅ Rating sheet appears
- ✅ Shows carrier details
- ✅ Star rating selectable
- ✅ Review categories available
- ✅ Success message appears
- ✅ Rating recorded

**Error Cases**:
- ❌ Error alert: "Failed to submit rating: [server message]"

---

### Test Case 6.14: View Shipper Analytics
**Objective**: Monitor shipping activity and costs

**Prerequisites**: Shipper with delivery history

**Steps**:
1. Navigate to Analytics tab (Shipper mode)
2. Review dashboard:
   - Total Packages Sent
   - Total Spent
   - Active Deliveries
   - Average Delivery Time
   - Success Rate
3. Select time period
4. View spending chart

**Expected Results**:
- ✅ All metrics display correctly
- ✅ Spending formatted as CAD $X.XX
- ✅ Charts render properly
- ✅ Time period filter works

---

## 🔄 Matching & Booking

### Test Case 7.1: Automatic Trip Matching
**Objective**: System finds compatible trips for packages

**Prerequisites**: Package request created

**Steps**:
1. Create package request
2. Wait for matching algorithm
3. Check "Compatible Trips" section

**Expected Results**:
- ✅ System auto-suggests compatible trips
- ✅ Trips match route (pickup/delivery cities)
- ✅ Trips have sufficient capacity
- ✅ Trips within date range
- ✅ Sorted by relevance/price

---

### Test Case 7.2: Manual Trip Search
**Objective**: Search for specific trips

**Prerequisites**: Shipper with package

**Steps**:
1. Navigate to Browse Trips
2. Apply filters:
   - Origin city/country
   - Destination city/country
   - Date range
   - Price range
   - Vehicle type
3. Tap "Search"

**Expected Results**:
- ✅ Filter sheet appears
- ✅ All filter options work
- ✅ Results match filters
- ✅ Can clear filters
- ✅ Can save filter preferences

---

### Test Case 7.3: Booking Flow (End-to-End)
**Objective**: Complete booking from search to confirmation

**Steps**:
1. Shipper creates package
2. Browses compatible trips
3. Selects carrier
4. Reviews booking details
5. Confirms booking
6. Carrier receives notification
7. Carrier accepts booking
8. Both parties notified
9. Status updates to "Confirmed"

**Expected Results**:
- ✅ Each step completes successfully
- ✅ Notifications sent at each stage
- ✅ Status updates tracked
- ✅ All parties informed

---

### Test Case 7.4: Auto-Confirm Workflow (Carrier Accepts Shipper Request)
**Objective**: Verify automatic confirmation when both parties have accepted

**Prerequisites**: Shipper has sent a request to carrier

**Steps**:
1. As carrier, navigate to Active Bookings
2. Find booking with "Pending Request" status
3. Tap "Accept Booking"
4. Wait for API response

**Expected Results**:
- ✅ If `auto_confirmed == true`: Status immediately becomes "Confirmed"
- ✅ If `auto_confirmed == false` AND `match_status == "shipper_accepted"`: App automatically calls confirm → Status becomes "Confirmed"
- ✅ If `auto_confirmed == false` AND `match_status == "carrier_accepted"`: App skips confirm, shows "Awaiting Carrier" status
- ✅ No 409 "Can only confirm after shipper acceptance" errors
- ✅ UI updates immediately to reflect correct status
- ✅ Pickup code button appears when status is "Confirmed"

**Error Cases**:
- ❌ 409 error when calling confirm too early
- ❌ UI shows wrong status
- ❌ Pickup code available before confirmation

---

### Test Case 7.5: Auto-Confirm Workflow (Shipper Accepts Carrier Request)
**Objective**: Verify shippers never call confirm endpoint

**Prerequisites**: Carrier has sent a request to shipper

**Steps**:
1. As shipper, navigate to Deliveries
2. Find match with "Pending Acceptance" status
3. Tap "Accept"
4. Wait for API response

**Expected Results**:
- ✅ If `auto_confirmed == true`: Status becomes "Confirmed" immediately
- ✅ If `auto_confirmed == false`: App skips confirm, returns match with current status
- ✅ Shippers NEVER call confirm endpoint (only carriers do)
- ✅ UI shows appropriate status
- ✅ No errors

**Error Cases**:
- ❌ Error if shipper tries to call confirm

---

### Test Case 7.6: Auto-Confirm Workflow (Carrier Accepts Package to Create Match)
**Objective**: Verify carrier creating a match from package acceptance

**Prerequisites**: Package request exists

**Steps**:
1. As carrier, find a package request
2. Tap "Accept Package"
3. Wait for API response

**Expected Results**:
- ✅ Match is created with status "carrier_requested" (typical case)
- ✅ App skips confirm call for "carrier_requested" status
- ✅ If rare edge case of "carrier_accepted": App calls confirm
- ✅ UI shows correct status
- ✅ No premature confirm calls

**Error Cases**:
- ❌ Confirm called too early
- ❌ Wrong status displayed

---

### Test Case 7.7: Counter-Offer — Carrier Sends, Sender Receives
**Objective**: Verify carrier can send a counter-offer and sender sees it with banner

**Prerequisites**: Two test accounts (Carrier + Sender) with an existing match

**Steps**:

As the Carrier:
1. Switch to **Carrier** role (Profile tab → role switcher)
2. Tap the **Matches** tab (second tab, delivery icon)
3. Find the booking card for the existing match with the Sender
4. Tap the **action menu** (three dots) on the booking card
5. Select **"Counter Offer"**
6. Enter a new price and tap **Submit**

As the Sender:
1. Switch to **Sender** role (Profile tab → role switcher)
2. Check for **push notification** for the counter-offer
3. Tap the notification — should navigate to the match details screen
   - Alternative: **Matches** tab → find match with counter-offer indicator → tap to open
4. Verify **Counter-Offer Banner** at top of match details
5. Try **Accept** and **Decline** buttons

**Expected Results**:
- ✅ Counter-offer submits successfully with success message
- ✅ Sender receives push notification with counter-offer details
- ✅ Tapping notification navigates to correct match detail screen
- ✅ Counter-Offer Banner shows: new proposed price, original price, price difference
- ✅ Accept and Decline buttons on banner work as expected
- ✅ Navigating manually via Matches tab also shows counter-offer context

**Error Cases**:
- ❌ Notification missing — banner should still appear using match's saved price info as fallback
- ❌ Counter-offer limit reached — "Counter Offer" option should be hidden/disabled
- ❌ Role switcher doesn't correctly change dashboard view

---

### Test Case 7.8: Counter-Offer — Sender Sends, Carrier Receives
**Objective**: Verify sender can send a counter-offer via decline flow and carrier sees it

**Prerequisites**: Two test accounts (Carrier + Sender) with an existing carrier offer

**Steps**:

As the Sender:
1. Switch to **Sender** role (Profile tab → role switcher)
2. Tap the **Matches** tab (second tab, delivery icon)
3. Open the match detail screen for an existing carrier offer
4. Tap **"Decline"** on the carrier's offer
5. A prompt appears asking to submit a counter-offer with own price
6. Enter your price and tap **Submit**

As the Carrier:
1. Switch to **Carrier** role (Profile tab → role switcher)
2. Check for **push notification** for the counter-offer
3. Tap the notification — should navigate to the match details screen
   - Alternative: **Matches** tab → find match with counter-offer indicator → tap to open
4. Verify **Counter-Offer Banner** on match/booking details screen
5. Try **Accept** and **Decline** buttons

**Expected Results**:
- ✅ Decline triggers counter-offer prompt
- ✅ Counter-offer submits successfully
- ✅ Carrier receives push notification with counter-offer details
- ✅ Tapping notification navigates to correct match detail screen
- ✅ Counter-Offer Banner shows: new proposed price, original price, price difference
- ✅ Accept and Decline buttons work as expected
- ✅ Manual navigation via Matches tab shows counter-offer context

**Error Cases**:
- ❌ Notification missing — banner should still appear using match's saved price info as fallback
- ❌ Counter-offer limit reached — prompt should not appear after decline
- ❌ Role switcher doesn't correctly change dashboard view

---

## 🚚 Delivery Management

### Test Case 8.1: Pickup Flow (Complete)
**Objective**: Test full pickup process

**Steps**:
1. Shipper generates pickup code
2. Carrier receives code
3. Carrier arrives at pickup location
4. Carrier enters code to confirm
5. Status updates to "Picked Up"
6. Both parties notified

**Expected Results**:
- ✅ Code generated successfully
- ✅ Code expires after 15 minutes
- ✅ Carrier can verify code
- ✅ Status updates immediately
- ✅ Notifications sent

**Error Cases**:
- ❌ "Expired code" handled gracefully
- ❌ "Invalid code" shows clear error
- ❌ Can regenerate code

---

### Test Case 8.2: In-Transit Tracking
**Objective**: Monitor package during transit

**Prerequisites**: Package picked up

**Steps**:
1. Shipper opens tracking view
2. Monitor status updates
3. Check estimated arrival
4. View carrier location (if enabled)

**Expected Results**:
- ✅ Real-time status visible
- ✅ Timeline shows progress
- ✅ Location updates (if permitted)
- ✅ ETA displayed
- ✅ Can refresh status

---

### Test Case 8.3: Delivery Flow (Complete)
**Objective**: Test full delivery process

**Steps**:
1. Carrier generates delivery code
2. Carrier arrives at delivery location
3. Shipper receives package
4. Shipper enters code to confirm
5. Status updates to "Delivered"
6. Payment processed
7. Rating prompts appear

**Expected Results**:
- ✅ Code generated successfully
- ✅ Shipper can verify delivery
- ✅ Status finalizes
- ✅ Payment completes
- ✅ Both can rate each other

**Error Cases**:
- ❌ Code expiration handled
- ❌ Payment failures shown with alert

---

## 💳 Payment System

### Test Case 9.1: View Payment Methods
**Objective**: Manage saved payment options

**Prerequisites**: User logged in

**Steps**:
1. Navigate to Profile → Payment Methods
2. View list of saved cards/methods

**Expected Results**:
- ✅ Payment methods list appears
- ✅ Shows card last 4 digits
- ✅ Shows card brand (Visa/MC/Amex)
- ✅ Shows expiration date
- ✅ Default method marked

---

### Test Case 9.2: Add Payment Method
**Objective**: Add new credit/debit card

**Prerequisites**: User logged in

**Steps**:
1. Navigate to Payment Methods
2. Tap "Add Payment Method"
3. Enter card details:
   - Card number
   - Expiry date
   - CVV
   - Cardholder name
   - Billing address
4. Tap "Save Card"

**Expected Results**:
- ✅ Secure payment form appears
- ✅ Card validation works
- ✅ Luhn check for card number
- ✅ Expiry date validated (future)
- ✅ CVV format checked
- ✅ Success message appears
- ✅ Card added to list

**Error Cases**:
- ❌ "Invalid card number" validation
- ❌ "Card expired" error
- ❌ Error alert: "Failed to add card: [message]"

---

### Test Case 9.3: Set Default Payment Method
**Objective**: Change primary payment option

**Prerequisites**: Multiple payment methods saved

**Steps**:
1. Navigate to Payment Methods
2. Tap on a card
3. Tap "Set as Default"

**Expected Results**:
- ✅ Default badge moves to selected card
- ✅ Success message appears
- ✅ Future bookings use this card

---

### Test Case 9.4: Remove Payment Method
**Objective**: Delete saved payment option

**Prerequisites**: Payment method saved

**Steps**:
1. Navigate to Payment Methods
2. Swipe left on card OR tap card → "Delete"
3. Confirm deletion

**Expected Results**:
- ✅ Confirmation alert appears
- ✅ Card removed from list
- ✅ Cannot delete default if it's the only card

**Error Cases**:
- ❌ Error alert if deletion fails

---

### Test Case 9.5: Process Payment (Booking)
**Objective**: Complete payment for booking

**Prerequisites**: Booking confirmed, delivery completed

**Steps**:
1. Delivery confirmed by both parties
2. System auto-processes payment
3. Check transaction history

**Expected Results**:
- ✅ Payment processed automatically
- ✅ Shipper charged agreed amount
- ✅ Carrier receives earnings (minus fees)
- ✅ Receipt generated
- ✅ Email confirmation sent
- ✅ Transaction appears in history

**Error Cases**:
- ❌ "Payment failed" alert with reason
- ❌ Can retry payment
- ❌ Alternative payment option offered

---

### Test Case 9.6: View Transaction History
**Objective**: Review payment records

**Prerequisites**: User has transaction history

**Steps**:
1. Navigate to Profile → Transaction History
2. View list of transactions
3. Tap on a transaction for details

**Expected Results**:
- ✅ All transactions listed
- ✅ Shows date, amount, status
- ✅ Carrier: Earnings (green +)
- ✅ Shipper: Payments (red -)
- ✅ Can filter by date range
- ✅ Can search transactions
- ✅ Details show full breakdown

---

### Test Case 9.7: Process Refund
**Objective**: Handle cancellation refund

**Prerequisites**: Booking cancelled before pickup

**Steps**:
1. Cancel booking
2. Refund auto-processes
3. Check transaction history

**Expected Results**:
- ✅ Refund issued automatically
- ✅ Refund appears in history
- ✅ Amount returned to payment method
- ✅ Refund notification sent
- ✅ Typically 5-10 business days

**Error Cases**:
- ❌ Refund failure alert shown
- ❌ Can contact support

---

## 💬 Chat & Communication

### Test Case 10.1: Open Chat with User
**Objective**: Initiate conversation

**Prerequisites**: Active booking between users

**Steps**:
1. Navigate to booking/delivery
2. Tap "Chat" or "Message" button
3. Chat screen opens

**Expected Results**:
- ✅ Chat interface appears
- ✅ Shows other user's name & avatar
- ✅ Previous messages loaded
- ✅ Message input field ready

---

### Test Case 10.2: Send Text Message
**Objective**: Send chat message

**Prerequisites**: Chat opened

**Steps**:
1. Type message in input field
2. Tap send button

**Expected Results**:
- ✅ Message appears in chat
- ✅ Sent timestamp shown
- ✅ Delivery status indicated
- ✅ Other user receives notification
- ✅ Message syncs across devices

**Error Cases**:
- ❌ Inline error shown if send fails
- ❌ "Network error" message
- ❌ Can retry sending
- ❌ Alert shows: "Failed to send message: [message]"

---

### Test Case 10.3: Receive Message
**Objective**: Get notified of new messages

**Prerequisites**: Other user sends message

**Steps**:
1. Wait for message from other party
2. Check notification
3. Open chat

**Expected Results**:
- ✅ Push notification received
- ✅ Badge count on tab
- ✅ Message appears in chat
- ✅ Unread indicator shown

---

### Test Case 10.4: Send Image/Photo
**Objective**: Share images in chat

**Prerequisites**: Chat opened

**Steps**:
1. Tap attachment button
2. Select "Photo"
3. Choose image from library
4. Tap send

**Expected Results**:
- ✅ Photo picker appears
- ✅ Can select image
- ✅ Upload progress shown
- ✅ Image appears in chat
- ✅ Image downloadable by recipient

**Error Cases**:
- ❌ "Upload failed" alert
- ❌ Can retry upload

---

### Test Case 10.5: View Chat History
**Objective**: Review past conversations

**Prerequisites**: Previous chat messages exist

**Steps**:
1. Navigate to Messages tab
2. View list of conversations
3. Tap on a conversation

**Expected Results**:
- ✅ Conversations list shows all chats
- ✅ Shows last message preview
- ✅ Shows unread count
- ✅ Sorted by most recent
- ✅ Chat history loads

---

## ⭐ Ratings & Reviews

### Test Case 11.1: Submit Rating
**Objective**: Rate other party after delivery

**Prerequisites**: Delivery completed

**Steps**:
1. Rating prompt appears automatically OR
2. Navigate to completed delivery
3. Tap "Rate [Carrier/Shipper]"
4. Select star rating (1-5)
5. Write review text (optional)
6. Select quick review tags:
   - Punctual
   - Professional
   - Careful handling
   - Good communication
   - Would recommend
7. Tap "Submit Rating"

**Expected Results**:
- ✅ Rating sheet appears
- ✅ Shows other party's current rating
- ✅ Stars are tappable
- ✅ Review text optional
- ✅ Tag selection works
- ✅ Success message appears
- ✅ Rating saved
- ✅ Other party's rating updated

**Error Cases**:
- ❌ Error alert: "Failed to submit rating: [server message]"
- ❌ Can retry submission
- ❌ Cannot rate twice (disabled)

---

### Test Case 11.2: Edit Rating
**Objective**: Modify previously submitted rating

**Prerequisites**: Rating already submitted

**Steps**:
1. Navigate to completed delivery
2. View existing rating
3. Tap "Edit Rating"
4. Modify stars/review/tags
5. Tap "Update Rating"

**Expected Results**:
- ✅ Edit sheet shows current rating
- ✅ Can modify all fields
- ✅ Success message appears
- ✅ Rating updates

**Error Cases**:
- ❌ Error alert with server message

---

### Test Case 11.3: View User Reviews
**Objective**: See ratings received from others

**Prerequisites**: User has received ratings

**Steps**:
1. Navigate to Profile
2. Tap on rating display
3. View all reviews

**Expected Results**:
- ✅ Reviews list appears
- ✅ Shows all ratings received
- ✅ Each review shows:
  - Rater name
  - Star rating
  - Review text
  - Date
  - Tags
- ✅ Average rating displayed
- ✅ Total count shown

---

### Test Case 11.4: View Other User's Rating
**Objective**: Check rating before booking

**Prerequisites**: Viewing carrier/shipper profile

**Steps**:
1. From trip/package details
2. Tap on user name/avatar
3. View their profile & rating

**Expected Results**:
- ✅ User profile appears
- ✅ Shows average rating
- ✅ Total ratings count
- ✅ Recent reviews visible
- ✅ Rating breakdown (5★, 4★, etc.)

---

## 📊 Analytics Dashboard

### Test Case 12.1: View Carrier Analytics
**Objective**: Monitor carrier performance metrics

**Prerequisites**: Active carrier with history

**Steps**:
1. Navigate to Analytics tab
2. Select Carrier role
3. Review all sections:
   - Overview Cards (Earnings, Trips, Rating)
   - Period Selector (Week/Month/Year)
   - Earnings Chart
   - Performance Metrics
   - Trip Statistics
   - Top Routes

**Expected Results**:
- ✅ All cards display correct data
- ✅ Currency formatted as CAD $
- ✅ Charts render properly
- ✅ Period filter updates data
- ✅ Percentages calculated correctly
- ✅ Ratings show decimal precision

---

### Test Case 12.2: View Shipper Analytics
**Objective**: Monitor shipping activity

**Prerequisites**: Shipper with delivery history

**Steps**:
1. Navigate to Analytics tab
2. Select Shipper role
3. Review sections:
   - Spending Overview
   - Packages Sent
   - Active Deliveries
   - Success Rate
   - Spending Chart
   - Package Type Distribution

**Expected Results**:
- ✅ All metrics display correctly
- ✅ Spending trends visible
- ✅ Package breakdown shown
- ✅ Charts update with period

---

### Test Case 12.3: Export Analytics Report
**Objective**: Download performance data

**Prerequisites**: User has analytics data

**Steps**:
1. Navigate to Analytics
2. Tap "Export Report"
3. Select date range
4. Choose format (PDF/CSV)
5. Tap "Download"

**Expected Results**:
- ✅ Export options appear
- ✅ Date range selectable
- ✅ Report generates
- ✅ File downloads
- ✅ Can share report

**Error Cases**:
- ❌ "Export failed" alert
- ❌ Can retry download

---

## 📜 History & Records

### Test Case 13.1: View Package History
**Objective**: Review all past package requests

**Prerequisites**: User has package history

**Steps**:
1. Navigate to History tab
2. Select "Package History"
3. View list of all packages

**Expected Results**:
- ✅ All packages listed
- ✅ Shows status badges
- ✅ Sorted by date (newest first)
- ✅ Can filter by status
- ✅ Can search by keyword
- ✅ Tap to view details

**Error Cases**:
- ❌ Inline error view if load fails
- ❌ "Pull to refresh" to retry

---

### Test Case 13.2: View Delivery History
**Objective**: Review all completed deliveries

**Prerequisites**: User has delivery history

**Steps**:
1. Navigate to History tab
2. Select "Delivery History"
3. View list of deliveries

**Expected Results**:
- ✅ All deliveries listed
- ✅ Shows completion date
- ✅ Shows final status
- ✅ Can tap for full details
- ✅ Receipt available
- ✅ Can re-rate if needed

**Error Cases**:
- ❌ Error view shown if load fails
- ❌ Retry button available

---

### Test Case 13.3: Search History
**Objective**: Find specific past records

**Prerequisites**: User has history

**Steps**:
1. Navigate to History
2. Tap search icon
3. Enter search term
4. View filtered results

**Expected Results**:
- ✅ Search field appears
- ✅ Results update as typing
- ✅ Searches:
  - Package description
  - Locations
  - Dates
  - User names
- ✅ Can clear search

---

### Test Case 13.4: Filter History by Date
**Objective**: View records from specific timeframe

**Prerequisites**: User has history

**Steps**:
1. Navigate to History
2. Tap filter icon
3. Select date range
4. Apply filter

**Expected Results**:
- ✅ Date range picker appears
- ✅ Can select start/end dates
- ✅ Results filtered correctly
- ✅ Can clear filter

---

## 🔔 Notifications

### Test Case 14.1: Enable Push Notifications
**Objective**: Grant notification permissions

**Prerequisites**: First app launch or permissions reset

**Steps**:
1. App requests notification permission
2. Tap "Allow"

**Expected Results**:
- ✅ Permission dialog appears
- ✅ User can grant permission
- ✅ Settings updated
- ✅ Device token registered

---

### Test Case 14.2: Receive Booking Notification
**Objective**: Get notified of new booking

**Prerequisites**: Push notifications enabled

**Steps**:
1. Other user creates booking
2. Check notification

**Expected Results**:
- ✅ Push notification received
- ✅ Shows booking details
- ✅ Tapping opens booking
- ✅ Badge count updates

---

### Test Case 14.3: Receive Status Update Notification
**Objective**: Get notified of delivery status changes

**Prerequisites**: Active delivery

**Steps**:
1. Carrier/shipper updates status
2. Check notification

**Expected Results**:
- ✅ Push notification received
- ✅ Shows new status
- ✅ Tapping opens delivery
- ✅ In-app notification also shown

---

## 🐛 Error Handling & Edge Cases

### Test Case 15.1: Network Disconnection
**Objective**: Handle offline scenarios gracefully

**Steps**:
1. Enable airplane mode
2. Attempt various actions
3. Observe error handling

**Expected Results**:
- ❌ Clear "Network error" messages shown
- ❌ Offline indicator displayed
- ❌ Can retry when back online
- ❌ Queued actions resume automatically

---

### Test Case 15.2: Session Expiration
**Objective**: Handle expired authentication token

**Steps**:
1. Wait for token to expire OR force token invalidation
2. Attempt API action

**Expected Results**:
- ❌ Session expired message
- ❌ Automatically redirects to login
- ❌ Can re-authenticate
- ❌ Returns to previous screen after login

---

### Test Case 15.3: Concurrent Booking Conflict
**Objective**: Handle race conditions

**Steps**:
1. Two shippers book same trip simultaneously
2. Check conflict resolution

**Expected Results**:
- ❌ Second booking fails gracefully
- ❌ "Insufficient capacity" error shown
- ❌ Alternative trips suggested

---

### Test Case 15.4: Payment Card Declined
**Objective**: Handle payment failures

**Steps**:
1. Use card that will be declined
2. Attempt booking payment

**Expected Results**:
- ❌ "Payment declined" alert shown
- ❌ Shows reason (insufficient funds, etc.)
- ❌ Can update payment method
- ❌ Can retry payment

---

### Test Case 15.5: Invalid QR/Verification Code
**Objective**: Handle code validation errors

**Steps**:
1. Enter incorrect 6-digit code
2. Try expired code
3. Try already-used code

**Expected Results**:
- ❌ "Invalid code" error shown inline
- ❌ "Expired code" message clear
- ❌ "Code already used" error
- ❌ Can request new code

---

## 📱 Cross-Device & Data Sync

### Test Case 16.1: Multi-Device Login
**Objective**: Verify account works across devices

**Steps**:
1. Login on Device A
2. Perform actions
3. Login on Device B
4. Verify data synced

**Expected Results**:
- ✅ Data appears on Device B
- ✅ Real-time updates sync
- ✅ Session maintained on both

---

### Test Case 16.2: Data Refresh (Pull-to-Refresh)
**Objective**: Manually sync latest data

**Steps**:
1. On any list view
2. Pull down to refresh
3. Wait for data reload

**Expected Results**:
- ✅ Refresh indicator appears
- ✅ Data reloads from server
- ✅ Updates appear
- ✅ Indicator dismisses

---

## 🎯 Performance Testing

### Test Case 17.1: App Launch Time
**Objective**: Measure cold start performance

**Steps**:
1. Force quit app
2. Launch app
3. Time until UI ready

**Expected Results**:
- ✅ Launches in < 3 seconds
- ✅ Splash screen appears briefly
- ✅ UI responsive immediately

---

### Test Case 17.2: Large List Scrolling
**Objective**: Test performance with many items

**Prerequisites**: Account with 50+ packages/trips

**Steps**:
1. Navigate to list view
2. Scroll rapidly
3. Observe performance

**Expected Results**:
- ✅ Smooth 60fps scrolling
- ✅ No stuttering or lag
- ✅ Images load progressively
- ✅ No memory issues

---

### Test Case 17.3: Background App Return
**Objective**: Test app state restoration

**Steps**:
1. Open app
2. Navigate to specific screen
3. Background app for 30+ minutes
4. Return to app

**Expected Results**:
- ✅ Returns to same screen
- ✅ Data still valid
- ✅ No crashes
- ✅ Refreshes stale data

---

## 📝 Testing Checklist Summary

### Critical Path Tests (Must Pass)
- [ ] Authentication (Google/Facebook/Apple)
- [ ] Package Creation with Country Fields
- [ ] Trip Creation
- [ ] Booking Flow End-to-End
- [ ] Auto-Confirm Workflow (Carrier accepts shipper request)
- [ ] Auto-Confirm Workflow (Shipper accepts carrier request)
- [ ] Auto-Confirm Workflow (Carrier accepts package to create match)
- [ ] Counter-Offer: Carrier sends → Sender receives (Test 7.7)
- [ ] Counter-Offer: Sender sends → Carrier receives (Test 7.8)
- [ ] Counter-Offer Banner displays correct prices
- [ ] Counter-Offer notification navigation
- [ ] Pickup Code Verification
- [ ] Delivery Code Verification
- [ ] Payment Processing
- [ ] Rating Submission
- [ ] Error Alerts for All API Failures

### High Priority Tests
- [ ] Profile Management
- [ ] Phone Verification
- [ ] Role Switching
- [ ] Chat Messaging
- [ ] Analytics Dashboard
- [ ] History Views

### Medium Priority Tests
- [ ] Premium Verification
- [ ] Payment Methods Management
- [ ] Transaction History
- [ ] Notifications
- [ ] Multi-Device Sync

### Nice-to-Have Tests
- [ ] Onboarding Flow
- [ ] Performance Benchmarks
- [ ] Accessibility Testing
- [ ] Dark Mode Compatibility

---

## 🚨 Bug Reporting Template

When reporting bugs, please include:

```
**Bug Title**: [Short description]

**Priority**: Critical / High / Medium / Low

**Test Case**: [Reference test case number]

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Result**: 

**Actual Result**: 

**Screenshots**: [Attach if applicable]

**Device**: iPhone [model], iOS [version]

**App Version**: [version number]

**User Role**: Carrier / Shipper / Both

**Additional Notes**: 
```

---

## 📞 Support Contacts

- **Developer Team**: [email/slack]
- **Product Manager**: [contact]
- **QA Lead**: [contact]

---

**Last Updated**: February 19, 2026
**Document Version**: 1.2
**App Version**: TBD

**Recent Updates**:
- February 19, 2026: Added counter-offer flow test cases (Test 7.7, 7.8) with push notification and banner verification
- October 30, 2025: Added auto-confirm workflow test cases (Test 7.4, 7.5, 7.6)

