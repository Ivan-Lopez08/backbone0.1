import React, { useEffect, useState } from "react";
import { Pie } from 'react-chartjs-2';
import { Gasto, fetchGastos } from "../FuncionesUtiles";
import { useAuth } from "../UserContext";
import { ChartData } from "chart.js";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart() {
    const user = useAuth().obtenerInfoUsuario();
    const [gastos, setGastos] = useState<Gasto[]>([]);
    const [gastosPorTipo, setGastosPorTipo] = useState<{ [tipo: string]: number }>({});
    const [chartData, setChartData] = useState<ChartData<'pie'>>({
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
        }],
    });

    useEffect(() => {
        const loadGastos = async () => {
            try {
                if (user && user.Cuenta && user.Cuenta.ID_Cuenta) {
                    const fetchedGastos = await fetchGastos(user.Cuenta.ID_Cuenta);
                    setGastos(fetchedGastos);
                    const nuevosGastosPorTipo: { [tipo: string]: number } = {};

                    fetchedGastos.forEach(gasto => {
                        const tipo = gasto.Tipo;
                        if (!nuevosGastosPorTipo[tipo]) {
                            nuevosGastosPorTipo[tipo] = 0;
                        }
                        nuevosGastosPorTipo[tipo] += gasto.Monto;
                    });

                    setGastosPorTipo(nuevosGastosPorTipo);
                }
            } catch (error) {
                console.error('Error al cargar los gastos:', error);
            }
        };
        loadGastos();
    }, [user]);

    useEffect(() => {
        const tipos = Object.keys(gastosPorTipo);
        const montos = Object.values(gastosPorTipo);
        const total = montos.reduce((acc, curr) => acc + curr, 0);
        const porcentajes = montos.map(monto => (monto / total) * 100);

        setChartData({
            labels: tipos,
            datasets: [{
                data: porcentajes,
                backgroundColor: [
                    "rgba(75,192,192,1)",
                    "#ecf0f1",
                    "#50AF95",
                    "#f3ba2f",
                    "2a71d0",
                ],
                borderColor: "black",
                borderWidth: 2,
            }],
        });
    }, [gastosPorTipo]);

    return (
        <Pie data={chartData} />
    );
}

export default PieChart;