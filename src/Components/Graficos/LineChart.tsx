import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { ChartData } from 'chart.js';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Gasto, Ingreso } from '../FuncionesUtiles';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface DatosAgrupados {
  [key: string]: number;
}

const esIngreso = (dato: Gasto | Ingreso): dato is Ingreso => {
  return (dato as Ingreso).Fecha_Ingreso !== undefined;
};

const obtenerDatosAgrupados = (datos: (Gasto | Ingreso)[], obtenerFecha: (dato: Gasto | Ingreso) => string): DatosAgrupados => {
  const agrupados: DatosAgrupados = {};

  datos.forEach(dato => {
    const fecha = obtenerFecha(dato);
    if (!agrupados[fecha]) {
      agrupados[fecha] = 0;
    }
    agrupados[fecha]++;
  });

  return agrupados;
};

interface LineChartProps {
  ingresos: Ingreso[];
  gastos: Gasto[];
}

interface ChartDataSets {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
}

const LineChart: React.FC<LineChartProps> = ({ ingresos, gastos }) => {
  const [chartData, setChartData] = useState<ChartData<'line', number[], string>>({
    labels: [],
    datasets: [] as ChartDataSets[],
  });

  useEffect(() => {
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - 30);

    const ingresosUltimoMes = ingresos.filter(ingreso => new Date(ingreso.Fecha_Ingreso) >= fechaInicio);
    const gastosUltimoMes = gastos.filter(gasto => new Date(gasto.Fecha_Gasto) >= fechaInicio);

    const agruparPorCincoDias = (dato: Gasto | Ingreso): string => {
      const fecha = esIngreso(dato) ? new Date(dato.Fecha_Ingreso) : new Date(dato.Fecha_Gasto);
      const dia = fecha.getDate();
      return `${Math.ceil(dia / 5) * 5}`;
    };

    const ingresosAgrupados = obtenerDatosAgrupados(ingresosUltimoMes, agruparPorCincoDias);
    const gastosAgrupados = obtenerDatosAgrupados(gastosUltimoMes, agruparPorCincoDias);

    const labels = Array.from(new Set([...Object.keys(ingresosAgrupados), ...Object.keys(gastosAgrupados)])).sort();

    setChartData({
      labels,
      datasets: [
        {
          label: 'Ingresos',
          data: labels.map(label => ingresosAgrupados[label] || 0),
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
        {
          label: 'Gastos',
          data: labels.map(label => gastosAgrupados[label] || 0),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
      ]
    });
  }, [ingresos, gastos]);

  return <Line data={chartData} />;
};

export default LineChart;
