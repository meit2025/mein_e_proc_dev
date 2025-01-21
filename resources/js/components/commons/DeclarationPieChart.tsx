import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface PieChartProps {
    declaration: number;
    notDeclaration: number;
}

const DeclarationPieChart: React.FC<PieChartProps> = ({ declaration = 0, notDeclaration = 0 }) => {
    const total = declaration + notDeclaration;

    const data = {
        labels: [
            `Declaration (${((declaration / total) * 100).toFixed(1)}%)`,
            `Not Declaration (${((notDeclaration / total) * 100).toFixed(1)}%)`,
        ],
        datasets: [
            {
                data: [declaration, notDeclaration],
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB80', '#FF638480'],
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const value = context.raw;
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${context.label}: ${value} (${percentage}%)`;
                    },
                },
            },
            title: {
                display: true,
                text: `Total: ${total}`,
                font: {
                    size: 16,
                },
                padding: {
                    top: 10,
                    bottom: 20,
                },
            },
        },
    };

    return (
        <div style={{ width: '100%' }}>
            {/* Chart Pie */}
            <div style={{ height: '300px', width: '100%' }}>
                <Pie data={data} options={options} />
            </div>

            {/* Data Detail */}
            <div className="mt-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span
                            className="w-3 h-3 inline-block rounded-full"
                            style={{ backgroundColor: '#36A2EB' }}
                        ></span>
                        <span className="text-sm font-medium text-gray-900">
                            Declaration
                        </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                        {declaration} ({((declaration / total) * 100).toFixed(1)}%)
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span
                            className="w-3 h-3 inline-block rounded-full"
                            style={{ backgroundColor: '#FF6384' }}
                        ></span>
                        <span className="text-sm font-medium text-gray-900">
                            Not Declaration
                        </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                        {notDeclaration} ({((notDeclaration / total) * 100).toFixed(1)}%)
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeclarationPieChart;
