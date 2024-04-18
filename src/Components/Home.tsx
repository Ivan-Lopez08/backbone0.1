import Menu from "./Menu";
import React, { useRef, useEffect, useState } from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController } from 'chart.js';
import BarChart from "./Graficos/BarChart";
import { useAuth } from "./UserContext";
import LineChart from "./Graficos/LineChart";
import { Gasto, Ingreso } from "./FuncionesUtiles";
import axios from "axios";
import PieChart from "./Graficos/PieChart";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController);

interface Props {
    setIsLogged: (value: boolean) => void;
}

export function Home({ setIsLogged }: Props) {
    const [data, setData] = useState<Ingreso[]>([]);
    const { obtenerInfoUsuario } = useAuth();
    const [data2, setData2] = useState<Gasto[]>([]);

    const fetchData = async () => {
        const url = `http://localhost:3000/api/v1/ingresos/${obtenerInfoUsuario()?.ID_Usuario}`;
        const response = await axios.get(url);
        setData(response.data);
        const url2 = `http://localhost:3000/api/v1/gastos/${obtenerInfoUsuario()?.ID_Usuario}`;
        const response2 = await axios.get(url2);
        setData2(response2.data);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const calculateCurrentMonthIncomes = () => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentMonthIncomes = data.filter((ingreso) => {
            const ingresoDate = new Date(ingreso.Fecha_Ingreso);
            return ingresoDate.getMonth() === currentMonth && ingresoDate.getFullYear() === currentDate.getFullYear();
        });
        return currentMonthIncomes.reduce((total, ingreso) => total + ingreso.Monto, 0);
    };

    const calculateCurrentMonthGastos = () => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentMonthGastos = data2.filter((gasto) => {
            const gastoDate = new Date(gasto.Fecha_Gasto);
            return gastoDate.getMonth() === currentMonth && gastoDate.getFullYear() === currentDate.getFullYear();
        });
        return currentMonthGastos.reduce((total, gasto) => total + gasto.Monto, 0);
    };

    const calculateTotalRecordsInLastMonth = () => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
    
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Decrementa el mes actual para obtener el mes anterior
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear; // Ajusta el año si el mes actual es enero   
        const lastMonthIncomes = data.filter((ingreso) => {
            const ingresoDate = new Date(ingreso.Fecha_Ingreso);
            return ingresoDate.getMonth() === lastMonth && ingresoDate.getFullYear() === lastMonthYear;
        });   
        const lastMonthGastos = data2.filter((gasto) => {
            const gastoDate = new Date(gasto.Fecha_Gasto);
            return gastoDate.getMonth() === lastMonth && gastoDate.getFullYear() === lastMonthYear;
        });
    
        return lastMonthIncomes.length + lastMonthGastos.length;
    };

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <Menu setIsLogged={setIsLogged} />
                <div className="col py-3 ">
                    <div className="left-align">
                        <h1>
                            Reportes para {useAuth().user?.Cuenta.Nombre}
                        </h1>
                    </div>
                    <div className="d-flex flex-wrap gx-3 row my-3">
                        <div className="col-12 col-md-3">
                            <div className='bg-primary text-white border rounded border-dark border-2 p-3'>
                                <h4>Ingesos del mes</h4>
                                {calculateCurrentMonthIncomes()} Lps.
                            </div>
                        </div>
                        <div className="col-12 col-md-3">
                            <div className='bg-danger text-white border rounded border-dark border-2 p-3'>
                                <h4>Gastos del mes</h4>
                                {calculateCurrentMonthGastos()} Lps.
                            </div>
                        </div>
                        <div className="col-12 col-md-3">
                            <div className='bg-success text-white border rounded border-dark border-2 p-3'>
                                <h4>Cantidad de registros en el mes</h4>
                                {calculateTotalRecordsInLastMonth()}
                            </div>
                        </div>
                        <div className="col-12 col-md-3">
                            <div className='bg-secondary text-white border rounded border-dark border-2 p-3'>
                                <h4>ISV</h4>
                                {(calculateCurrentMonthIncomes()*0.15).toFixed(3) } Lps.
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-wrap gx-3 row my-5">
                        <div className="Grafico align-left col-12 col-md-4">
                            <h3>
                                Comparacion de gastos e ingresos:
                            </h3>
                            <BarChart />
                        </div>
                        <div className="Grafico col-12 col-md-4">
                            <h3>
                                Registros en los ultimos 30 dias:
                            </h3>
                            <LineChart ingresos={data} gastos={data2}/>
                        </div>
                        <div className="Grafico2 col-12 col-md-4">
                            <h3>
                                Gastos por tipo:
                            </h3>
                            <PieChart />
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}