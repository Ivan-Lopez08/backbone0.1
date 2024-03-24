import Menu from "./Menu";
import React, { useRef, useEffect } from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController } from 'chart.js';
import BarChart from "./Graficos/BarChart";
import { useAuth } from "./UserContext";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController);

interface Props {
    setIsLogged: (value: boolean) => void;
}

export function Home({ setIsLogged }: Props) {

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
                    <div className="Grafico">
                        <BarChart />
                    </div>
                </div>
            </div>
        </div>
    )
}