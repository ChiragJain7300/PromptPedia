# Next.js Prompt Sharing App

This is a **Next.js** application that allows users to create, share, and manage prompts. It uses **MongoDB** as a database and **NextAuth.js** for authentication.

## 🚀 Features
- User authentication with **NextAuth.js**
- Secure API routes with **Next.js App Router**
- Database connectivity with **MongoDB (Mongoose)**
- CRUD operations for prompts (Create, Read, Update, Delete)
- Fully typed with **TypeScript**
- **Server Components & API Handlers** for optimized performance

---

## 🛠️ Tech Stack
- **Frontend:** Next.js (App Router), TypeScript, React
- **Backend:** Next.js API routes, Mongoose (MongoDB)
- **Authentication:** NextAuth.js
- **Database:** MongoDB with Mongoose ORM

## 📂 Project Structure
```/your-repo
│── /app
│   ├── /api
│   │   ├── /auth [...nextauth].ts   # NextAuth.js configuration
│   │   ├── /prompt                  # API routes for prompts
│   │── /components                  # Reusable UI components
│   │── /models/Prompt.ts             # Mongoose schema for prompts
│   │── /utils/database.ts            # Database connection helper
│── /pages
│── /public
│── .env.local                        # Environment variables
│── package.json
│── tsconfig.json                      # TypeScript configuration
│── next.config.js                     # Next.js configuration
│── README.md
```
### 🔹 Explanation:
- **`/app/api/prompt/route.ts`** → API routes for prompt CRUD operations.
- **`/app/components/FormTemp.tsx`** → Reusable form component.
- **`/app/models/Prompt.ts`** → Mongoose model schema.
- **`/app/utils/database.ts`** → MongoDB connection helper.
- **`/public/`** → Static assets (images, icons).
- **`.env.local`** → Stores environment variables.
- **`tsconfig.json`** → TypeScript settings.
- **`next.config.js`** → Next.js configurations.
- **`README.md`** → Project documentation.

This structure ensures **clean code organization** and **scalability**. 🚀

## 🔑 Authentication with NextAuth.js

This app uses NextAuth.js with multiple authentication providers.

## 🏆 Credits
Developed by Chirag Jain 🚀

### 📌 Key Highlights:
- **Covers installation, setup, authentication, and API usage**
- **Includes a structured project overview**
- **Has clear instructions for deployment & environment setup**
- **Uses markdown for easy readability and copy-paste compatibility**

Let me know if you need modifications! 🚀




