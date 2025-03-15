/**
 * Composable for transaction formatting utilities
 */
export function useTransactionFormat() {
    /**
     * Format a date string to a localized date
     * @param dateString - The date string to format
     * @returns Formatted date string
     */
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    /**
     * Format an amount to a currency string
     * @param amount - The amount to format
     * @param currency - The currency code (default: USD)
     * @returns Formatted currency string
     */
    const formatAmount = (amount: number, currency = "USD") => {
        return amount.toLocaleString("en-US", {
            style: "currency",
            currency,
            minimumFractionDigits: 2,
        });
    };

    /**
     * Capitalize the first letter of a string
     * @param str - The string to capitalize
     * @returns Capitalized string
     */
    const capitalize = (str: string) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    /**
     * Convert a Date object to an ISO date string (YYYY-MM-DD)
     * @param date - The date to convert
     * @returns ISO date string
     */
    const toISODateString = (date: Date) => {
        return date.toISOString().split("T")[0];
    };

    return {
        formatDate,
        formatAmount,
        capitalize,
        toISODateString,
    };
}
