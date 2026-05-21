# 🏥 MediBook — Doctor Appointment Booking System

A production-ready, full-stack **MERN** application for booking doctor appointments online with role-based dashboards for **Patients**, **Doctors**, and **Admins**.

## 🚀 Live Demo

🌐 **Frontend (Vercel)**  
👉 https://appointment-booking-system-two-pi.vercel.app/

⚙️ **Backend (Render API)**  
👉 https://appointment-booking-system-6swr.onrender.com

---

<img width="1917" height="829" alt="image" src="https://github.com/user-attachments/assets/af5bb054-5a06-4607-bc2a-3dd0ec237177" />
<img width="1911" height="825" alt="image" src="https://github.com/user-attachments/assets/fdb5083e-009d-4565-b53c-a4138923fc2c" />
<img width="1919" height="830" alt="image" src="https://github.com/user-attachments/assets/5290537e-ff5d-40bd-9985-551741067b66" />
<img width="1919" height="832" alt="image" src="https://github.com/user-attachments/assets/f4fa4a62-a552-49c0-b39a-406ce59273c0" />
<img width="1891" height="800" alt="image" src="https://github.com/user-attachments/assets/25d87e25-4af1-4ef7-b10f-847e0be48235" />






## ⚡ Tech Stack

| Layer          | Technology                                  |
| -------------- | ------------------------------------------- |
| **Frontend**   | React 18, Vite, Tailwind CSS, React Router  |
| **Backend**    | Node.js, Express.js                         |
| **Database**   | MongoDB with Mongoose                       |
| **Auth**       | JWT (JSON Web Tokens)                       |
| **Payments**   | Stripe (test mode, with simulation fallback)|
| **State**      | React Context API                           |
| **HTTP**       | Axios with interceptors                     |

---

## 📂 Folder Structure

```
Appointment booking/
├── server/                    # Backend API
│   ├── config/db.js           # MongoDB connection
│   ├── controllers/           # Route handlers
│   ├── middleware/             # Auth, role, error, validation
│   ├── models/                # Mongoose schemas
│   ├── routes/                # Express routers
│   ├── utils/                 # JWT helper
│   ├── server.js              # Entry point
│   └── .env                   # Environment variables
│
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Navbar, Footer, ProtectedRoute, Loading
│   │   ├── context/           # AuthContext
│   │   ├── hooks/             # useAuth
│   │   ├── pages/             # All page components
│   │   │   ├── patient/       # Patient dashboard pages
│   │   │   ├── doctor/        # Doctor dashboard pages
│   │   │   └── admin/         # Admin dashboard pages
│   │   ├── services/api.js    # Axios API layer
│   │   ├── App.jsx            # Router
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and **npm**
- **MongoDB** (local install or [MongoDB Atlas](https://www.mongodb.com/atlas))
- (Optional) **Stripe** test API keys

### 1. Clone / Navigate

```bash
cd "Appointment booking"
```

### 2. Backend Setup

```bash
cd server
npm install
```

Edit `.env` with your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/doctor-appointment
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_your_key   # optional
CLIENT_URL=http://localhost:5173
```

Start the server:

```bash
npm run dev
```

> Server runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

> App runs on `http://localhost:5173`

### 4. Create Admin User

Send a POST request to create an admin:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@medibook.com","password":"admin123","role":"admin"}'
```

Or use the Register page and manually change the role in MongoDB to `admin`.

---

## 🔑 API Endpoints

| Method | Endpoint                    | Auth     | Description               |
| ------ | --------------------------- | -------- | ------------------------- |
| POST   | `/api/auth/register`        | Public   | Register user             |
| POST   | `/api/auth/login`           | Public   | Login                     |
| GET    | `/api/auth/me`              | JWT      | Current user profile      |
| PUT    | `/api/auth/profile`         | JWT      | Update profile            |
| GET    | `/api/doctors`              | Public   | List doctors (search/filter) |
| GET    | `/api/doctors/:id`          | Public   | Doctor details            |
| POST   | `/api/doctors`              | Admin    | Add doctor                |
| PUT    | `/api/doctors/:id`          | Doctor/Admin | Update doctor          |
| DELETE | `/api/doctors/:id`          | Admin    | Remove doctor             |
| POST   | `/api/appointments`         | Patient  | Book appointment          |
| GET    | `/api/appointments`         | JWT      | List appointments (role-based) |
| PUT    | `/api/appointments/:id`     | JWT      | Update status             |
| DELETE | `/api/appointments/:id`     | JWT      | Delete appointment        |
| POST   | `/api/payments/create`      | Patient  | Create payment            |
| POST   | `/api/payments/verify`      | Patient  | Verify payment            |
| GET    | `/api/admin/stats`          | Admin    | Platform statistics       |
| GET    | `/api/admin/users`          | Admin    | List all users            |
| DELETE | `/api/admin/users/:id`      | Admin    | Delete user               |

---

## 🎨 Features

- ✅ JWT authentication with role-based authorization
- ✅ 3 dashboards: Patient, Doctor, Admin
- ✅ Doctor search & filter by specialization
- ✅ Multi-step appointment booking with time slots
- ✅ Stripe payment integration (with simulation fallback)
- ✅ Accept/Reject/Complete appointment workflow
- ✅ Doctor availability management
- ✅ Earnings tracking for doctors
- ✅ Admin stats & platform monitoring
- ✅ Responsive design with Tailwind CSS
- ✅ Premium glassmorphism UI with animations
- ✅ Toast notifications & loading states
- ✅ Axios interceptors for auto-auth

---

## 📄 License

MIT
