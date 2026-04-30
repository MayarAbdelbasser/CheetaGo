# 🐆 CheetaGo

A fast and modern shipping web application that allows users to create shipments, get price estimates, and track their packages in real time.

---

## ✨ Features

- **Shipment Creation** - Enter sender/recipient addresses with an interactive map, select package type, and get an instant price estimate before confirming.
- **Real-Time Tracking** - Track any shipment using a tracking number and view its delivery status (Created → Out for Delivery → Delivered).
- **Admin Dashboard** - View and manage all shipments in one place.
- **Authentication** - Secure sign-in and sign-up flows.
- **Responsive UI** - Mobile-friendly layout built with Tailwind CSS.

---

## 🛠️ Tech Stack

| Layer      | Technology           |
| ---------- | -------------------- |
| Backend    | Python / Flask       |
| Templating | Jinja2               |
| Styling    | Tailwind CSS v4      |
| Map        | Leaflet.js           |
| Icons      | Lucide               |
| Alerts     | SweetAlert2          |
| Font       | Inter (Google Fonts) |

---

## 📁 Project Structure

```
cheetago/
├── static/
│   ├── css/
│   │   └── output.css        # Compiled Tailwind CSS
│   ├── js/
│   │   ├── auth.js
│   │   ├── signin.js
│   │   ├── signup.js
│   │   ├── validator.js
│   │   ├── script.js
│   │   ├── tracking.js
│   │   ├── shipping.js
│   │   ├── dashboard.js
│   │   ├── getPrice.js
│   │   ├── api.js
│   │   └── alert.js
│   └── images/
│       └── cheeta.png
├── templates/
│   ├── layout.html
│   ├── trackingPage.html
│   ├── shippingPage.html
│   ├── navbar.html
│   ├── footer.html
│   ├── homePage/
│   │   ├── index.html
│   │   ├── header.html
│   │   └── about.html
│   └── dashboard/
│       └── dashboard.html
│       └── shipmentsTable.html
│       └── shipmentRow.html
│       └── tableHeader.html

├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.x
- Node.js & npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/cheetago.git
   cd cheetago
   ```

2. **Install Python dependencies**

   ```bash
   pip install flask
   ```

3. **Install Node dependencies & build CSS**

   ```bash
   npm install
   npx tailwindcss -i ./static/src/input.css -o ./static/css/output.css --watch
   ```

4. **Run the Flask app**

   ```bash
   flask --app app.py  run
   ```

5. Open your browser and go to `http://localhost:5000`

---

## 📄 Pages

| Route        | Description                |
| ------------ | -------------------------- |
| `/`          | Home / Landing page        |
| `/signin`    | Signin page                |
| `/signup`    | Signup page                |
| `/shipping`  | Create a new shipment      |
| `/tracking`  | Track an existing shipment |
| `/dashboard` | Admin shipments dashboard  |

---

## 📦 Dependencies

```json
{
  "devDependencies": {
    "@tailwindcss/cli": "^4.2.4",
    "tailwindcss": "^4.2.4"
  },
  "dependencies": {
    "lucide": "^1.8.0"
  }
}
```

---

## 📝 License

This project is licensed under the [ISC License](LICENSE).
