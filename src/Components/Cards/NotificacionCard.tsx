import React from 'react';
import { Account, Notificacion } from '../FuncionesUtiles';
import { formatearFecha } from '../FuncionesUtiles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


interface CardProps {
    notificacion: Notificacion;
    onUpdateNotificaciones: () => void;
}

const NotificacionCard: React.FC<CardProps> = ({ notificacion, onUpdateNotificaciones }) => {
    const navigate = useNavigate();

    //   const verCuenta = () => {
    //     navigate(`/AdminCuenta/${account.ID_Cuenta}`);
    //   };

    const handleDeleteNotificacion = async () => {
        axios.delete(`http://localhost:3000/api/v1/notificaciones/${notificacion.ID_Notificacion}`)
        onUpdateNotificaciones();
    }

    return (
        <div className="card bg-ligthgray shadow-md rounded-lg p-4 left-align col-12 col-md-6">
            <div><strong>Fecha de Creación: {formatearFecha(new Date(notificacion.Fecha))}</strong></div>
            <div>{notificacion.Descripcion}</div>
            <div col-12 col-md-6>
            <button type="button" className="btn btn-secondary" onClick={handleDeleteNotificacion}>Cerrar</button>
            </div>
            
        </div>
    );
};

export default NotificacionCard;