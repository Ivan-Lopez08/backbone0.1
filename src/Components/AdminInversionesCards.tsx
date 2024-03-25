import MenuAdmin from "./MenuAdmin";
import { fetchInversiones } from "./FuncionesUtiles";
import AccountCard from "./Cards/CuentasCard";
import { inversion } from "./FuncionesUtiles";
import { useEffect, useState } from "react";
import InversionCard from "./Cards/InversionesCard";

interface Props {
    setIsLogged: (value: boolean) => void;
}
//hola

export function AdminInversiones({ setIsLogged }: Props) {
    const [inversiones, setInversiones] = useState<inversion[]>([]);

    useEffect(() => {
        fetchInversiones().then((data) => setInversiones(data));
    }, []);

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <MenuAdmin setIsLogged={setIsLogged} />
                <div className="col py-3">
                    <h1 className="left-align">Administrar opciones de inversion</h1>
                    <div className="App">
                        {inversiones.map((inversion) => (
                            <InversionCard key={inversion.ID_Inversion} inversion={inversion} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}