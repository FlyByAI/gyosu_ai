import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    ChartOptions,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SurveyChartProps {
    questionId: string;
    answers: Record<string, number>;
}

const SurveyChart: React.FC<SurveyChartProps> = ({ questionId, answers }) => {
    // Prepare chart data
    const chartData = {
        labels: Object.keys(answers),
        datasets: [
            {
                label: `Responses for question ${questionId}`,
                data: Object.values(answers),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions: ChartOptions<"bar"> = {
        scales: { y: { beginAtZero: true } },
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
        },
    };

    return (
        <div>
            <h3>Question ID {questionId}:</h3>
            
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

export default SurveyChart;
