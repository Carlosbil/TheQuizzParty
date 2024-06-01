import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const options = {
    scales: {
        r: {
            angleLines: {
                display: true,
                color: 'rgba(255, 255, 255, 0.3)' // Color de las líneas angulares
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.3)' // Color de las líneas de la cuadrícula
            },
            pointLabels: {
                color: '#fff' // Color de las etiquetas de los puntos (categorias)
            },
            suggestedMin: 0,
            suggestedMax: 10
        }
    },
    elements: {
        line: {
            borderWidth: 3
        }
    }
};


const RadarChart = ({ accerted_list }) => {
    const data = {
        labels: ['Historia', 'Geografía', 'Deportes', 'Entretenimiento', 'Literatura', 'Ciencia', 'Cultura Pop'],
        datasets: [
            {
                label: 'Cantidad Acertada',
                data: accerted_list,
                backgroundColor: 'rgba(255, 99, 132, 0.5)', // Color de fondo
                borderColor: 'rgb(255, 99, 132)',          // Color del borde
                pointBackgroundColor: 'rgb(255, 99, 132)', // Color de fondo de los puntos
                pointBorderColor: '#fff',                  // Color del borde de los puntos
                pointHoverBackgroundColor: '#fff',         // Color de fondo de los puntos al pasar el mouse
                pointHoverBorderColor: 'rgb(255, 99, 132)' // Color del borde de los puntos al pasar el mouse
            }
        ]
    };
    
    return <Radar data={data} options={options} />;
};

export default RadarChart;
