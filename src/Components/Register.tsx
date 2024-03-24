import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Logo from "../img/logoV2.png";
import accountIcon from "../img/account.jpeg";
import passwordIcon from "../img/password.png";
import { Dropdown } from "react-bootstrap";
import axios from "axios";

export default function RegisterCard() {
    const navigate = useNavigate();

    const [inputValues, setInputValues] = useState({
        email: '',
        password: '',
        password2: '',
        nombre: '',
        nombreEmpresa: '',
    })

    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!selectedOption) {
            window.alert("Por favor seleccione un tipo de cuenta");
            return;
        }

        for (const key in inputValues) {
            if (!inputValues[key as keyof typeof inputValues]) {
                window.alert(`El campo ${key} no puede estar vacío`);
                return;
            }
        }
    
        try {
            // Verificar si el correo electrónico ya está en uso
            const response = await axios.get('http://localhost:3000/api/v1/usuarios');
            const existingUser = response.data.find((user: any) => user.Email === inputValues.email);
            
            if (existingUser) {
                window.alert('El correo electrónico ya está en uso');
                return;
            }
    
            // Crear la cuenta
            const cuentaResponse = await axios.post('http://localhost:3000/api/v1/cuentas', {
                Nombre: selectedOption === 'Personal' ? inputValues.nombre : inputValues.nombreEmpresa,
                Tipo: selectedOption
            });
    
            // Crear el usuario
            const usuarioResponse = await axios.post('http://localhost:3000/api/v1/usuarios', {
                Nombre: inputValues.nombre,
                Edad: 18,
                Email: inputValues.email,
                password: inputValues.password,
                Cuenta: cuentaResponse.data.Nombre
            });
    
            // Redirigir al usuario a la página de inicio
            navigate('/');
        } catch (error) {
            console.error('Error al crear cuenta o usuario', error);
            window.alert("No se pudo crear la cuenta o el usuario");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValues({
            ...inputValues,
            [e.target.name]: e.target.value
        })
    }

    const handleOptionSelect = (option: string) => {
        setSelectedOption(option);
    };

    return (
        <div className="container mt-4rem mycontainer">
            <div className="d-flex justify-content-center">
                <div className="col-md-4 col-10">
                    <div className="shadow-sm rounded p-3">
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
                                    {/*<div className="mb-2 p-1 d-flex border rounded my-dropdown-container">*/}
                                    <Dropdown>
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                                            {selectedOption || 'Selecciona un tipo de cuenta'}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => handleOptionSelect('Empresarial')}>
                                                Empresarial
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleOptionSelect('Personal')}>
                                                Personal
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    {/*</div>*/}

                                    {selectedOption === 'Personal' && (
                                        <div>
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
                                                    value={inputValues.nombre}
                                                    name="nombre"
                                                    type="text"
                                                    placeholder="Ingrese su nombre y apellido"
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
                                                    placeholder="Correo electronico"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {selectedOption === 'Empresarial' && (
                                        <div>
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
                                                    value={inputValues.nombreEmpresa}
                                                    name="nombreEmpresa"
                                                    type="text"
                                                    placeholder="Nombre de la empresa"
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
                                                    value={inputValues.nombre}
                                                    name="nombre"
                                                    type="text"
                                                    placeholder="Nombre y apellido del usuario administrador"
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
                                                    placeholder="Correo electronico del usuario administrador"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-2 p-1 d-flex border rounded">
                                        <div className="rounded-circle">
                                            <img
                                                className="img-fluid"
                                                src={passwordIcon}
                                                width="30"
                                                height="30"
                                                alt="iconPass" />
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
                                    <div className="mb-2 p-1 d-flex border rounded">
                                        <div className="rounded-circle">
                                            <img
                                                className="img-fluid"
                                                src={passwordIcon}
                                                width="30"
                                                height="30"
                                                alt="iconPass" />
                                        </div>
                                        <input
                                            className="form-control txt-input"
                                            onChange={handleChange}
                                            value={inputValues.password2}
                                            name="password2"
                                            type="password"
                                            placeholder="Confirmar contraseña"
                                        />
                                    </div>

                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-primary">
                                            Crear cuenta
                                        </button>
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