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
git clone [your-repo-url]
cd latest-news-app
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

Make sure to update the \`.env\` files in both the \`client\` and \`server\` directories. Use \`localhost\` for ports during development.

### \`/client/.env\`

\`\`\`env
VITE_NYT_API_KEY=your_nyt_api_key_here
\`\`\`

### \`/server/.env\`

\`\`\`env
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
\`\`\`

---

## ✅ Deployment

- **Frontend** is deployed on **Vercel**
- **Backend** is deployed on **Render**

Everything installs locally — no global packages are required.

\`\`\`bash
npm install
npm run dev

````

---

### Deployment Notes

This solution meets the requirement:
_"The solution should only have to be run with \`npm install\` and \`npm start\` (or \`npm run dev\`) — without global packages."_

---

## 🔒 API Key

To use the New York Times API, you’ll need to sign up for an API key:

📌 [NYT Developer API](https://developer.nytimes.com/)

Add your API key to the \`.env\` file in the client directory:

```bash env
VITE_NYT_API_KEY=your_api_key_here
````

---

## 📋 Future Improvements

- Font resizing to make the app more accessible for users with visual impairments.
- Further WCAG compliance improvements.
