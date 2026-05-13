# Revenue NSW — Customer Enquiry Form

A customer-facing enquiry form built with React and Redux Toolkit. Allows users to submit their details, persists state in `sessionStorage`, and displays a confirmation of the submitted enquiry.

Built as a technical scenario assessment for the Full Stack Developer role at Revenue NSW.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Design Decisions](#design-decisions)
- [Accessibility](#accessibility)
- [Testing the Application](#testing-the-application)
- [What I'd Add With More Time](#what-id-add-with-more-time)
- [Backend Integration Approach](#backend-integration-approach)

---

## Overview

The application provides a single-page enquiry form for Revenue NSW customers. Users enter their details, submit the form, and see a confirmation screen with their submitted information. The submitted state survives page refreshes within the same browser tab.

**Core requirements addressed:**

- ✅ Form for user details
- ✅ Submitted data stored in Redux
- ✅ State persisted in `sessionStorage`
- ✅ Submitted information displayed after submission

---

## Tech Stack

| Technology        | Purpose                  | Why                                                                              |
| ----------------- | ------------------------ | -------------------------------------------------------------------------------- |
| **React 18**      | UI library               | Industry standard; matches role requirements                                     |
| **Vite**          | Build tool               | Faster dev server and builds than CRA; the modern default                        |
| **Redux Toolkit** | State management         | Official Redux recommendation; significantly less boilerplate than classic Redux |
| **React-Redux**   | React bindings for Redux | Standard hooks (`useSelector`, `useDispatch`)                                    |
| **Vanilla CSS**   | Styling                  | Kept dependencies minimal; sufficient for a single-form UI                       |

No additional form libraries (Formik, React Hook Form) or styling frameworks (Tailwind, MUI) were used — to keep the solution focused, lightweight, and easy to review.

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd enquiry-form

# Install dependencies
npm install

# Run the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
npm run preview
```

---

## Project Structure

src/
├── app/
│ └── store.js # Redux store configuration + sessionStorage sync
├── features/
│ └── enquiry/
│ ├── enquirySlice.js # Redux slice (state, reducers, actions)
│ ├── EnquiryForm.jsx # Form component with validation
│ └── EnquiryDisplay.jsx # Submitted enquiry confirmation
├── utils/
│ └── sessionStorage.js # Storage abstraction (load / save / clear)
├── App.jsx # Root component, conditional rendering
├── App.css # Application styles
└── main.jsx # Entry point, Redux Provider setup

The structure follows the **feature-based folder pattern** recommended by the Redux Toolkit team — co-locating the slice, components, and feature logic in one folder. This scales naturally as more features are added.

---

## How It Works

### Data flow

┌─────────────┐ dispatch ┌──────────────┐
│ EnquiryForm │ ─────────────► │ Redux Store │
└─────────────┘ └──────┬───────┘
│
│ store.subscribe()
▼
┌───────────────┐
│ sessionStorage│
└───────────────┘
│
│ on app load: preloadedState
▼
┌───────────────┐
│ Redux Store │ ─► useSelector ─► EnquiryDisplay
└───────────────┘

### The sessionStorage sync

Two-way synchronisation between Redux and `sessionStorage`:

1. **On app startup** — `loadState()` reads from sessionStorage and passes the result as `preloadedState` to `configureStore()`. If state was previously saved (e.g., the user submitted an enquiry then refreshed), Redux initialises with that data.

2. **On every state change** — `store.subscribe()` fires after each dispatched action and calls `saveState()` to persist the current store state.

This keeps the storage logic isolated from the reducers, which remain pure.

### Why sessionStorage (not localStorage)?

`sessionStorage` is **scoped to a single tab** and **cleared when the tab closes**. For a public-facing government enquiry form, this is the appropriate choice:

- **Privacy** — citizen enquiry data should not linger indefinitely on shared/public computers
- **Session integrity** — data lives only as long as the user's active session
- **Refresh resilience** — accidental refreshes don't lose the user's confirmation screen

`localStorage` would persist data across browser sessions and tabs, which is inappropriate for this use case.

---

## Design Decisions

### 1. Local state for the form, Redux for submitted data

The form inputs use `useState` locally; only the **submitted** enquiry goes into Redux. There's no need to put every keystroke into the global store — it would create unnecessary re-renders and add complexity. Redux is for state that needs to be **shared across components** or **persisted**.

### 2. Redux Toolkit over classic Redux

`createSlice` auto-generates action creators and uses Immer internally, which means we can write apparently-mutating code (`state.submitted = true`) safely. This reduces boilerplate by roughly 80% compared to classic Redux.

### 3. Storage logic in a separate module

`utils/sessionStorage.js` wraps the browser API with try/catch blocks. This:

- Handles edge cases (private browsing, quota exceeded, disabled storage)
- Keeps the slice and store config clean
- Makes it trivial to swap the storage mechanism (e.g., IndexedDB) later

### 4. Persistence via `store.subscribe()`, not in reducers

Reducers must be pure functions. Calling `sessionStorage.setItem()` inside a reducer would be a side effect and break that principle. Subscribing to the store is the idiomatic Redux pattern for persistence.

### 5. No router

The app has a single screen with two conditional states (form / confirmation). Adding React Router for this would be over-engineering.

### 6. Reusable component layer

Components are split into two folders:

- **`components/`** — generic, reusable presentational components (`Button`, `FormField`, `DetailRow`). No business logic, no Redux. Take props, render UI.
- **`features/`** — domain-specific containers (`EnquiryForm`, `EnquiryDisplay`). Connect to Redux, handle validation and dispatch logic.

This follows the **container / presentational pattern**. The benefits:

- **Reusability** — `FormField` can serve any future form
- **Testability** — presentational components are pure functions of their props
- **Clear responsibilities** — business logic lives in one place

## I deliberately did not extract every repeated piece of markup. For example, the page-title `<h2>` element wasn't extracted, as two slightly-different uses didn't justify a new component. The principle: abstract on real repetition, not anticipated repetition.

## Accessibility

NSW Government digital services must meet **WCAG 2.1 Level AA**. The following have been implemented:

- Semantic HTML (`<form>`, `<label>`, `<dl>` for the confirmation details)
- Explicit `htmlFor` / `id` associations between labels and inputs
- `aria-invalid` and `aria-describedby` on inputs with validation errors
- Visible focus states (2px outline) for keyboard navigation
- Sufficient colour contrast (NSW navy `#002664` on white passes AAA)
- Error messages presented in text, not by colour alone

---

## Testing the Application

### Manual test flow

1. Run `npm run dev` and open the app
2. Try submitting an empty form → validation errors appear
3. Fill in the form with valid data → click submit
4. Confirmation screen displays with all submitted details
5. **Open DevTools → Application → Session Storage** → see the persisted JSON
6. **Refresh the browser** → confirmation screen remains (persistence working)
7. **Close the tab and reopen** → data is gone (sessionStorage cleared)
8. Click "Submit Another Enquiry" → form resets, sessionStorage updates

### With Redux DevTools

Install the [Redux DevTools browser extension](https://github.com/reduxjs/redux-devtools) to observe:

- The `submitEnquiry` action being dispatched
- The state transition from `{ submitted: false, data: null }` to the populated state
- Time-travel debugging via the action log

---

## What I'd Add With More Time

The brief was scoped to a self-contained front-end task. For a production deployment I would add:

| Area                     | Addition                                                                                            |
| ------------------------ | --------------------------------------------------------------------------------------------------- |
| **Testing**              | Unit tests for the slice (Vitest), component tests (React Testing Library), end-to-end (Playwright) |
| **Validation**           | A schema library like Zod for consistent client + server validation                                 |
| **Forms**                | React Hook Form to reduce re-renders and simplify validation as the form grows                      |
| **Accessibility**        | Full audit with axe-core; live region announcements for errors                                      |
| **Internationalisation** | i18n setup — government services in NSW require multi-language support                              |
| **Error handling**       | Error boundary around the app; user-friendly fallback UI                                            |
| **Analytics**            | Anonymous metrics on form completion / abandonment rates                                            |
| **Spam protection**      | reCAPTCHA or similar before submission                                                              |
| **TypeScript**           | Type safety on the store, action payloads, and component props                                      |

---

## Backend Integration Approach

The current implementation simulates a successful submission locally. For a real backend, my approach would be:

### 1. Async submission with `createAsyncThunk`

Replace the synchronous `submitEnquiry` action with an async thunk that POSTs to an API:

```js
export const submitEnquiry = createAsyncThunk(
  'enquiry/submit',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Submission failed');
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
```

The slice would handle three states: `pending`, `fulfilled`, `rejected` — giving us loading spinners, success confirmation, and error retries for free.

### 2. Security considerations

- **HTTPS only** — non-negotiable for any government form
- **Server-side validation** — never trust the client; validate again on the server with the same schema
- **CSRF protection** — token-based for cookie-authenticated APIs
- **Rate limiting** — per-IP to prevent spam/abuse
- **Input sanitisation** — protect against XSS and injection
- **Audit logging** — record submissions with timestamps and IPs (with privacy notice on the form)

### 3. Data handling

- A unique reference number returned by the backend should be shown in the confirmation
- An optional email confirmation to the user
- Submitted enquiries routed to the appropriate Revenue NSW team based on `enquiryType`

---

## Author

Built by Nasim Jani as part of the Revenue NSW Full Stack Developer technical assessment.
