import { initializeApp } from "firebase/app";
import {
    addDoc,
    collection,
    getDocs,
    getFirestore,
    serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBcpxqsx5fhi5Iiis7LS0YJHQY1Q8ClJes",
    authDomain: "expense-management-b84bc.firebaseapp.com",
    projectId: "expense-management-b84bc",
    storageBucket: "expense-management-b84bc.firebasestorage.app",
    messagingSenderId: "721998265859",
    appId: "1:721998265859:web:cc220b9a328b40d952d836",
    measurementId: "G-NT7GQ1P5M6",
};

const OLD_COLLECTION = "rentalhouse payment";
const NEW_COLLECTION = "rental-expenses";

async function migrateExpenses() {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    try {
        // Get all documents from old collection
        const querySnapshot = await getDocs(collection(db, OLD_COLLECTION));

        console.log(`Found ${querySnapshot.size} documents to migrate`);

        // Migrate each document
        for (const doc of querySnapshot.docs) {
            const data = doc.data();

            // Add document to new collection
            await addDoc(collection(db, NEW_COLLECTION), {
                ...data,
                // Update timestamps
                createdAt: data.createdAt || serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            console.log(`Migrated document ${doc.id}`);
        }

        console.log("Migration completed successfully!");
    } catch (error) {
        console.error("Error during migration:", error);
    }
}

// Run the migration
migrateExpenses();
