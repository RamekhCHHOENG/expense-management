export interface ExpenseUser {
    id: string;
    name: string;
    email: string;
    amount: number;
    electricityShare: number;
}

export interface Expense {
    id?: string;
    date: string;
    house: number;
    electricity: number;
    water: number | null;
    waste: number | null;
    additional: number | null;
    users: ExpenseUser[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface FirestoreExpense {
    date: string;
    house: string;
    electricity: string;
    water: string;
    waste: string;
    additional: string;
    users: ExpenseUser[];
}
