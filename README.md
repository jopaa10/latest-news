# 📰 Latest News App

A full-stack, accessible web application that displays the latest headlines using the **New York Times API**. Users can explore trending and recent news articles through a clean and responsive UI.

---

## 🌐 Live Demo

👉 [https://latest-news-ruby.vercel.app/](https://latest-news-ruby.vercel.app/)

---

## 📦 Tech Stack

### Frontend (`/client`)

- React.js
- SCSS for styling
- Deployed on **Vercel**

### Backend (`/server`)

- Node.js with Express
- Prisma ORM
- Supabase (PostgreSQL)
- Deployed on **Render**

---

## ♿ Accessibility

This app has been tested with **axe DevTools**, a browser extension that helps identify and fix accessibility issues in real time.

While the app supports many accessibility features (semantic HTML, ARIA labels, keyboard navigation), it's **not fully WCAG-compliant** yet — for example, **font resizing** is not implemented. This will be addressed in future updates.

**Accessibility features:**

- Keyboard-operable controls
- Clear contrast ratios
- Semantic HTML structure
- ARIA labels and roles

## Accessibility Considerations (WCAG)

### Focus Management

In compliance with WCAG (Web Content Accessibility Guidelines), our application ensures that all interactive elements such as input fields, buttons, and links are accessible to keyboard users and users with disabilities.

- **Focus on Click**: When a user clicks on any interactive element (input fields), it will receive focus, making it clear which element is currently selected.
- **Tab Key Navigation**: Users can navigate through the interactive elements using the `Tab` key. This allows users to move through the form inputs and buttons in a predictable order, ensuring a seamless experience for keyboard users.

### Why This Is Important:

- **WCAG 2.1, Guideline 2.4.3 (Focus Order)**: Ensures that interactive elements are focusable and navigable in a logical order.
- **WCAG 2.1, Guideline 2.4.7 (Focus Visible)**: Ensures that users can easily see which element is focused, improving usability for keyboard and screen reader users.

By implementing proper focus handling, we ensure that our application is accessible to a broader range of users, including those relying on keyboard navigation and screen readers.

---

## 🎨 Design Decisions and Reasoning

Throughout the development of this app, several design choices were made to enhance user experience, accessibility, and performance:

### 1. Color Contrast Adjustments for Sidebar:

One significant change was improving the color contrast of the sidebar. Initially, the contrast didn’t meet accessibility standards, and this was identified using the axe DevTools extension. Enhancing the color contrast ensures better readability for users with visual impairments, aligning with WCAG guidelines for accessibility.

### 2. Toast Notifications for Favorites:

To improve user feedback, I added a toast component to notify users when they add or remove news from their favorites. This enhances the UX by providing real-time feedback without interrupting the user's workflow, giving them assurance that their actions were successfully completed.

### 3. Login/Registration Modal Design:

Instead of navigating to a separate page, the login and registration process was implemented as a modal. The design was aligned with the app’s existing color scheme, ensuring a cohesive look and feel. This choice minimizes page reloads, keeping the user on the current page for a more fluid experience.

### 4. Skeleton Loader for News Loading:

Instead of a traditional loading spinner, I introduced a news skeleton loader. This modern approach simulates the layout of the news cards while they load, providing a smoother and more visually appealing experience. It also helps users understand the structure of the content while waiting for it to load, improving perceived performance.

---

## 📁 Project Structure

```bash
latest-news-app/
├── client/ # React frontend
├── server/ # Node + Express backend
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/jopaa10/latest-new
cd latest-news
```

### 2. Run the frontend

```bash
cd client
npm install
npm run dev
```

### 3. Run the backend

```bash
cd server
npm install
npm run dev
```

---

## 🛠️ Environment Setup

Make sure to update the `.env` files in both the `client` and `server` directories. Use `localhost` for ports during development.

### /client/.env

```env
VITE_NYT_API_KEY=your_nyt_api_key_here
```

### /server/.env

```env
PORT=5000

# Database configuration

DB_PASSWORD=your_database_password
JWT_SECRET=your_jwt_secret

DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://<user>:<password>@<host>:<port>/<database>"

# Email SMTP settings

SMTP_SERVICE=gmail
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password

# Frontend URL (for CORS / verification emails, etc.)

FRONTEND_URL=http://localhost:5173
```

---

## ✅ Deployment

- **Frontend** is deployed on **Vercel**
- **Backend** is deployed on **Render**

Everything installs locally — no global packages are required.

```bash
npm install
npm run dev

```

---

## 🔒 API Key

To use the New York Times API, you’ll need to sign up for an API key:

📌 [NYT Developer API](https://developer.nytimes.com/)

Add your API key to the \`.env\` file in the client directory:

```bash env
VITE_NYT_API_KEY=your_api_key_here
```

---

## 📋 Future Improvements

- Font resizing to make the app more accessible for users with visual impairments.
- Further WCAG compliance improvements.
