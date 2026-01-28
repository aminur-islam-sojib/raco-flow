# 🌊 RacoFlow

> **Production-grade project marketplace for RacoAI.**  
> A seamless bridge between project visionaries (Buyers) and technical executors (Problem Solvers).

---

## 📑 Table of Contents

- [Overview](#-overview)
- [System Roles](#-system-roles)
- [Project Lifecycle](#-project-lifecycle)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Key Architectural Decisions](#-key-architectural-decisions)
- [Setup Instructions](#-setup-instructions)
- [API Route Summary](#-api-route-summary)

---

## 🎯 Overview

**RacoFlow** is a full-stack project workflow system built to handle high-level task decomposition. It manages the entire journey from user onboarding and role promotion to multi-task project delivery using validated `.zip` submissions.

---

## 👥 System Roles

| Role       | Responsibility    | Key Permissions                                             |
| :--------- | :---------------- | :---------------------------------------------------------- |
| **Admin**  | Governance        | Promote users to Buyers, Oversight of all projects.         |
| **Buyer**  | Project Ownership | Create projects, assign Solvers, approve/reject work.       |
| **Solver** | Execution         | Bid on projects, create sub-tasks, submit ZIP deliverables. |

---

## 🔄 Project Lifecycle

To ensure data integrity, the application implements a strict **Finite State Machine**:

1. **OPEN**: The project is created by a Buyer and visible to all Solvers.
2. **ASSIGNED**: A Solver is selected. Bidding is closed. The Solver can now create sub-tasks.
3. **COMPLETED**: All sub-tasks are submitted via `.zip` and accepted by the Buyer.

---

## 🛠 Tech Stack

### Frontend

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion (State-aware transitions)
- **Components:** Headless UI / Radix

### Backend & Database

- **Runtime:** Node.js
- **Auth:** NextAuth.js (JWT Strategy)
- **Database:** **MongoDB Native Driver** (No ORM for maximum query performance)
- **Logic:** Native Aggregation Pipelines

---

## 📂 Project Structure

The project follows a **Modular Service-Oriented Architecture**:

```text
src/
├── app/                # Next.js App Router (Routes & API)
│   ├── (dashboard)/    # Role-protected UI layouts
│   └── api/            # RESTful API endpoints
├── components/         # UI Toolkit (Atomic Design)
├── lib/                # Database singletons & Auth config
├── services/           # Business Logic (DB Aggregations)
├── types/              # Strict TypeScript definitions
└── middleware.ts       # Edge-level Role-Based Access Control
```

---

## 🧠 Key Architectural Decisions

### 1. The Service Layer Pattern

I decoupled the database logic from the Next.js API routes into a dedicated `services/` directory. This ensures that the business logic is reusable, easier to test, and not tied directly to the request/response cycle.

### 2. Native MongoDB Aggregations

Instead of using an ORM like Mongoose, I utilized the Native MongoDB Driver. This allowed for:

- **Complex Joins**: Fetching projects with Solver details in a single query.
- **Performance**: Avoiding the overhead of an abstraction layer.
- **Flexibility**: Dynamic task metadata handling.

### 3. Edge-Level Security

Security is enforced using Next.js Middleware. This checks the user's role (Admin/Buyer/Solver) at the edge before the page even renders, preventing unauthorized access to sensitive dashboards.

### 4. Meaningful Animations

Using Framer Motion, I implemented "Intentional UI Transitions." When a project status changes, the UI doesn't just "flicker"—it slides and scales to guide the user's eyes to the new state.

---

## 🚀 Setup Instructions

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/racoflow.git
cd racoflow
npm install
```

### 2. Environment Configuration

Create a `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
```

### 3. Start Development

```bash
npm run dev
```

---

## 📡 API Route Summary

| Method | Endpoint                     | Access | Function                            |
| :----- | :--------------------------- | :----- | :---------------------------------- |
| PATCH  | `/api/admin/promote`         | Admin  | Assigns Buyer role to a user        |
| POST   | `/api/projects`              | Buyer  | Creates a new project listing       |
| POST   | `/api/projects/[id]/request` | Solver | Submits a request to join a project |
| PUT    | `/api/tasks/[id]/submit`     | Solver | Uploads ZIP and marks task as done  |

---

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/racoflow/issues).

---

**Built with ❤️ for RacoAI**
