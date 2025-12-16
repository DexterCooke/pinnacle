# Pinnacle CRM
<img width="1223" height="494" alt="Screenshot 2025-12-16 at 3 34 30 PM" src="https://github.com/user-attachments/assets/1884245e-5a5c-45b5-bf53-1321bea0e6e4" />

Pinnacle is a lightweight, developer-friendly CRM built with **FastAPI**, **SQLAlchemy**, **React**, and **JWT authentication**.  
It focuses on the core primitives of a CRM: **Companies, Contacts, Deals, and Activities**, without enterprise bloat.


---

## What This App Is

Pinnacle is a **foundational CRM** that lets a user:

- Track companies and contacts
- Manage deals through stages
- Log activities (notes, calls, emails, tasks, meetings)
- View a high-level dashboard showing recent activity and counts
- Authenticate via JWT and protect all API routes

It’s designed to be:
- Easy to understand
- Easy to extend
- Easy to reason about as a full-stack system

---

## Core Concepts

### Companies
Organizations you do business with.

**Fields**
- `name`
- `domain`
- `created_at`

---

### Contacts
People associated with companies.

**Fields**
- `name`
- `email`
- `company_id`
- `created_at`

---

### Deals
Opportunities tied to revenue.

**Fields**
- `name`
- `stage` (`lead`, `qualified`, `proposal`, `won`, `lost`)
- `amount`
- `company_id`
- `created_at`

Deals are intentionally simple and stage-driven. A Kanban-style UI can be layered on later.

---

### Activities
The event log of your CRM. This is the heartbeat of the system.

**Activity types**
- `note`
- `call`
- `email`
- `task`
- `meeting`

**Fields**
- `type`
- `subject` (optional)
- `body` (details)
- `company_id` (optional)
- `contact_id` (optional)
- `deal_id` (optional)
- `created_at`

Activities power:
- The dashboard “Recent Activity” section
- Relationship history
- Future reminders and analytics

---

## Dashboard

The dashboard answers one question fast:

**“What’s going on right now?”**

It shows:
- Total counts for companies, contacts, deals, and activities
- Recent activities
- Recent deals and their stages

If this page breaks, your API or auth is broken. It’s the canary in the coal mine.

---

## Authentication

Authentication uses **JWT (Bearer tokens)**.

**Flow**
1. User logs in
2. Backend issues a JWT
3. Frontend stores the token in `localStorage`
4. All API requests attach:

