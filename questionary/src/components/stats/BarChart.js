import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Acertados por Categoría',
    },
  },
};

const BarChart = ({ accerted_list }) => {
  const data = {
    labels: ['Historia', 'Geografía', 'Deportes', 'Entretenimiento', 'Literatura', 'Ciencia', 'Cultura Pop'],
    datasets: [
      {
        label: 'Cantidad Acertada',
        data: accerted_list,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      }
    ],
  };

  return <Bar options={options} data={data} />;
};

export default BarChart;
