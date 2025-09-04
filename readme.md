# 📌 Subscription Renewal Tracker

**A production-ready backend project** that automates subscription tracking and sends timely reminders using modern tools and best practices.  
Built with **Node.js, Express.js, MongoDB, Arcjet, and Upstash Workflow**, this project demonstrates **scalable backend design, robust security, and automation skills**.

---

## 🚀 Features  

### 🔐 Security with Arcjet  
- **API Rate Limiting** – prevents server overload by handling concurrent requests safely.  
- **Bot Protection** – blocks malicious/bot traffic from hitting the APIs.  
- **Authorization System** – secured with JWT Bearer Tokens in headers.  
- **Validation & Input Sanitization** – ensures safe and clean API usage.  

### 📅 Subscription Management  
- Auto-calculation of renewal dates.  
- Each user has isolated subscription records (non-shareable).  
- Robust validation checks before updates.  

### 🔔 Automated Reminders with Upstash Workflow  
- Trigger workflow on **new subscription creation**.  
- Retrieve and validate subscription details.  
- Smart evaluation of renewal dates (past vs future).  
- Predefined reminder loop (7 days, 5 days, 2 days, 1 day, final day).  
- Sends email notifications (continue/discontinue reminders).  

### 📧 Email Notifications  
- Integrated with **NodeMailer** for production-ready email reminders.  
- Handles failures gracefully and logs issues clearly.  

---

## 🏗️ Architecture  
- **Monolithic Architecture** with clean and modular code practices.  
- **REST API**: JSON-based, stateless, resource-oriented.  
- **MongoDB + Mongoose**: schema-driven NoSQL DB.  
- **Express.js**: routing, middleware, error handling.  
- **Arcjet**: bot detection & request protection.  
- **Upstash**: workflow engine for scheduling tasks.  

---

## 📂 Tech Stack  
- **Backend Framework**: Node.js + Express.js  
- **Database**: MongoDB (Mongoose ORM)  
- **Security**: [Arcjet](https://arcjet.com/) (Rate limiting, bot protection, Dos Attack Protection)  
- **Workflow & Automation**: [Upstash](https://upstash.com/)
- **Email Service**: [NodeMailer](https://nodemailer.com/)  
- **Render**: [Render](https://render.com/) 
- **Development Tools**: ESLint  

---

## 🔑 API Highlights  
- **Sign-In / Sign-Out** with JWT-based authorization headers.  
- **Protected Routes** requiring valid Bearer tokens.  
- **CRUD operations** for subscriptions.
- **Session Handling** Session-based system using `mongoose.startSession()` for secure DB operations.  
- **Validation** at schema + API level.  
- **Error Handling Middleware** for cleaner responses.  

---

## 📊 Workflow Logic (Upstash Flow)  
1. **Trigger**: On subscription creation, workflow starts with subscription ID.  
2. **Retrieve Subscription**: Validate existence + status.  
3. **Renewal Date Check**: Stop if expired, continue if active.  
4. **Reminder Loop**: Schedule reminders (7, 5, 2, 1, 0 days).  
5. **Execution**: Send email notifications at scheduled times.  
6. **Completion**: Workflow concludes after final day reminder.

---

## 📌 API Endpoints  

### 🔑 Auth Routes (`/api/v1/auth`)  
- `POST /sign-in` → User login, returns JWT token.  
- `POST /sign-up` → Register a new user.  
- `POST /sign-out` → Logout user (invalidate token on client side).  

### 👤 User Routes (`/api/v1/users`)  
- `GET /` → Get all users.  
- `GET /:id` → Get a specific user by ID.  
- `PUT /user/:id/update` → Update user details.  
- `DELETE /user/:id/delete` → Delete a user.  

### 💳 Subscription Routes (`/api/v1/subscriptions`)

- `GET /all` → Get all subscriptions (for logged-in user).  
- `GET /:id` → Get subscription details by ID.  
- `POST /create` → Create a new subscription.  
- `PUT update/:id` → Update subscription by ID.  
- `DELETE delete/:id` → Delete subscription by ID.  
- `GET /user/:id` → Get all subscriptions for a specific user.  
- `PUT /:id/cancel` → Cancel a subscription by ID.  
- `GET /user/:id/upcoming-renewals` → Get upcoming renewals for a specific user.  


### 🔔 Workflow Routes (`/api/v1/workflows`)  
- `POST subscription/reminder` → Trigger reminders for a subscription.  

---


