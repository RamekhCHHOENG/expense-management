import { Timestamp } from "firebase/firestore";

export interface ExpenseUser {
    id: string;
    name: string;
    email: string;
    amount: number;
    electricityShare: number;
    additionalExpenseType: string | null;
    additionalAmount: number | null;
    room: string;
}

export interface Expense {
    id?: string;
    date: Timestamp;
    house: number;
    electricity: number;
    totalElect?: number | null;
    rtAcFridge?: number | null;
    pheaFridge?: number | null;
    mining?: number | null;
    water?: number | null;
    waste?: number | null;
    additional?: number | null;
    users: ExpenseUser[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface FirestoreExpense {
    date: string;
    house: string;
    electricity: string;
    totalElect?: string;
    rtAcFridge?: string;
    pheaFridge?: string;
    mining?: string;
    water: string;
    waste: string;
    additional: string;
    users: ExpenseUser[];
}
