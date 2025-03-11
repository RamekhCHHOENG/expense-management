import { defineNuxtPlugin } from "#app";
import { initializeApp } from "firebase/app";

export default defineNuxtPlugin(() => {
    const firebaseConfig = {
        apiKey: "AIzaSyBcpxqsx5fhi5Iiis7LS0YJHQY1Q8ClJes",
        authDomain: "expense-management-b84bc.firebaseapp.com",
        projectId: "expense-management-b84bc",
        storageBucket: "expense-management-b84bc.firebasestorage.app",
        messagingSenderId: "721998265859",
        appId: "1:721998265859:web:cc220b9a328b40d952d836",
        measurementId: "G-NT7GQ1P5M6",
    };

    // Initialize Firebase
    const firebaseApp = initializeApp(firebaseConfig);

    return {
        provide: {
            firebase: firebaseApp,
        },
    };
});
