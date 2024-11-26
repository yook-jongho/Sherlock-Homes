export const formatCurrency = (amount) => {
    let numericAmount = parseInt(amount.replace(/,/g, ""), 10) * 10000;

    if (numericAmount >= 100000000) {
        const billion = Math.floor(numericAmount / 100000000);
        const remainder = numericAmount % 100000000;
        const million = Math.floor(remainder / 10000);
        return million > 0 ? `${billion}억 ${million}만` : `${billion}억`;
    } else if (numericAmount >= 10000) {
        return `${Math.floor(numericAmount / 10000)}`;
    } else {
        return `${numericAmount.toLocaleString()}원`;
    }
};

export const squareMeterToPyeong = (squareMeter) => {
    const conversionRate = 3.305785; // 1평 = 3.305785 제곱미터
    return (squareMeter / conversionRate).toFixed(1);
};