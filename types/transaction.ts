import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "~/constants/categories";

export interface Transaction {
    id?: string;
    description: string;
    amount: number;
    type: "income" | "expense";
    category: string;
    date: string;
}

// Re-export categories for convenience
export { EXPENSE_CATEGORIES, INCOME_CATEGORIES };
