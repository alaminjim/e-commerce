# E-Commerce 🚀

A full-stack e-commerce web application built with React (client) and Node/Express (server).  
This repository contains both the `client` and `server` folders. The project includes user authentication, product listing, cart & checkout flow, admin panel, and Stripe payment integration (if configured).

---

## 🔗 Live Demo
**Live site:** `https://e-commerce-shop-d6930c.netlify.app`
> Replace the above URL with your actual deployed site link.

---

## 🔐 Demo Admin Credentials (for testing)
> These credentials are only for development/demo purposes. **Do not commit real credentials to a public repo.**

- **Admin email:** `admin123@gmail.com`  
- **Admin password:** `12345678`

If you want to use your own Gmail account for admin, update the server seed or your user in the database and change the env settings accordingly.

---

## 📌 Features

- User registration & login (email/password + Google sign-in if configured)
- Protected routes for user & admin
- Admin dashboard to add/update/delete products and manage orders
- Product listing with categories, filtering & sorting
- Cart and checkout flow
- Stripe payment integration (configurable via env variables)
- Image upload support (Cloudinary or local storage depending on config)
- Responsive UI built with Tailwind CSS / modern CSS (project specific)

---

## 🧰 Tech Stack

- **Client:** React, React Router, Axios, Tailwind CSS (or your chosen CSS framework)
- **Server:** Node.js, Express, Mongoose (MongoDB)
- **Authentication:** JWT (JSON Web Tokens) / Firebase Auth optional
- **Payments:** Stripe (optional — configure keys)
- **Uploads:** Cloudinary (optional)
- **Hosting:** Netlify / Vercel for client and Render / Heroku / Railway / DigitalOcean for server (your choice)

---

## 🚀 Quick Start (Local)

> Clone the repo, install dependencies and run client & server.

1. Clone repository
```bash
git clone https://github.com/alaminjim/e-commerce.git
cd e-commerce

cd ../client
cp .env.example .env
# Edit .env with your API base URL (REACT_APP_API_URL or similar)
npm install
npm start

/client    # React app
/server    # Express API + MongoDB
README.md

🛡 Security Note

1.Never commit real passwords, API keys, or sensitive credentials to a public repository.

2.Use .env files, and add them to .gitignore.

3.For production, use secret managers or environment variables provided by your hosting provider.

📞 Contact

Author: Al-Amin Islam

Email: jimalamin7@gmail.com
