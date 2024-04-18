import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AuthCard from './Components/Login';
import RegisterCard from './Components/Register';
import { Home } from './Components/Home';
import TipoCuenta from './Components/TipoCuenta';
import { Gastos } from './Components/Gastos';
import { Ingresos } from './Components/Ingresos';
import { AuthUsuario } from './Components/UserContext';
import { Presupuestos } from './Components/Presupuestos';
import { AdminCuentas } from './Components/AdminCuentasCards';
import { AdminC } from './Components/Admin/AdminCuentas';
import { Inversion } from './Components/Inversion';
import { AdminInversiones } from './Components/AdminInversionesCards';
import { AdminInversion } from './Components/Admin/AdminInversion';
import { Perfil } from './Components/Perfil';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Notificaciones } from './Components/Notificaciones';
import { HomeAdmin } from './Components/HomeAdmin';


function App() {
  const [isLogged, setIsLogged] = useState(false);

  return (
    <Router>
      <div className='App'>
      <AuthUsuario>
          <Routes>
            <Route path="/register" element={<RegisterCard />} />
            <Route path="/TipoCuenta" element={<TipoCuenta />} />
            {isLogged ? (
              <>
                <Route path="/Ingresos" element={<Ingresos setIsLogged={setIsLogged} />} />
                <Route path="/Gastos" element={<Gastos setIsLogged={setIsLogged} />} />
                <Route path="/" element={<Home setIsLogged={setIsLogged} />} />
                <Route path="/Presupuestos" element={<Presupuestos setIsLogged={setIsLogged} />} />
                <Route path="/AdminHome" element={<HomeAdmin setIsLogged={setIsLogged} />} />
                <Route path="/Admin" element={<AdminCuentas setIsLogged={setIsLogged} />} />
                <Route path="/AdminInversiones" element={<AdminInversiones setIsLogged={setIsLogged} />} />
                <Route path="/AdminCuenta/:id" element={<AdminC setIsLogged={setIsLogged} />} />
                <Route path="/AdminInversion/:id" element={<AdminInversion setIsLogged={setIsLogged} />} />
                <Route path="/Inversion/:id" element={<Inversion setIsLogged={setIsLogged} />} />
                <Route path="/Perfil" element={<Perfil setIsLogged={setIsLogged} />} />
                <Route path="/Notificaciones" element={<Notificaciones setIsLogged={setIsLogged} />} />
              </>
            ) : (
              <Route path="/" element={<AuthCard setIsLogged={setIsLogged} />} />
            )}
          </Routes>
        </AuthUsuario>
      </div>
    </Router>
  );
}

export default App;
