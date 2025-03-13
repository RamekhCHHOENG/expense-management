export interface Expense {
    id?: string;
    date: string;
    house: number;
    totalElect: number | null;
    rtAcFridge: number | null;
    pheaFridge: number | null;
    mining: number | null;
    electricity: number;
    water: number | null;
    waste: number | null;
    additional: number | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface FirestoreExpense {
    date: string;
    house: string;
    totalElect: string;
    rtAcFridge: string;
    pheaFridge: string;
    mining: string;
    electricity: string;
    water: string;
    waste: string;
    additional: string;
    createdAt?: Date;
    updatedAt?: Date;
}
