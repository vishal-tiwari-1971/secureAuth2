# Canara Suraksha Hackathon Project

A modern, secure net-banking dashboard with fraud detection, transaction visualization, and user authentication.

---

## 🚀 Features
- Secure authentication with JWT and sessions
- Send money via UPI simulation
- Transaction feed and anomaly alerts
- Interactive world map with transaction clustering
- Device, IP, and location tracking for each transaction
- Responsive, modern UI

---

## 🛠️ Installation & Setup

### 1. **Clone the repository**
```sh
git clone https://github.com/ryzrr/secureAuth2.0.git
cd secureAuth2.0
```

### 2. **Install dependencies**
```sh
cd secureAuth
npm install
```

### 3. **Set up environment variables**
- Copy `.env.example` to `.env` and fill in the required values (e.g., `DATABASE_URL`, JWT secret, etc.)

### 4. **Set up the database**
- Run Prisma migrations to set up your database schema:
```sh
npx prisma migrate dev
```
- Generate the Prisma client:
```sh
npx prisma generate
```

### 5. **Start the development server**
```sh
npm run dev
```
- The app will be available at `http://localhost:3000`

---

## 🏭 Production Build
```sh
npm run build
npm start
```

---

## 🗺️ Notes
- The interactive transaction map uses browser geolocation for accurate plotting.
- On localhost, IP-based location may be unavailable; browser geolocation is preferred.
- All sensitive config should be kept in `.env` and **never** committed to version control.

---

## 🤝 Contributing
Pull requests and suggestions are welcome!

---

## 📄 License
MIT
