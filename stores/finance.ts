import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { defineStore } from 'pinia';

export interface Transaction {
    id?: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description: string;
    date: Date;
    userId: string;
}

export const useFinanceStore = defineStore('finance', {
    state: () => ({
        transactions: [] as Transaction[],
        loading: false,
        error: null as string | null,
    }),

    getters: {
        totalIncome: (state) => {
            return state.transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
        },
        totalExpenses: (state) => {
            return state.transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
        },
        netSavings: (state) => {
            return state.transactions.reduce((sum, t) => {
                return sum + (t.type === 'income' ? t.amount : -t.amount);
            }, 0);
        },
    },

    actions: {
        async fetchTransactions() {
            const { $firestore, $auth } = useNuxtApp();
            if (!$firestore || !$auth?.currentUser) return;

            try {
                this.loading = true;
                this.error = null;
                
                const q = query(
                    collection($firestore, 'transactions'),
                    where('userId', '==', $auth.currentUser.uid)
                );
                
                const querySnapshot = await getDocs(q);
                this.transactions = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    date: new Date(doc.data().date.seconds * 1000),
                } as Transaction));
            } catch (error: any) {
                console.error('Error fetching transactions:', error);
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },

        async addTransaction(transaction: Omit<Transaction, 'id' | 'userId'>) {
            const { $firestore, $auth } = useNuxtApp();
            if (!$firestore || !$auth?.currentUser) return;

            try {
                this.loading = true;
                this.error = null;

                const newTransaction = {
                    ...transaction,
                    userId: $auth.currentUser.uid,
                    date: new Date(),
                };

                const docRef = await addDoc(
                    collection($firestore, 'transactions'),
                    newTransaction
                );

                this.transactions.push({
                    ...newTransaction,
                    id: docRef.id,
                });
            } catch (error: any) {
                console.error('Error adding transaction:', error);
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateTransaction(id: string, updates: Partial<Transaction>) {
            const { $firestore } = useNuxtApp();
            if (!$firestore) return;

            try {
                this.loading = true;
                this.error = null;

                const transactionRef = doc($firestore, 'transactions', id);
                await updateDoc(transactionRef, updates);

                const index = this.transactions.findIndex(t => t.id === id);
                if (index !== -1) {
                    this.transactions[index] = {
                        ...this.transactions[index],
                        ...updates,
                    };
                }
            } catch (error: any) {
                console.error('Error updating transaction:', error);
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteTransaction(id: string) {
            const { $firestore } = useNuxtApp();
            if (!$firestore) return;

            try {
                this.loading = true;
                this.error = null;

                await deleteDoc(doc($firestore, 'transactions', id));
                this.transactions = this.transactions.filter(t => t.id !== id);
            } catch (error: any) {
                console.error('Error deleting transaction:', error);
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
}); 