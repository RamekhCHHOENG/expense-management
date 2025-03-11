1. Features to Include
   🔹 User Authentication – Login/signup with email or social auth.
   🔹 Dashboard – A summary of total income, expenses, and savings.
   🔹 Expense Categories – Food, Transport, Bills, Shopping, etc.
   🔹 Transaction Management – Add, edit, delete expenses/income.
   🔹 Charts & Analytics – Pie charts for category-wise spending, bar graphs for trends.
   🔹 Monthly Budgeting – Set limits per category.
   🔹 Recurring Expenses – Auto-add rent, subscriptions, etc.
   🔹 Export Data – Download reports in CSV/PDF.

2. Tech Stack
   ✅ Frontend: Nuxt 3 (Vue.js) + Shadcn Vue
   ✅ State Management: Pinia
   ✅ UI Components: Your own UI components
   ✅ Backend: Supabase (PostgreSQL) or Firebase
   ✅ Authentication: Supabase Auth or Firebase Auth
   ✅ Charts: shadcn vue chart
   ✅ Storage: LocalStorage for quick save, backend DB for persistence

Firebase Config
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyBcpxqsx5fhi5Iiis7LS0YJHQY1Q8ClJes",
authDomain: "expense-management-b84bc.firebaseapp.com",
projectId: "expense-management-b84bc",
storageBucket: "expense-management-b84bc.firebasestorage.app",
messagingSenderId: "721998265859",
appId: "1:721998265859:web:cc220b9a328b40d952d836",
measurementId: "G-NT7GQ1P5M6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//Note

- remember to use shadcn vue and make ui elegent for modern beautiful and functionality
- make all component reusable and store neccessary constant in constant folder.
- use bun as always

//Shadcnvue document
https://www.shadcn-vue.com/
