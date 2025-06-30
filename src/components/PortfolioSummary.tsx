'use client';

type PortfolioSummaryProps = {
    totalInvestment: number;
    totalPresentValue: number;
    totalGainLoss: number;
};

const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1_00_00_000) {
        return `₹${(value / 1_00_00_000).toFixed(2)} Cr`;
    }
    if (Math.abs(value) >= 1_00_000) {
        return `₹${(value / 1_00_000).toFixed(2)} L`;
    }
    return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function PortfolioSummary({ totalInvestment, totalPresentValue, totalGainLoss }: PortfolioSummaryProps) {
    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 glass-effect">
                    <h3 className="text-sm font-medium text-gray-400"> Total Investment </h3>
                    <p className="text-2xl font-bold"> {formatCurrency(totalInvestment)} </p>
                </div>
                <div className="p-4 glass-effect">
                    <h3 className="text-sm font-medium text-gray-400"> Present Value </h3>
                    <p className="text-2xl font-bold"> {formatCurrency(totalPresentValue)} </p>
                </div>
                <div className="p-4 glass-effect">
                    <h3 className="text-sm font-medium text-gray-400"> Overall Gain/Loss </h3>
                    <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(totalGainLoss)}
                    </p>
                </div>
            </div>
        </div>
    );
};
