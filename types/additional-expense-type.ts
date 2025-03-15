export interface AdditionalExpenseType {
    id?: string;
    name: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface FirestoreAdditionalExpenseType {
    name: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
}
