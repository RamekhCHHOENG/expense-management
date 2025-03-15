export interface ExpenseShare {
    userId: string;
    userName: string;
    amount: number;
}

export interface Expense {
    id?: string;
    date: string;
    house: number;
    electricity: number;
    water: number | null;
    waste: number | null;
    additional: number | null;
    shares: ExpenseShare[];
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
    shares: ExpenseShare[];
}
