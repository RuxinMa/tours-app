# 🏔️ ToursApp - Tour Booking Platform

A full-stack tour booking web application built with Node.js, Express, and MongoDB. Features user authentication, tour browsing, secure payments, and email notifications.

## 🌐 Live Demo

**🚀 [Experience the App](toursapp-production.up.railway.app)**

**📋 [API Documentation](documenter.getpostman.com/view/46845096/2sB3B8st5d)**

*Try booking a tour with test payment functionality!*

## ✨ Key Features

- **🔐 User Authentication** - Secure login with JWT
- **🏞️ Tour Management** - Browse and view detailed tour information
- **💳 Secure Payments** - Stripe integration for safe transactions
- **📧 Email Notifications** - Automated booking confirmations
- **👤 User Profiles** - Account management and booking history
- **🗺️ Interactive Maps** - Mapbox integration for tour locations
- **📱 Responsive Design** - Mobile-friendly interface

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Runtime** | Node.js | Server-side JavaScript runtime |
| **Framework** | Express.js | Web application framework |
| **Database** | MongoDB + Mongoose | NoSQL database with ODM |
| **Authentication** | JWT | Secure user authentication |
| **Payment** | Stripe | Credit card processing |
| **Email** | SendGrid | Automated email notifications |
| **File Upload** | Multer + Sharp | Image processing and storage |
| **Template Engine** | Pug | Server-side HTML rendering |
| **Frontend JS** | Vanilla JavaScript + Axios | Client-side interactions |
| **Maps** | Mapbox GL JS | Interactive tour location maps |
| **Security** | Helmet + Rate Limiting | Security headers and DDoS protection |
| **Development** | ESLint + Prettier + Nodemon | Code quality and development workflow |
| **API Testing** | Postman | API documentation and testing |
| **Deployment** | Railway + MongoDB Atlas | Cloud hosting and database |


## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Pug + JS)    │◄──►│   (Express)     │◄──►│   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                    ┌─────────┼─────────┐
                    │         │         │
            ┌───────▼───┐ ┌───▼────┐ ┌───▼────┐
            │  Stripe   │ │SendGrid│ │ Mapbox │
            │ (Payment) │ │(Email) │ │ (Maps) │
            └───────────┘ └────────┘ └────────┘
```

## 🚀 Version Roadmap

### 🎯 Version 1.0 - Current 
**Status**: ✅ **Deployed** | **Tech**: Server-Side Rendering

- **Frontend**: Pug templates with vanilla JavaScript
- **Backend**: Express.js API + SSR
- **Deployment**: Single Railway deployment
- **Architecture**: Traditional monolithic web application


### ⚛️ Version 2.0 - React Migration (Planned)
**Status**: 🚧 **In Planning** | **Tech**: Frontend-Backend Separation

| Component | v1.0 (Current) | v2.0 (Planned) |
|-----------|----------------|----------------|
| **Frontend** | Pug + Vanilla JS | React + TypeScript |
| **State Management** | Server-side | Redux Toolkit |
| **Routing** | Express routes | React Router |
| **Styling** | CSS + Pug | Styled Components / Tailwind |
| **API Calls** | Form submissions | Axios + React Query |
| **Deployment** | Railway (Monolith) | Vercel (Frontend) + Railway (API) |

**Benefits**: Better UX, faster navigation, modern development experience

---

## 🔧 Local Development

```bash
# Clone repository
git clone https://github.com/yourusername/tours-project.git

# Install dependencies
npm install

# Set up environment variables
cp config.env.example config.env
# Edit config.env with your API keys

# Start development server
npm run dev
```


## 🤝 Contributing

This project is part of a learning journey. Feel free to explore the code and suggest improvements!

---

**Built with ❤️ for learning modern web development**