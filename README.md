# Revenue NSW — Customer Enquiry Form

A small enquiry form built with React and Redux Toolkit. The user fills in their details, submits the form, and sees a confirmation screen. The submitted data is kept in `sessionStorage` so a page refresh does not lose it.

Built as a technical scenario for the Full Stack Developer role at Revenue NSW.

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

The app is a single page. The user enters their details into a form. When they submit, a confirmation screen takes its place and shows the details back to them. If they refresh the browser tab, the confirmation screen is still there.

What the brief asked for:

- A form that collects the user's details
- The submitted data stored in Redux
- That state kept in `sessionStorage` so it survives a refresh
- A screen that displays the submitted details

All four points are covered.

---

## Tech Stack

| Tool              | Used for                  | Why                                                               |
| ----------------- | ------------------------- | ----------------------------------------------------------------- |
| **React 18**      | UI                        | Matches the role requirements.                                    |
| **Vite**          | Build tool and dev server | Fast startup and hot reload. Modern default for React projects.   |
| **Redux Toolkit** | State management          | The official way to use Redux. Much less boilerplate than before. |
| **React-Redux**   | Connects React and Redux  | Standard `useSelector` and `useDispatch` hooks.                   |
| **Plain CSS**     | Styling                   | Enough for a single form. No framework needed.                    |

No form libraries (like Formik or React Hook Form) and no UI libraries (like Tailwind or MUI) were added. The app is small enough that the extra dependencies were not worth it.

---

## Getting Started

### Requirements

- Node.js 18 or newer
- npm

### Run locally

```bash
git clone <repo-url>
cd enquiry-form
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Build for production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── app/
│   └── store.js              # Redux store + sessionStorage sync
├── components/               # Reusable building blocks
│   ├── Button/
│   ├── FormField/
│   ├── DetailRow/
│   └── Layout/               # Header and Footer
├── features/
│   └── enquiry/
│       ├── enquirySlice.js   # Redux slice (state and actions)
│       ├── EnquiryForm.jsx   # The form screen
│       └── EnquiryDisplay.jsx# The confirmation screen
├── utils/
│   └── sessionStorage.js     # Wrapper around the browser storage API
├── App.jsx                   # Picks which screen to show
├── App.css
└── main.jsx                  # Entry point, wires up the Redux Provider
```

The structure follows the **feature folder** pattern recommended by the Redux Toolkit team. Everything related to the enquiry feature lives in one folder. Generic UI pieces sit in `components/` and have no knowledge of the feature.

---

## How It Works

### Data flow

```
┌─────────────┐   dispatch    ┌──────────────┐
│ EnquiryForm │ ─────────────►│  Redux Store │
└─────────────┘               └──────┬───────┘
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
                              │  Redux Store  │ ─► useSelector ─► EnquiryDisplay
                              └───────────────┘
```

### How sessionStorage stays in sync

There are two points where Redux and sessionStorage talk to each other:

1. **When the app starts.** `loadState()` reads from sessionStorage and passes the result as `preloadedState` to `configureStore()`. If the user had already submitted before refreshing, the store comes back with their submitted data still in place.

2. **After every action.** `store.subscribe()` runs after each dispatch and calls `saveState()` to write the current store state back into sessionStorage.

Keeping this logic outside of the reducers means the reducers stay pure — easy to test, easy to reason about.

### Why sessionStorage and not localStorage

`sessionStorage` is tied to a single browser tab and is cleared when the tab closes. For a public-facing government form that is the safer choice:

- **Privacy.** The user's details should not be left behind on a shared computer.
- **Scope.** The data only exists for as long as the user is using the page.
- **Refresh resilience.** An accidental refresh does not lose the confirmation screen.

`localStorage` would keep the data across tabs and sessions, which is not appropriate here.

---

## Design Decisions

### 1. Local state for the form, Redux for the submitted data

Form inputs are kept in `useState` inside `EnquiryForm`. Only the final, validated submission goes into Redux. Putting every keystroke into the global store would cause extra re-renders and add complexity for no benefit. Redux is best used for state that is shared between components or that needs to be persisted.

### 2. Redux Toolkit over classic Redux

`createSlice` generates the action creators automatically and uses Immer under the hood. That means we can write code that looks like a mutation (`state.submitted = true`) and the slice still produces a new, immutable state. This cuts down a lot of boilerplate by 80%

### 3. Storage logic in its own module

`utils/sessionStorage.js` wraps the browser API in try/catch blocks. This way:

- Private browsing modes that disable storage won't crash the app.
- Quota errors are caught and logged.
- The storage choice can be swapped later (for example, to IndexedDB) without touching the slice or the store.

### 4. Persistence happens via `store.subscribe()`, not inside reducers

Reducers must be pure. Calling `sessionStorage.setItem()` inside one would be a side effect. Subscribing to the store is the standard Redux pattern for this kind of thing.

### 5. No router

There is one screen with two states (form and confirmation). React Router would not add anything useful.

### 6. Reusable component layer

The code splits its components into two groups:

- **`components/`** — generic pieces (`Button`, `FormField`, `DetailRow`, `Header`, `Footer`). They take props and render UI. They know nothing about Redux or the enquiry feature.
- **`features/`** — feature-specific containers (`EnquiryForm`, `EnquiryDisplay`). They talk to Redux, run validation, and handle dispatch.

This is the **container / presentational** split. It pays off in three ways:

- The generic components can be reused if more forms are added.
- The generic components are easy to test because they are pure functions of their props.
- Each file has a clear job — UI in one place, business logic in another.

I have not extracted every small piece of repeated markup. For example, the `<h2>` page heading has only two slightly-different uses, which did not justify a wrapper component. The rule of thumb is: The principle: abstract on real repetition, not anticipated repetition. (extract a component when you see real repetition, not when you imagine future repetition.)

---

## Accessibility

NSW Government digital services need to meet **WCAG 2.1 Level AA**. The following are in place:

- Semantic HTML — `<form>`, `<label>`, `<main>`, `<header>`, `<footer>`, and `<dl>` for the confirmation details.
- Each input is linked to its label through matching `htmlFor` and `id` attributes.
- Inputs that have an error get `aria-invalid="true"` and `aria-describedby` pointing to the error message.
- Required inputs use the HTML `required` attribute, so assistive tech announces it correctly.
- Error messages use `role="alert"` so screen readers read them out when they appear.
- After a successful submission, keyboard focus moves to the confirmation heading so screen reader users hear the success message.
- The confirmation panel uses `aria-live="polite"` to announce when it appears.
- Focus is visible on every interactive element (`:focus` styles with a 2px outline).
- Colour contrast meets AAA on the main text (NSW navy `#002664` on white).
- Errors are shown in text, not colour alone.

---

## Testing the Application

### Manual walkthrough

1. Run `npm run dev` and open the app.
2. Click submit on an empty form. Validation errors should appear.
3. Fill in the form with valid data and submit. The confirmation screen should appear.
4. Open DevTools → Application → Session Storage. The submitted JSON should be there.
5. Refresh the browser. The confirmation screen should still be there.
6. Close the tab and open the app again in a new tab. The data should be gone.
7. Click "Submit Another Enquiry". The form should reset and the storage entry should update.

### With Redux DevTools

If you install the [Redux DevTools browser extension](https://github.com/reduxjs/redux-devtools), you can watch:

- The `submitEnquiry` action being dispatched.
- The state going from `{ submitted: false, data: null }` to the populated shape.
- Time-travel between actions to replay state changes.

---

## What I'd Add With More Time

The brief was a self-contained front-end task. For a real production deployment I would add:

| Area                 | What I would add                                                                |
| -------------------- | ------------------------------------------------------------------------------- |
| Testing              | Vitest for the slice, React Testing Library for components, Playwright for E2E. |
| Validation           | A schema library like Zod, so client and server share validation rules.         |
| Forms                | React Hook Form if the form grows. Cuts re-renders and simplifies validation.   |
| Accessibility        | A full axe-core audit. Live-region announcements for error summaries.           |
| Internationalisation | i18n setup — NSW government services need multi-language support.               |
| Error handling       | An error boundary around the app with a friendly fallback UI.                   |
| Analytics            | Anonymous metrics on form completion and abandonment.                           |
| Spam protection      | reCAPTCHA or similar.                                                           |
| TypeScript           | Types on the store, action payloads, and component props.                       |

---

## Backend Integration Approach

The current code simulates a successful submission in the browser. For a real backend, the changes would look like this:

### 1. Async submission with `createAsyncThunk`

Swap the current synchronous action for an async thunk that POSTs to an API:

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

The slice would then handle three states — `pending`, `fulfilled`, and `rejected` — which gives us loading spinners, success confirmation, and retry handling for free.

### 2. Security

- **HTTPS only.** Non-negotiable for any government form.
- **Server-side validation.** The client cannot be trusted. The server must validate again, ideally with the same schema.
- **CSRF protection.** Token-based, for any cookie-authenticated API.
- **Rate limiting.** Per IP, to slow down spam and abuse.
- **Input sanitisation.** To prevent XSS and injection attacks.
- **Audit logging.** Record each submission with a timestamp and source IP. A privacy notice on the form should mention this.

### 3. Data handling

- The backend should return a unique reference number, shown on the confirmation screen.
- An optional email confirmation could be sent to the user.
- Submissions should be routed to the correct Revenue NSW team based on `enquiryType`.

---

## Author

Built by Nasim Jani as part of the Revenue NSW Full Stack Developer technical assessment.
