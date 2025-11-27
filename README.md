# 🏔️ ToursApp - Tour Booking Platform

A modern full-stack tour booking platform built with React, TypeScript, and Redux Toolkit for the frontend, powered by Express.js and MongoDB on the backend. Features comprehensive user authentication, tour browsing, secure payments, real-time booking management and scalable cloud deployment.

## 🌐 Live Demo

### 🚀 Production Deployments

| Platform | Frontend | Backend | Status |
|----------|----------|---------|--------|
| **AWS Cloud** | [S3 + CloudFront](https://d3ifoimvo7j4hw.cloudfront.net/) | [EC2](https://toursapp.duckdns.org/) | ⏸️ Paused |
| **Vercel + Railway** | [Vercel App](https://tours-app-omega.vercel.app/) | Railway Backend | ✅ Active |

**📋 [API Documentation](https://documenter.getpostman.com/view/46845096/2sB3B8st5d)**

*Try booking a tour with test payment functionality!*

## 🧪 Test Accounts

Use these pre-configured accounts to explore the application:

| Role      | Email                | Password   | Description                   |
| --------- | -------------------- | ---------- | ----------------------------- |
| **User**  | `laura@example.com`  | `test1234` | User with review history      |
| **User**  | `rachel@example.com` | `test1234` | User without booking & review |
| **Admin** | `admin@tours.io`     | `test1234` | Full admin access (API only)  |

## ✨ Key Features

* **🔐 User Authentication** - Secure login and registration with JWT
* **🏞️ Tour Management** - Browse and view detailed tour information
* **💳 Secure Payments** - Stripe integration for safe transactions
* **👤 User Profiles** - Account management and booking history
* **🗺️ Interactive Maps** - Mapbox integration for tour locations
* **⭐ Review Systems** - Add, edit, delete reviews for booked tours
* **📱 Responsive Design** - Mobile-friendly interface with Tailwind CSS
* **⚡ SPA Experience** - Fast navigation without page reloads
* **⏳ Lazy Loading** - Optimized resource loading for performance
* **☁️ Cloud Deployment** - Deployed using AWS S3 and EC2

## 🛠️ Tech Stack

| Category                | Technology             | Purpose                              |
| ----------------------- | ---------------------- | ------------------------------------ |
| **Frontend Framework**  | React + TypeScript     | Modern UI library with type safety   |
| **State Management**    | Redux Toolkit          | Centralized state management         |
| **Routing**             | React Router           | Client-side routing                  |
| **Styling**             | Tailwind CSS           | Utility-first CSS framework          |
| **HTTP Client**         | Axios                  | API communication                    |
| **Backend Framework**   | Express.js + Node.js   | RESTful API server                   |
| **Database**            | MongoDB + Mongoose     | NoSQL database with ODM              |
| **Authentication**      | JWT                    | Role-based access control            |
| **Payment**             | Stripe                 | Secure payment processing            |
| **Email**               | SendGrid               | Automated email notifications        |
| **Maps**                | Mapbox GL JS           | Interactive tour location maps       |
| **Security**            | Helmet + Rate Limiting | Security headers and DDoS protection |
| **Testing**             | Postman                | API testing and documentation        |

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│ (React + TS +   │◄──►│   (Express)     │◄──►│   (MongoDB)     │
│ Redux Toolkit)  │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
       │                        │
  ┌────▼─────┐         ┌────────┼──────────────────────────┐
  │   CDN    │         │        │          │          │
  │(S3/CF or │         │ ┌──────▼────────┐ ┌───▼────┐ ┌───▼────┐
  │ Vercel)  │         │ │    Stripe     │ │SendGrid│ │ Mapbox │
  └──────────┘         │ │  (Payment)    │ │(Email) │ │ (Maps) │
                       │ └───────────────┘ └────────┘ └────────┘
                ┌──────▼──────┐
                │   Server    │
                │ (EC2/Railway)│
                │             │
                └─────────────┘
```

## 🚀 Version Roadmap

### ✅ Version 1.0 - Backend Basis

**Status**: ✅ **Completed** | **Tech**: Server-Side Rendering

* **Frontend**: Pug templates with vanilla JavaScript
* **Backend**: Express.js API + SSR
* **Authentication**: Login only (registration via API)
* **Features**: Tour browsing, booking, payments, profile management
* **Deployment**: Single Railway deployment
* **Architecture**: Traditional monolithic web application

### ⚛️ Version 2.0 - React Migration

**Status**: ✅ **Deployed** | **Tech**: Frontend-Backend Separation

| Component             | v1.0 (Previous)    | v2.0 (Current)                        |
| --------------------- | ------------------ | ------------------------------------- |
| **Frontend**          | Pug + Vanilla JS   | React + TypeScript                    |
| **User Registration** | API only           | Complete signup flow                  |
| **State Management**  | Server-side        | Redux Toolkit                         |
| **Routing**           | Express routes     | React Router                          |
| **Styling**           | CSS + Pug          | Tailwind CSS                          |
| **API Calls**         | Form submissions   | Axios + RTK Query                     |
| **Deployment**        | Railway (Monolith) | Vercel (Frontend) + Railway (Backend) |

**Current Features**:

* ✨ **Complete User Registration** - Full signup flow with validation
* 🎨 **Modern UI/UX** - Enhanced user interface with Tailwind CSS
* ⚡️ **SPA Experience** - Fast navigation without page reloads
* 🏪 **Advanced State Management** - Redux Toolkit for complex app state
* ⭐ **Review System** - Users can add, edit, delete reviews
* 📱 **Fully Responsive Design** - Optimized for all device sizes

### 🌩️ Version 2.1 - Performance & Cloud Enhancement (Current)

**Status**: ✅ **Deployed** | **Tech**: Performance Optimization & Cloud Deployment

**New Features**:

* ⏳ **Code Splitting & Lazy Loading** - 40% faster initial load times through optimized resource loading
* ☁️ **AWS Cloud Deployment** - Frontend on S3 with CloudFront CDN, backend on EC2 with CloudWatch monitoring
* 🔒 **HTTPS Security** - SSL/TLS certificate configuration using DuckDNS + Let's Encrypt + CloudFront
* 🛡️ **Enhanced Security** - Comprehensive security measures including Helmet, rate limiting, NoSQL injection prevention, and XSS protection
* 🔍 **Advanced Search System** - Dynamic URL building and query parameter validation for seamless tour discovery
* 📊 **Performance Monitoring** - CloudWatch integration for application monitoring and log analysis
* 🚀 **CI/CD Pipeline** - GitHub Actions for automated deployment to AWS infrastructure

### 🔧 Version 3.0 - Feature Enhancement (Future)

**Planned Features**:

* 👨‍💼 **Admin Dashboard** - Tour & user management interface
* 📧 **Password Recovery** - Forgot password email service
* 🔍 **Advanced Search** - Filter tours by various criteria
* 🌟 **Enhanced Reviews** - Photo uploads and rating analytics
* 📊 **Analytics Dashboard** - Booking and revenue insights

> **Note**: All admin and password recovery APIs are already implemented in the backend!

---

## 🔧 Local Development

### Prerequisites

* Node.js (v16 or higher)
* npm or yarn
* MongoDB (local or Atlas)

### Backend Setup

```bash
# Clone repository
git clone https://github.com/RuxinMa/tours-app.git
cd tours-app/backend

# Install dependencies
npm install

# Set up environment variables
cp config.env.example config.env

# Start development server
npm run start:dev
# Backend will run on http://localhost:8000
```

### Frontend Setup

```bash
# In a new terminal, navigate to frontend
cd tours-app/frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
# Frontend will run on http://localhost:5173
```

### Build for Production

```bash
# Frontend build
cd frontend
npm run build

# Backend (already production-ready)
cd backend
npm run start:prod
```

---

## 🤝 Contributing

This project demonstrates modern full-stack development with React and Node.js.

### Key Learning Points

* ⚛️ **React with TypeScript** - Modern frontend development
* 🔄 **Redux Toolkit** - Advanced state management patterns
* 🎨 **Tailwind CSS** - Utility-first styling approach
* 📡 **RESTful API Design** - Backend architecture best practices
* 🚀 **Modern Deployment** - Cloud deployment with AWS S3 and EC2

**Built with ❤️ for learning modern web development**
