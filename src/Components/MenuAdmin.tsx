import { useNavigate } from 'react-router-dom';
import { useAuth } from './UserContext';

interface Props {
    setIsLogged: (value: boolean) => void;
}

const MenuAdmin = ({ setIsLogged }:Props) => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    const handleLogout = () => {
        setIsLogged(false);
        setUser(null);
        navigate('/');
    };

    return (
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
            <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
                <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                    <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                        <span className="fs-5 d-none d-sm-inline">backBone</span>
                    </a>
                    <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                        <li className="nav-item">
                            <a href="#" className="nav-link align-middle px-0">
                                <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Inicio</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="#" onClick={() => navigate('/Admin')} className="nav-link align-middle px-0">
                                <i  className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Cuentas</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="#" onClick={() => navigate('/AdminInversiones')} className="nav-link align-middle px-0">
                                <i  className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Inversiones</span>
                            </a>
                        </li>
                        {/* <li className="nav-item">
                            <a href="#" className="nav-link align-middle px-0">
                                <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Roles</span>
                            </a>
                        </li> */}
                    </ul>
                    <hr />
                    <div className="dropdown pb-4">
                        <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src={`https://i.pravatar.cc/150?u=${user?.Nombre}`} alt="hugenerd" width="30" height="30" className="rounded-circle" />
                            <span className="d-none d-sm-inline mx-1">{useAuth().user?.Nombre}</span>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                            {/* <li><a className="dropdown-item" href="#">Ajustes</a></li> */}
                            <li><a className="dropdown-item" href="#">Perfil</a></li>
                            <li><a className="dropdown-item" href="#">Vista usuario</a></li>
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

export default MenuAdmin;