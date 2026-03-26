# User Directory Dashboard

A responsive React + TypeScript dashboard that fetches users from `jsonplaceholder` and lets you search, sort, paginate, and view a full user profile.

## Features

- Dashboard table with `Name`, `Email`, `Phone`, and `Company`
- Client-side search (filters by `Name` and `Email`)
- Sortable columns for `Name` and `Company` (ascending/descending via clickable headers)
- Pagination for the table results
- Debounced search input for smoother filtering
- Loading spinner while fetching data
- Error state with retry if the API fails
- User detail page at `/users/:id` with a responsive card layout
- User avatar generated from the user name initials
- Copy email button on the detail card
- Back to dashboard button
- Table skeleton loader during loading

## Tech Stack

- React + TypeScript
- Vite
- TailwindCSS
- React Router
- Axios
- TanStack Table

## Setup

1. Install dependencies

```bash
npm install
```

2. Run the dev server

```bash
npm run dev
```

3. Build (optional)

```bash
npm run build
```

## Folder Structure

```text
src
 ├── components
 │     ├── UserTable
 │     ├── SearchBar
 │     └── UserCard
 ├── pages
 │     ├── Dashboard
 │     └── UserDetails
 ├── services
 │     └── api.ts
 ├── hooks
 │     ├── useUsers.ts
 │     └── useDebouncedValue.ts
 ├── types
 │     └── user.ts
 ├── utils
 │     └── sorting.ts
 ├── router
 │     └── AppRouter.tsx
 ├── App.tsx
 ├── main.tsx
 └── index.css
```

## Screenshots

Add screenshots for:

- Dashboard (search + sortable columns + pagination)
- User details page (card layout + copy email button)
- Mobile layout (responsive table + spacing)

