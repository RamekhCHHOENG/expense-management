export const formatNumber = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) return "-";
    return Number(value).toFixed(2);
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};
