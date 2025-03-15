# Expense Management System

A modern, feature-rich expense management application built with Nuxt 3 and Shadcn Vue, designed to help users track and manage their finances effectively.

## 🚀 Features

- **User Authentication**

    - Email/password login and registration
    - Social authentication options
    - Secure session management

- **Dashboard**

    - Comprehensive financial overview
    - Total income, expenses, and savings summary
    - Quick actions for common tasks

- **Expense Management**

    - Categorized expense tracking (Food, Transport, Bills, Shopping, etc.)
    - Full CRUD operations for transactions
    - Bulk operations support

- **Smart Analytics**

    - Interactive charts and graphs
    - Category-wise spending analysis
    - Monthly/yearly trends
    - Custom date range reports

- **Budget Planning**

    - Category-wise budget limits
    - Budget alerts and notifications
    - Progress tracking

- **Recurring Transactions**

    - Automated recurring expense tracking
    - Subscription management
    - Payment reminders

- **Data Export**
    - CSV/PDF report generation
    - Custom report templates
    - Data backup options

## 🛠️ Tech Stack

- **Frontend Framework**

    - [Nuxt 3](https://nuxt.com/) - Vue.js Framework
    - [Shadcn Vue](https://www.shadcn-vue.com/) - UI Component Library

- **State Management**

    - [Pinia](https://pinia.vuejs.org/) - Vue Store

- **Backend & Authentication**

    - [Firebase](https://firebase.google.com/)
        - Authentication
        - Realtime Database
        - Cloud Functions
        - Analytics

- **Development Tools**
    - [Bun](https://bun.sh/) - JavaScript runtime & package manager
    - [TypeScript](https://www.typescriptlang.org/) - Type safety
    - [ESLint](https://eslint.org/) - Code linting
    - [Prettier](https://prettier.io/) - Code formatting

## 📦 Project Structure

```
expense-management/
├── components/           # Reusable Vue components
│   ├── ui/              # Shadcn Vue components
│   ├── features/        # Feature-specific components
│   └── shared/          # Shared components
├── composables/         # Vue composables
├── constants/           # Application constants
├── layouts/             # Page layouts
├── pages/              # Application pages
├── stores/             # Pinia stores
├── types/              # TypeScript types
└── utils/              # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Bun >= 1.0.0
- Node.js >= 18.x
- Firebase account

### Installation

1. Clone the repository

    ```bash
    git clone https://github.com/yourusername/expense-management.git
    cd expense-management
    ```

2. Install dependencies

    ```bash
    bun install
    ```

3. Set up environment variables

    ```bash
    cp .env.example .env
    ```

4. Configure Firebase

    ```javascript
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBcpxqsx5fhi5Iiis7LS0YJHQY1Q8ClJes",
        authDomain: "expense-management-b84bc.firebaseapp.com",
        projectId: "expense-management-b84bc",
        storageBucket: "expense-management-b84bc.firebasestorage.app",
        messagingSenderId: "721998265859",
        appId: "1:721998265859:web:cc220b9a328b40d952d836",
        measurementId: "G-NT7GQ1P5M6",
    };
    ```

5. Start the development server
    ```bash
    bun dev
    ```

## 🔧 Development Guidelines

- Use Shadcn Vue components for consistent UI/UX
- Follow component-driven development
- Store constants in the `constants` folder
- Break down features into small, reusable components
- Maintain proper TypeScript types
- Follow the established folder structure

## �� Documentation

- [Shadcn Vue Documentation](https://www.shadcn-vue.com/)
- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Pinia Documentation](https://pinia.vuejs.org/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
