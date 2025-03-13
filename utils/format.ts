export const formatNumber = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) return "-";
    return Number(value).toFixed(2);
};
