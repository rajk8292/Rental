# Bartan Rental System (MERN Stack)

A complete MERN stack web application for renting utensils for events like weddings, parties, and corporate events. By the requirements, this system manages the inventory of utensils, allowing users to rent them based on availability, auto-calculates total price for dates, and provides an admin dashboard for full inventory and booking control.

## 🛠️ Tech Stack
- Frontend: React.js, Tailwind CSS, Vite
- Backend: Node.js, Express.js
- Database: MongoDB via Mongoose
- Payments: Razorpay Integrated
- Authentication: JWT

## 📂 Folder Structure

```
Rental/
│
├── backend/
│   ├── config/
│   │   └── db.js            # MongoDB Connection configuration
│   ├── controllers/         # Business logic functions (auth, utensils, bookings)
│   ├── middleware/          # Protected and Admin route middlewares
│   ├── models/              # Mongoose schema definitions
│   ├── routes/              # Express REST API routes
│   ├── .env                 # Environment variables
│   └── server.js            # Entry point for backend
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios API base configuration
│   │   ├── components/      # Reusable UI elements (Navbar, Cards)
│   │   ├── context/         # React Context API for Global Auth state
│   │   ├── pages/           # Page views (Home, Login, Register, MyBookings)
│   │   ├── App.jsx          # Router Setup
│   │   ├── main.jsx         # Entry point for React Application
│   │   └── index.css        # Tailwind initialization and base styles
│   ├── tailwind.config.js   # Tailwind framework configuration
│   └── index.html           # Injected Razorpay SDK
└── README.md
```

## 🚀 How To Run Locally

### Step 1. MongoDB Setup
Make sure you have MongoDB installed and running on default port `27017` locally, or change `MONGO_URI` inside `backend/.env` to your Mongo Atlas connection string.

### Step 2. Run Backend API
Open a terminal in the root folder.
```bash
cd backend
npm install
npm run dev # or: "node server.js"
```

### Step 3. Run Frontend App
Open **another** terminal window.
```bash
cd frontend
npm install
npm run dev
```

### Step 4. Check the application!
The backend should be running at `http://localhost:5000` and the frontend at `http://localhost:5173`.
To act as an admin, setup a user normally, and then change their `role` property in your MongoDB database directly to `'admin'`, or configure it inside the API payload directly.

## 💡 Top Features Provided
1. **Dynamic Real-Time Total Auto-Calculation**: Dates chosen by the user from the custom Datepicker compute `(EndDate - StartDate) * Quantity * Utensil_PerDay_Price` synchronously via React before initiating Axios backend bookings.
2. **Access-Based Admin Actionables**: Using our local JWT Strategy middleware, admin controllers are completely locked; the frontend `Dashboard.jsx` handles full CRUD operations across utensils, and updating `Pending/Approved/Rejected` booking status. 
3. **Razorpay Payments Form Integration**: A simple mocked/test Razorpay API handler flows sequentially from requesting order-ids locally to completing checkout using the official injected library inside `checkout.js`.
4. **Context Managed Authentication**: No complex redux is strictly required here; we built a performant standard state context via `AuthContext.jsx` to prevent continuous UI flashes and properly secure Private API queries.
