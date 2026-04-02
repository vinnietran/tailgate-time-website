import{j as e,V as u,Z as p,a1 as h}from"./index-C7ETwOdp.js";const g=`# TailgateTime User Guide

## 1. What TailgateTime Does
TailgateTime helps you plan, discover, and run game-day tailgates.

You can use it as:
- An **attendee** (discover events, RSVP, buy tickets, check in).
- A **host** (create events, invite guests, sell tickets, manage check-in).

---

## 2. Getting Started

### Create or sign in to your account
From the sign-in screen, you can:
- Log in with email + password.
- Sign up with full name, phone number, email, and password.
- Use **Remember Me**.
- Use **Forgot Password** to request a reset email.

Password rules require:
- Uppercase letter
- Lowercase letter
- Number
- Special character
- Minimum 6 characters

After login, you may be prompted to accept the latest Terms of Service.

### First-time tour
On eligible accounts, a 2.0 release tour may appear with highlights like:
- Open event types
- Dashboard updates
- Copying past tailgates

---

## 3. Main Navigation
Bottom tabs:
- **Home**
- **Create**
- **Discover**

Other major screens are opened from cards, buttons, notifications, and profile settings.

---

## 4. Home (Dashboard)
Home focuses on your upcoming activity:
- **Your next tailgate** card
- **Upcoming tailgates** list
- Spotlight cards for:
  - Discovering open tailgates
  - Hosting your own event
  - Sponsored/featured content
- Quick access to **View all tailgates**

If you are hosting the event, tapping goes to **Host Dashboard**.
If you are attending, tapping goes to **Event Details**.

---

## 5. Create Tailgate (Host)
Create uses a multi-step builder.

### Step highlights
- **Basics**: event name, date/time, location, event notes.
- **Visibility type**:
  - \`Invite Only\` (private)
  - \`Open (Free)\`
  - \`Open (Paid)\`
- **Cover photos**:
  - Up to 5 photos
  - Reorder photos
  - First photo becomes primary cover
  - Option to skip
- **Details / Expectations**:
  - Set vibe and amenities (music, drinks, setup expectations)
- **Tickets & guests**:
  - For \`Open (Paid)\`: set ticket price (minimum $5), optional capacity, guest-name collection toggle.
  - For \`Invite Only\`: build invite list manually or from contacts, optional "guests can bring guests", and max additional guests per invite.
- **Review** before saving/publishing.

### Stripe payouts requirement for paid events
\`Open (Paid)\` requires Stripe Connect payout setup.
If payouts are not ready, setup prompts appear in the flow.

### Edit and copy behavior
- Edit existing events from host flows.
- Copy past/cancelled hosted events from **My Tailgates** into a new draft.

---

## 6. Discover Tailgates
Discover shows **open** events near a location.

You can:
- Use current location.
- Search by ZIP/city text.
- Switch between **list** and **map** views.
- Open event details directly from cards or map markers.

Cards include:
- Visibility (\`Open • Free\` / \`Open • Paid\`)
- Price (for paid events)
- Distance
- Host name
- Cover image(s)

---

## 7. My Tailgates
Central list of your hosted and joined events.

Filters:
- Upcoming
- Past
- Paid tailgates
- All

Card labels include:
- Hosting / Going / Not Going
- Upcoming / Past / Cancelled

Hosted past or cancelled events include a **Copy** action to prefill a new create flow.

---

## 8. Event Details
Event Details is the main event hub.

### Core event content
- Hero card with cover gallery, date/time, location, and attendance summary.
- Add to calendar.
- Open directions in maps.
- "What to bring" list.

### Tabs
- **Details**
- **Feed** (if enabled for the event)
- **Schedule** (when published)
- **Games**

### RSVP and joining logic

### Invite-only events
- RSVP status card (Going / Not going / Pending).
- Guests can manage plus-guests from **Manage guests you're bringing** when enabled by host settings.

### Open free events
- Open RSVP with party size controls.
- You can update how many are coming.

### Open paid events
- Ticket quantity selector.
- Checkout via Stripe session.
- Ticket status handling (pending, confirmed, checked in, sold out).
- Button to open **Your tickets**.

Some event areas for paid events are gated behind confirmed ticket access.

---

## 9. Invites and RSVP Links

### Send invites (host/private events)
- Add guests manually.
- Pull contacts from device contacts.
- Search contacts and bulk-select.
- Dedupes by phone/email key.

### Invite RSVP screen
Invitees can update RSVP:
- Going / Not going
- Additional guest count (when enabled)
- Named plus-guests with phone numbers

Supports authenticated and token-based invite flows.

---

## 10. Tickets, QR, and Wallet

### Tickets list
- Tickets grouped by purchase.
- Swipe between ticket cards.
- View ticket code, status, admissions, checked-in count, remaining.
- QR display with refresh support.

### Wallet integration
- iOS: Apple Wallet add/view/refresh pass.
- Android: Google Wallet add/view.

---

## 11. Host Dashboard
Host command center for a specific event.

### Overview
- Event summary + countdown
- Location card with map pin controls
- Weather forecast panel
- Attendee metrics and filtered attendee list

### Host controls
- Jump to event details (guest view)
- Build/edit schedule
- Manage quizzes (invite-only events)
- Ticket check-in tools
- Drop or update event pin

### Messaging attendees
- One-time SMS broadcast to eligible attendee phone numbers.

### Ticket operations
- Purchased / checked-in / remaining stats
- Gross sales + estimated payout
- Quick access to scan/code check-in tools

### Co-host management
- Add/remove co-hosts from eligible attendee list
- Co-hosts can help with ticket check-in

---

## 12. Ticket Check-In Tools (Host/Co-host)
Two modes:
- **Scan** QR
- **Code** entry

Features:
- Validate ticket state
- Check in full or partial admissions
- Guardrails for invalid or over-check-in attempts
- Recent check-ins list

---

## 13. Timeline / Schedule Builder
Hosts can:
- Set event start time
- Add/edit/delete schedule steps
- Set start time + duration for each step
- Publish/unpublish schedule

Attendees see published schedules in the Schedule tab as live/upcoming/completed phases.

---

## 15. Event Feed
Shared event feed supports:
- Text posts
- Multiple image uploads
- Drag-to-reorder selected media before posting
- Delete your own posts
- Fullscreen media viewer + save to gallery

---

## 16. Quiz Games
Quiz flows include:
- Create/edit quiz (host)
- Up to 10 questions
- Multiple choice or true/false
- Publish toggle from event games view
- Timed play experience with saved answers
- Leaderboard
- Answer review view

Quiz creation is restricted to invite-only event contexts in current app logic.

---

## 17. Notifications
Notification center features:
- Real-time list grouped by Today / Yesterday / Earlier
- Unread indicators
- Swipe-to-delete
- Bulk select mode:
  - Select all/clear
  - Mark selected read
  - Delete selected
- Deep links into event details and invite RSVP

---

## 18. Notification Preferences
Per-user toggle settings include:
- Invites
- Event updates
- Event reminders
- Feed post notifications
- RSVP updates

---

## 19. Profile and Account
Profile includes:
- Avatar upload
- Display name update
- Hosted/attended stat cards
- Badge collection and badge detail modal
- Theme preference:
  - System
  - Light
  - Dark
- Stripe payout status indicator

Account/support actions:
- Notification settings
- Tailgater stats
- Payout history
- Contact support
- Change password
- Logout
- Delete account (password confirmation required)

---

## 20. Stats, Payout History, and Payout Detail

### Tailgater Stats
Shows all-time hosting and payout metrics such as:
- Hosted/attended counts
- Paid tailgates
- Tickets sold
- Gross revenue
- Estimated payout
- Pending payout
- Lifetime payouts sent

### Payout History
- Status filters (all/sent/pending/failed)
- Date range filters
- Event filter
- Text search (event, payout ID, transfer ID)
- Pending balance and pending-age risk callout

### Payout Detail
- Processing timeline
- Gross/platform/Stripe/net breakdown
- Transfer and reference details
- Failure guidance with links to Stripe/support

---

## 21. Password and Payment Utility Screens
- **Forgot Password**: send reset link by email.
- **Change Password**: current password re-auth + new password validation.
- **Payment Success**: confirms ticket status and routes back to event.
- **Payment Cancel**: returns to event with cancellation notice.
- **Stripe Connect Return/Refresh**: guides users back after onboarding actions.

---

## 22. Practical Tips
- For paid events, complete Stripe setup before launch day to avoid checkout blockers.
- Publish schedule and enable feed early so attendees can coordinate.
- Encourage guests to use wallet passes for faster entry.
- Use co-hosts for gates/check-in during peak arrival times.
`;function r(c,l){return c.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean).map((t,s)=>{const a=`${l}-${s}`;return t.startsWith("**")&&t.endsWith("**")?e.jsx("strong",{children:t.slice(2,-2)},a):t.startsWith("`")&&t.endsWith("`")?e.jsx("code",{children:t.slice(1,-1)},a):e.jsx(h.Fragment,{children:t},a)})}function m(c){const l=c.split(/\r?\n/),i=[];let t=[],s=0;const a=()=>{if(t.length===0)return;const o=`list-${s++}`;i.push(e.jsx("ul",{className:"user-guide-list",children:t.map((n,d)=>e.jsx("li",{children:r(n,`${o}-${d}`)},`${o}-${d}`))},o)),t=[]};return l.forEach(o=>{const n=o.trim();if(n.startsWith("- ")){t.push(n.slice(2).trim());return}if(a(),!!n){if(n==="---"){i.push(e.jsx("hr",{className:"user-guide-divider"},`hr-${s++}`));return}if(n.startsWith("### ")){i.push(e.jsx("h3",{children:r(n.slice(4).trim(),`h3-${s}`)},`h3-${s++}`));return}if(n.startsWith("## ")){i.push(e.jsx("h2",{children:r(n.slice(3).trim(),`h2-${s}`)},`h2-${s++}`));return}if(n.startsWith("# ")){i.push(e.jsx("h1",{children:r(n.slice(2).trim(),`h1-${s}`)},`h1-${s++}`));return}i.push(e.jsx("p",{children:r(n,`p-${s}`)},`p-${s++}`))}}),a(),i}function f(){return e.jsxs("main",{className:"user-guide-page",children:[e.jsx(u,{}),e.jsx("section",{className:"user-guide-shell",children:e.jsx("article",{className:"user-guide-card",children:m(g)})}),e.jsx(p,{})]})}export{f as default};
