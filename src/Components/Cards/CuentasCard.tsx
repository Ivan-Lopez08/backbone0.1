import React from 'react';
import { Account } from '../FuncionesUtiles';
import { formatearFecha } from '../FuncionesUtiles';
import { useNavigate } from 'react-router-dom';


interface AccountCardProps {
  account: Account;
}

const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  const navigate = useNavigate();

  const verCuenta = () => {
    navigate(`/AdminCuenta/${account.ID_Cuenta}`);
  };
  
  return (
    <div className="card bg-ligthgray shadow-md rounded-lg p-4">
      <div>ID: {account.ID_Cuenta}</div>
      <div>Nombre: {account.Nombre}</div>
      <div>Tipo: {account.Tipo}</div>
      <div>Fecha de Creación: {formatearFecha(new Date(account.Fecha_Creacion))}</div>
      <button type="button" className="btn btn-secondary btn-lg btn-block" onClick={verCuenta}>Ver Cuenta</button>
    </div>
  );
};

export default AccountCard;