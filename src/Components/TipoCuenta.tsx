import React from 'react';
import { useNavigate } from 'react-router-dom';

const TipoCuenta = () => {
  const navigate = useNavigate();

  return (
    <div className='container'>
      <h2>¿Qué tipo de cuenta desea crear?</h2>
      <div className='button-container'>
        <button className='round-button2' onClick={() => navigate('/register')}>Personal</button>
        <button className='round-button2' onClick={() => navigate('/register')}>Empresarial</button>
      </div>
    </div>
  );
};

export default TipoCuenta;