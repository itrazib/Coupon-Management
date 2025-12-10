# Coupon Management System — Assignment B

A backend service for managing e-commerce coupons.  
The system allows creating coupons with detailed eligibility rules and provides an API that returns the **best applicable coupon** for a given user + cart input.  
Built using **Node.js**, **Express**, and **MongoDB Native Driver**.

---

## 📌 1. Project Overview  
This project implements a simplified coupon engine for e-commerce platforms.  
It supports:
- Creating coupons with rules (user + cart eligibility).  
- Checking all available coupons and selecting the **best one** using a deterministic ranking system.  
- Tracking coupon usage per user (usageLimitPerUser).  
- Fully functional REST API with MongoDB persistence.

---

## 🛠 2. Tech Stack
- **Node.js (v18+)**
- **Express.js**
- **MongoDB Atlas** (MongoDB Native Driver — no ORM/Mongoose)
- **dotenv** for environment variables
- **Nodemon** for development

---

## ⚙️ 3. How to Run

### **Prerequisites**
- Node.js 18+
- npm installed
- A MongoDB Atlas cluster (or local MongoDB)
- Git installed

---

### **Setup Steps**
Clone the repository:

```bash
git clone https://github.com/your-username/coupon-management.git
cd coupon-management
