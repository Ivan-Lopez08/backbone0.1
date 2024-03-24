import { useNavigate } from 'react-router-dom';
import { useAuth } from './UserContext';
import { useEffect, useState } from 'react';
import { inversion } from './FuncionesUtiles';
import axios from 'axios';

interface Props {
    setIsLogged: (value: boolean) => void;
}

const Menu = ({ setIsLogged }: Props) => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const [inversiones, setInversiones] = useState<inversion[]>([]);

    useEffect(() => {
        // Hacer la llamada a la API para obtener las inversiones
        axios.get("http://localhost:3000/api/v1/inversiones")
            .then(response => {
                // Almacenar los datos en el estado
                setInversiones(response.data);
            })
            .catch(error => {
                console.error("Error al obtener las inversiones:", error);
            });
    }, []);

    const handleLogout = () => {
        setIsLogged(false);
        setUser(null);
        navigate('/');
    };

    return (
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0" style={{backgroundColor: "#2E5951"}}>
            <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0">
                <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                    <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                        <span className="fs-5 d-none d-sm-inline fs-1 text-end">backBone</span>
                    </a>
                    <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                        <li className="nav-item">
                            <a href="#" className="nav-link align-middle px-0 link-menu" onClick={() => navigate('/')}>
                                <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Inicio</span>
                            </a>
                        </li>
                        <li className=" align-middle px-0">
                            <a className="nav-link px-0 link-menu" onClick={() => navigate('/Gastos')}> <span className="d-none d-sm-inline">Gastos</span></a>
                        </li>
                        <li className=' align-middle px-0'>
                            <a href="#" className="nav-link px-0 link-menu" onClick={() => navigate('/Ingresos')}> <span className="d-none d-sm-inline">Ingresos</span></a>
                        </li>
                        {/* <li>
                            <a href="#" className="nav-link px-0 align-middle">
                                <i className="fs-4 bi-table"></i> <span className="ms-1 d-none d-sm-inline">Plan de ahorro</span></a>
                        </li> */}
                        <li className=' align-middle px-0'>
                            <a href="#submenu2" data-bs-toggle="collapse" className="nav-link px-0 link-menu">
                            <span className=" d-sm-inlin ">Notificaciones</span></a>
                        </li>
                        <li className=" align-middle px-0">
                            <a className="nav-link px-0 link-menu" onClick={() => navigate('/Presupuestos')}> <span className="d-none d-sm-inline">Presupuestos</span></a>
                        </li>
                        <li className=' align-middle px-0'>
                            <a href="#submenu3" data-bs-toggle="collapse" className="nav-link px-0 link-menu">
                                <i className="fs-4 bi bi-gear-fill"></i> <span className="ms-1 d-none d-sm-inline">Inversion</span> </a>
                            <ul className="collapse nav flex-column ms-1" id="submenu3" data-bs-parent="#menu">
                                {inversiones.map((inversion, index) => (
                                    <li key={index}>
                                        <a href="#" className="nav-link px-0 link-menu" onClick={() => navigate(`/Inversion/${inversion.ID_Inversion}`)}>
                                            <span className="d-none d-sm-inline ">{inversion.Nombre}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        
                    </ul>
                    <hr />
                    <div className="dropdown pb-4">
                        <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src={`https://i.pravatar.cc/150?u=${user?.Nombre}`} alt="hugenerd" width="30" height="30" className="rounded-circle" />
                            <span className="d-none d-sm-inline mx-1">{useAuth().user?.Nombre}</span>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                            {/* <li><a className="dropdown-item" href="#">Ajustes</a></li> */}
                            <li><a className="dropdown-item" href="#" onClick={() => navigate('/Perfil')}>Perfil</a></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><a className="dropdown-item" onClick={handleLogout}>Salir</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Menu;