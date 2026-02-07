# Favorites Testing Guide - UI Flow

## Overview

This guide covers the Favorites feature that allows **Shippers** to save their preferred **Carriers** for easy rebooking. Shippers can quickly send delivery requests to their favorite carriers.

---

## How Favorites Work

**Who Can Use Favorites:**
- **Shippers** can add carriers to their favorites list
- **Carriers** cannot favorite shippers (one-way relationship)

**Benefits:**
- Quickly rebook carriers you've worked with before
- Send direct requests without browsing trips
- Build trusted relationships with reliable carriers

---

## Favorites Flow Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           FAVORITES FLOW                                            │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  ADD TO FAVORITES                          USE FAVORITES                           │
│  ────────────────                          ─────────────                           │
│                                                                                     │
│  1. Complete delivery with carrier         1. Go to Profile                        │
│       │                                         │                                   │
│       ▼                                         ▼                                   │
│  2. View Carrier Profile                   2. Tap "Favorite Carriers"              │
│       │                                         │                                   │
│       ▼                                         ▼                                   │
│  3. Tap Star Button (⭐)                   3. See your favorites list              │
│       │                                         │                                   │
│       ▼                                         ▼                                   │
│  4. Added!                                 4. Tap carrier card                     │
│                                                 │                                   │
│                                                 ▼                                   │
│                                            5. "Send Request" sheet                 │
│                                                 │                                   │
│                                                 ▼                                   │
│                                            6. Select package & send                │
│                                                                                     │
│  MANAGE FAVORITES                                                                  │
│  ────────────────                                                                  │
│                                                                                     │
│  • Swipe left on card → Remove                                                     │
│  • Long press → Context menu → Remove                                              │
│  • Sort: Recent / Most Used / Highest Rated                                        │
│  • Filter: Has Upcoming Trips                                                      │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Part 1: Adding a Carrier to Favorites

### Where to Add Favorites

Shippers can add carriers to favorites from **any carrier profile view**:

| Location | How to Access |
|----------|---------------|
| After Completed Delivery | Matches Tab → Completed Booking → Tap Carrier Name |
| During Active Booking | Matches Tab → Active Booking → Tap Carrier Name |
| From Trip Details | Home Tab → Tap Trip → Tap Carrier Name |
| From Chat | Messages Tab → Chat → Tap Carrier Name |

---

### Flow A: Add Favorite After Completed Delivery (Most Common)

```
Matches Tab (Shipper Mode)
    └── Find completed delivery
        └── Tap booking card
            └── Booking Details Screen
                └── Tap carrier name or avatar
                    └── Carrier Profile Popover opens
                        ├── See carrier info and rating
                        ├── See star icon (☆) in top left
                        └── Tap star icon
                            └── Star fills (⭐)
                                └── "Added to favorites!" feedback
                                    └── Carrier now in your favorites list
```

---

### Flow B: Add Favorite From Trip Details

```
Home Tab (Shipper Mode)
    └── Browse "Available Trips" section
        └── Tap on a trip card
            └── Trip Details Screen
                └── See carrier information section
                    └── Tap carrier name or avatar
                        └── Carrier Profile Popover opens
                            └── Tap star icon (☆)
                                └── Star fills (⭐)
                                    └── Carrier added to favorites
```

---

### Flow C: Add Favorite From Chat

```
Messages Tab
    └── Tap on conversation with carrier
        └── Chat Screen
            └── Tap carrier name/avatar at top
                └── Carrier Profile Popover opens
                    └── Tap star icon (☆)
                        └── Star fills (⭐)
                            └── Carrier added to favorites
```

---

## Part 2: Viewing Your Favorites List

### Flow D: Access Favorites List

```
Profile Tab
    └── Scroll to "My Activity" section
        └── Tap "Favorite Carriers"
            └── Favorites List Screen
                ├── Header: "My Favorites (X of 20 carriers)"
                ├── List of favorite carrier cards
                │   ├── Carrier avatar and name
                │   ├── Rating and reviews count
                │   ├── Trip info (if upcoming)
                │   └── "Send Request" button
                ├── Sort/Filter options (top right)
                └── Empty state (if no favorites)
```

---

### Favorites List Features

**Each Favorite Card Shows:**
- Carrier profile picture
- Carrier name
- Star rating (e.g., "⭐ 4.8")
- Number of reviews
- Upcoming trip indicator (if any)
- "Send Request" button

**Sort Options (top right menu):**
- Recent (most recently added)
- Most Used (carriers you've booked most)
- Highest Rated (by star rating)

**Filter Options:**
- Has Upcoming Trips (only show carriers with active trips)

---

## Part 3: Sending Request to Favorite

### Flow E: Send Request to Favorite Carrier

```
Favorites List Screen
    └── Find carrier you want to book
        └── Tap "Send Request" button
            └── Send Request Sheet opens
                ├── Carrier info shown at top
                ├── Select Package dropdown
                │   └── Choose from your open packages
                ├── Proposed Price field
                ├── Message field (optional)
                └── Tap "Send Request"
                    └── Processing...
                        └── "Request sent to [Carrier Name]!"
                            └── Carrier receives notification
```

---

## Part 4: Removing from Favorites

### Flow F: Remove via Swipe

```
Favorites List Screen
    └── Find carrier to remove
        └── Swipe LEFT on carrier card
            └── "Remove" button appears (red)
                └── Tap "Remove"
                    └── Confirmation dialog:
                        "Remove [Name] from favorites?"
                        └── Tap "Remove"
                            └── Carrier removed from list
```

---

### Flow G: Remove via Context Menu

```
Favorites List Screen
    └── Find carrier to remove
        └── Long press on carrier card
            └── Context menu appears
                └── Tap "Remove from Favorites"
                    └── Confirmation dialog
                        └── Tap "Remove"
                            └── Carrier removed
```

---

### Flow H: Remove via Star Toggle

```
Carrier Profile Popover (favorited carrier)
    └── See filled star icon (⭐) in top left
        └── Tap star icon
            └── Star unfills (☆)
                └── Carrier removed from favorites
```

---

## Part 5: Empty State

### When No Favorites Yet

```
Favorites List Screen (empty)
    └── Shows empty state:
        ┌─────────────────────────────────────┐
        │        ☆ (large star icon)          │
        │                                     │
        │    "No Favorite Carriers Yet"       │
        │                                     │
        │  "Favorite carriers you've worked   │
        │   with to easily book them again."  │
        │                                     │
        │    To add a favorite:               │
        │    1. Complete a delivery           │
        │    2. Tap "Add to Favorites"        │
        │    3. Send direct requests!         │
        └─────────────────────────────────────┘
```

---

## Part 6: Test Scenarios

### Test 1: Add Carrier to Favorites

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Matches Tab | Find completed delivery | Card visible |
| 2 | Booking Details | Tap carrier name | Profile popover opens |
| 3 | Profile Popover | Check top left | Empty star (☆) visible |
| 4 | Profile Popover | Tap star | Star fills (⭐) |
| 5 | Profile Popover | Close popover | Returns to booking |
| 6 | Profile Tab | Tap "Favorite Carriers" | Favorites list opens |
| 7 | Favorites List | Check list | Carrier appears in list |

---

### Test 2: Remove Carrier from Favorites (Swipe)

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Favorites List | Find carrier | Card visible |
| 2 | Carrier Card | Swipe left | "Remove" button appears |
| 3 | Remove Button | Tap | Confirmation dialog shows |
| 4 | Dialog | Tap "Remove" | Carrier removed |
| 5 | Favorites List | Check list | Carrier no longer in list |

---

### Test 3: Remove via Star Toggle

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Favorites List | Tap carrier | Could open request or profile |
| 2 | Any Screen | Open favorited carrier profile | Profile shows |
| 3 | Profile Popover | Check star | Filled star (⭐) |
| 4 | Profile Popover | Tap star | Star unfills (☆) |
| 5 | Favorites List | Return and check | Carrier removed |

---

### Test 4: Send Request to Favorite

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Favorites List | Find carrier | Card visible |
| 2 | Carrier Card | Tap "Send Request" | Request sheet opens |
| 3 | Request Sheet | See carrier info | Name and rating shown |
| 4 | Request Sheet | Tap package dropdown | Your packages listed |
| 5 | Request Sheet | Select a package | Package selected |
| 6 | Request Sheet | Enter price | Price entered |
| 7 | Request Sheet | Tap "Send Request" | Processing shown |
| 8 | Request Sheet | Wait | Success message |
| 9 | Carrier | Check (other device) | Receives notification |

---

### Test 5: Sort Favorites

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Favorites List | Tap filter icon (top right) | Menu opens |
| 2 | Menu | Select "Recent" | List sorted by recently added |
| 3 | Menu | Select "Most Used" | List sorted by booking count |
| 4 | Menu | Select "Highest Rated" | List sorted by rating |

---

### Test 6: Filter by Upcoming Trips

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Favorites List | Tap filter icon | Menu opens |
| 2 | Menu | Toggle "Has Upcoming Trips" ON | Filter applied |
| 3 | Favorites List | Check list | Only carriers with trips shown |
| 4 | Menu | Toggle OFF | All favorites shown |

---

### Test 7: Favorites Limit

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Favorites List | Check header | Shows "X of 20 carriers" |
| 2 | Near Limit | Add more favorites | Count increases |
| 3 | At Limit (20) | Try to add another | Error or blocked |

---

### Test 8: Empty State

| Step | Screen | Action | Expected Result |
|------|--------|--------|-----------------|
| 1 | Favorites List | Remove all favorites | List becomes empty |
| 2 | Favorites List | Check display | Empty state shown |
| 3 | Empty State | Read instructions | Steps 1-2-3 visible |

---

## Part 7: Quick Navigation Reference

| Action | Path |
|--------|------|
| View Favorites | Profile Tab → Favorite Carriers |
| Add Favorite | Any Carrier Profile → Tap ☆ Star |
| Remove Favorite (Swipe) | Favorites List → Swipe Left → Remove |
| Remove Favorite (Menu) | Favorites List → Long Press → Remove |
| Remove Favorite (Toggle) | Carrier Profile → Tap ⭐ Star |
| Send Request | Favorites List → Tap "Send Request" |
| Sort Favorites | Favorites List → Filter Icon → Sort Option |
| Filter Favorites | Favorites List → Filter Icon → Toggle Filter |

---

## Part 8: Visual Reference

### Star Button States

| State | Icon | Meaning |
|-------|------|---------|
| Not Favorited | ☆ (empty star) | Tap to add |
| Favorited | ⭐ (filled star, yellow) | Tap to remove |
| Loading | ○ (spinner) | Processing |

### Favorite Card Layout

```
┌─────────────────────────────────────────────────┐
│  [Avatar]  Carlos Carrier                       │
│            ⭐ 4.9 (85 reviews)                  │
│            🚗 Trip: Montreal → Toronto (Jan 25) │
│                                                 │
│            [ Send Request ]                     │
└─────────────────────────────────────────────────┘
```

---

## Part 9: What to Verify After Each Test

### After Adding to Favorites
- [ ] Star icon changes from ☆ to ⭐
- [ ] Carrier appears in Favorites List
- [ ] Favorites count increases in header
- [ ] Success feedback shown

### After Removing from Favorites
- [ ] Star icon changes from ⭐ to ☆
- [ ] Carrier removed from Favorites List
- [ ] Favorites count decreases in header
- [ ] Can still see carrier in Matches tab

### After Sorting/Filtering
- [ ] List order changes appropriately
- [ ] Sort selection persists
- [ ] Filter toggle works

---

## Part 10: Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Star not visible | Not viewing a carrier | Only appears on carrier profiles |
| Star not visible | Already in shipper mode | Check you're logged in as shipper |
| Can't add more | Limit reached (20) | Remove some to add new ones |
| Send Request fails | No open packages | Create a package first |
| Carrier not in list | Not yet synced | Pull down to refresh |
| Wrong sort order | Cache | Pull down to refresh |

---

## Part 11: Prerequisites for Testing

### Shipper Account Needs:
- [ ] Logged in as shipper
- [ ] At least one open package (for sending requests)
- [ ] Completed at least one delivery (to have carrier to favorite)

### Test Data Needed:
- [ ] Carrier account with profile
- [ ] Some carriers with upcoming trips (for filter test)
- [ ] Less than 20 favorites (for add test)

---

## Part 12: Related Documentation

- [QA Matching Testing Guide](./QA-Matching-Testing-Guide.md) - Booking flow testing
- [QA Payment Testing Guide](./QA-Payment-Testing-Guide.md) - Payment flow testing
- [QA Notifications Testing Guide](./QA-Notifications-Testing-Guide.md) - Notification testing
