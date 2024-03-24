import { ChartData } from "chart.js";
import React, { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2'
import {Chart as ChartJS} from 'chart.js/auto'
import { Gasto, Ingreso, fetchGastos, fetchIngresso, obtenerNombreMes } from "../FuncionesUtiles";
import { useAuth } from "../UserContext";


function BarChart(){
    const user = useAuth().obtenerInfoUsuario();
    const [gastos, setGastos] = useState<Gasto[]>([]);
    const [ingresos, setIngresos] = useState<Ingreso[]>([]);
    const [gastosPorMes, setGastosPorMes] = useState<{ [mes: string]: number }>({});
    const [ingresosPorMes, setingresosPorMes] = useState<{ [mes: string]: number }>({});
    const [chartData, setChartData] = useState<ChartData<'bar'>>({
        labels: [],
        datasets: [{
            label: "Gastos por mes",
            data: [],
        },{
            label: "Ingresos por mes",
            data: [],
    }],
    });

    useEffect(() => {
        const loadGastos = async () => {
            try {
                if (user && user.Cuenta && user.Cuenta.ID_Cuenta) {
                    const fetchedGastos = await fetchGastos(user.Cuenta.ID_Cuenta);
                    setGastos(fetchedGastos);
                    const nuevosGastosPorMes: { [mes: string]: number } = {};

                    fetchedGastos.forEach(gasto => {
                        const fecha = new Date(gasto.Fecha_Gasto);
                        const nombreMes = obtenerNombreMes(fecha);
                        if (!nuevosGastosPorMes[nombreMes]) {
                            nuevosGastosPorMes[nombreMes] = 0;
                        }
                        nuevosGastosPorMes[nombreMes] += gasto.Monto;

                        
                    });

                    const fetchedIngresos = await fetchIngresso(user.Cuenta.ID_Cuenta);
                    setIngresos(fetchedIngresos);
                    const nuevosIngresosPorMes: { [mes: string]: number } = {};

                    fetchedIngresos.forEach(ingreso => {
                        const fecha = new Date(ingreso.Fecha_Ingreso);
                        const nombreMes = obtenerNombreMes(fecha);
                        if (!nuevosIngresosPorMes[nombreMes]) {
                            nuevosIngresosPorMes[nombreMes] = 0;
                        }
                        nuevosIngresosPorMes[nombreMes] += ingreso.Monto;          
                    });


                    setingresosPorMes(nuevosIngresosPorMes);
                    setGastosPorMes(nuevosGastosPorMes);
                } 
            } catch (error) {
                console.error('Error al cargar los gastos:', error);
            }
        };
        loadGastos();
    }, [user]);

    useEffect(() => {
        setChartData({
            labels: Object.keys(gastosPorMes),
            datasets: [{
                label: "Gastos por mes",
                data: Object.values(gastosPorMes),
                backgroundColor: [
                    "rgba(75,192,192,1)",
                    "#ecf0f1",
                    "#50AF95",
                    "#f3ba2f",
                    "2a71d0",
                ],
                borderColor: "black",
                borderWidth: 2, 
            },
            {
                label: "Ingresos por mes",
                data: Object.values(ingresosPorMes),
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
    }, [gastosPorMes,ingresosPorMes]);

    return(
        <Bar data={chartData}/>
    );
}

export default BarChart;