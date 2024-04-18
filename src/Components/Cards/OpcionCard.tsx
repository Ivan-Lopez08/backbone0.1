import React from 'react';
import { Account, Option } from '../FuncionesUtiles';
import { formatearFecha } from '../FuncionesUtiles';
import { useNavigate } from 'react-router-dom';


interface OptionCardProps {
  Opciones: Option;
}

const OptionCard: React.FC<OptionCardProps> = ({ Opciones }) => {
  const navigate = useNavigate();

  const verCuenta = () => {
    navigate(`/AdminCuenta`);
  };

  const cardStyle = {
    width: '18rem',
    margin: '10px',
  };
  
  return (
    <div className="card" style={cardStyle}>
  {/* <img className="card-img-top" src="..." alt="Card image cap" /> */}
  <div className="card-body">
    <h5 className="card-title">{Opciones.Nombre}</h5>
    <p className="card-text">{Opciones.Descripcion}</p>
    <a href={Opciones.Enlace} className="btn btn-primary">ver mas</a>
  </div>
</div>
  );
};

export default OptionCard;