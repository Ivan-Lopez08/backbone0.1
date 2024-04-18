import MenuAdmin from "./MenuAdmin";
import { Notificacion, fetchNotificaciones } from "./FuncionesUtiles";
import { useEffect, useState } from "react";
import NotificacionCard from "./Cards/NotificacionCard";
import { useAuth } from "./UserContext";
import Menu from "./Menu";

interface Props {
    setIsLogged: (value: boolean) => void;
}

export function Notificaciones({ setIsLogged }: Props) {
    const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
    const user = useAuth().obtenerInfoUsuario();

    const fetchData = () => {
        if(user?.Cuenta.ID_Cuenta){
            fetchNotificaciones(user?.Cuenta.ID_Cuenta).then((data) => setNotificaciones(data));
        }
    }
    useEffect(() => {
        fetchData();    
    }, []);

    const handleUpdateNotificaciones = () => {
        fetchData();
    };


    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <Menu setIsLogged={setIsLogged} />
                <div className="col py-3">
                    <h1 className="left-align">Mis notificaciones</h1>
                    {notificaciones.length === 0 && (
                        <h4>Aun no ha recibido ninguna notificación</h4>
                    )}
                    <div className="App">
                        {notificaciones.map((data) => (
                            <NotificacionCard key={data.ID_Notificacion} notificacion={data} onUpdateNotificaciones={handleUpdateNotificaciones} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}