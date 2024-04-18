import { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Logo from "../img/logoV2.png";
import accountIcon from "../img/account.jpeg";
import passwordIcon from "../img/password.png";
import axios from "axios";
import { authContext, useAuth } from "./UserContext";
import { RolXUsuario, fetchrolesByUsuarioID } from "./FuncionesUtiles";
import { AuthRoles } from "./authRoles";

interface Props {
    setIsLogged: (value: boolean) => void;
}
export default function AuthCard({ setIsLogged }: Props) {
    const [rolesXUsuarios, setRolesXUsuarios] = useState<RolXUsuario[]>([])
    const user = useAuth().obtenerInfoUsuario();
    const userContext = useContext(authContext);
    const navigate = useNavigate();

    const login = async () => {
        try {
            console.log('Entre al login')
            const response = await axios.post('http://localhost:3000/api/v1/usuarios/login', {
                Email: inputValues.email,
                password: inputValues.password
            });
            userContext.setUser(response.data);
            console.log('Se asigno el valor al contexto')
            setIsLogged(true);

            const roles = await fetchrolesByUsuarioID(response.data.ID_Usuario);
            const isAdmin = roles.some(role => role.Role.ID_Roles === 4);

            if (isAdmin) {
                navigate('/AdminHome');
            } else {
                navigate('/');
            }

        } catch (error) {
            console.error('Error de inicio de sesión:', error);
            window.alert("Credenciales incorrectas");
        }
    };

    // console.log(setIsLogged);
    const [inputValues, setInputValues] = useState({
        email: '',
        password: ''
    })
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        login();
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValues({
            ...inputValues,
            [e.target.name]: e.target.value
        })
    }

    const handleRegisterClick = () => {
        navigate('/register');
    }

    return (
        <div className="container-fluid" style={{backgroundColor: "#2E5951", height:"100vh"}}>
            <div className="d-flex justify-content-center">
                <div className="col-md-4 col-10">
                    <div className="shadow-sm rounded p-4 mx-5" style={{backgroundColor: "white", marginTop:"200px"}}>
                        <div className="row">
                            <div className="col-xl-12 col-md-12">
                                <form onSubmit={handleSubmit} autoComplete="off">
                                    <div className="text-center mb-2">
                                        <img
                                            className="img-fluid"
                                            src={Logo}
                                            alt="logo"
                                        />
                                    </div>

                                    <div className="mb-2 p-1 d-flex border rounded">
                                        <div className="rounded-circle">
                                            <img
                                                className="img-fluid"
                                                src={accountIcon}
                                                width="30"
                                                height="30"
                                                alt="iconUser" />
                                        </div>
                                        <input
                                            autoFocus
                                            className="form-control txt-input"
                                            onChange={handleChange}
                                            value={inputValues.email}
                                            name="email"
                                            type="email"
                                            placeholder="Correo"
                                        />
                                    </div>

                                    <div className="mb-2 p-1 d-flex border rounded">
                                        <div className="rounded-circle">
                                            <img
                                                className="img-fluid"
                                                src={passwordIcon}
                                                width="30"
                                                height="30"
                                                alt="iconUser" />
                                        </div>
                                        <input
                                            className="form-control txt-input"
                                            onChange={handleChange}
                                            value={inputValues.password}
                                            name="password"
                                            type="password"
                                            placeholder="Contraseña"
                                        />
                                    </div>

                                    <div className="row d-flex justify-content-between mt-3 mb-2">
                                        <div className="mb-3">
                                            <div className="form-check ms-1">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="mycheckbox"
                                                />
                                                <label className="form-check-label" htmlFor="mycheckbox">
                                                    Recordarme
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-primary">
                                            Entrar
                                        </button>
                                    </div>

                                    <div className="mt-3 mb-3 text-center">
                                        <h6>No tiene una cuenta?</h6>
                                        <a className="dropdown-item" onClick={handleRegisterClick}>Registrese gratis</a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}