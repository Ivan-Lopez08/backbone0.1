import { useContext, useEffect, useState } from "react";
import { Usuario, fetchUsersByAccountId, fetchrolesByUsuarioID, formatearFecha } from "./FuncionesUtiles";
import Menu from "./Menu";
import { authContext, useAuth } from "./UserContext";
import axios from "axios";
import { Alert } from "react-bootstrap";
import { Email } from "@mui/icons-material";
import DataTable from "react-data-table-component";

interface Props {
    setIsLogged: (value: boolean) => void;
}

export function Perfil({ setIsLogged }: Props) {
    const user = useAuth().user;
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEmpresa, setIsEmpresa] = useState(false)
    const [userDate, setUserDate] = useState('')
    const [censoredPassword, setCensoredPassword] = useState('');
    const [users, setUsers] = useState<Usuario[]>([]);
    const [filtroNombreUser, setFiltroNombreUser] = useState('');
    const [filtroEmail, setFiltroEmail] = useState('');
    const [filtroTelefono, setFiltroTelefono] = useState('');
    const [accountId, setAccountId] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [pass, setPass] = useState('')
    const [showModal2, setShowModal2] = useState(false);
    const [NombreEdit, setNombreEdit] = useState('')
    const [correoEdit, setCorreoEdit] = useState('')
    const [passEdit, setPassEdit] = useState('')
    const [telefonoEdit, setTelefonoEdit] = useState('')
    const userContext = useContext(authContext);
    const [showModal3, setShowModal3] = useState(false);
    const [inputUsuario, setInputUsuario] = useState({
        Nombre: '',
        Email: '',
        Password: 'backBone2024',
        Telefono: '',
    })
    const [nombreUser, setNombreUser] = useState('');
    const [email, setEmail] = useState('');
    const [SelectedUserID, setSelectedUserID] = useState(0);
    const [showModal4, setShowModal4] = useState(false);
    const [showModal5, setShowModal5] = useState(false);
    const [showModal6, setShowModal6] = useState(false);
    const [isAdminUser, setIsAdminUser] = useState(false);
    const [isUser, setIsUser] = useState(false);

    useEffect(() => {
        if (user?.fecha_Creacion) {
            const fechaCreacion = new Date(user.fecha_Creacion);
            setUserDate(formatearFecha(fechaCreacion));
        }
        if (user?.password) {
            const censored = '*'.repeat(user.password.length);
            setCensoredPassword(censored);
        }
    }, [user]);

    const fetchUsers = async () => {
        if (user?.Cuenta.ID_Cuenta !== undefined) {
            const accountId = user?.Cuenta.ID_Cuenta;
            setAccountId(accountId);
            fetchUsersByAccountId(accountId).then((userData) => setUsers(userData));
        } else {
            window.alert("Error al conseguir los datos")
        }
        if (user) {
            const roles = await fetchrolesByUsuarioID(user?.ID_Usuario);
            const isAdmin = roles.some(role => role.Role.ID_Roles === 1);
            setIsAdmin(isAdmin);

            const tipo = user.Cuenta.Tipo;
            if (tipo === 'Empresarial') {
                setIsEmpresa(true);
            }
        }
    }
    useEffect(() => {
        fetchUsers()
    });

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const openModal2 = () => {
        if (user) {
            setNombreEdit(user.Nombre)
            setCorreoEdit(user.Email)
            setPassEdit(user.password)
            setTelefonoEdit(user.Telefono)
            setShowModal2(true);
        }
    };

    const closeModal2 = () => {
        setShowModal2(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputUsuario({
            ...inputUsuario,
            [e.target.name]: e.target.value
        })
    }

    const openModal3 = () => {
        setShowModal3(true);
    };

    const closeModal3 = () => {
        setShowModal3(false);
    };

    const openModal4 = (userID: number) => {
        const userToEdit = users.find(user => user.ID_Usuario === userID);
        if (userToEdit) {
            setNombreUser(userToEdit.Nombre);
            setEmail(userToEdit.Email);
            setSelectedUserID(userID);
            setShowModal4(true);
        }
    };

    const closeModal4 = () => {
        setShowModal4(false);
    };

    const openModal5 = () => {
        setShowModal5(true);
    };

    const closeModal5 = () => {
        setShowModal5(false);
    };

    const openModal6 = async (userID: number) => {
        const roles = await fetchrolesByUsuarioID(userID);
        const isAdmin = roles.some(role => role.Role.ID_Roles === 1);
        setIsAdminUser(isAdmin);
        console.log("isAdmin", isAdmin);
        const isUser = roles.some(role => role.Role.ID_Roles === 5);
        setIsUser(isUser);
        console.log("isUser", isUser);
        setShowModal6(true);
    };

    const closeModal6 = async () => {

        setShowModal6(false);
    };

    const handleVerificarPass = async () => {
        if (pass === user?.password) {
            setPass('')
            closeModal()
            openModal2()
        } else {
            alert('Contraseña incorrecta');

            // <Alert variant="filled" severity="error">
            //     This is a filled error Alert.
            // </Alert>
        }
    }

    const handleEditPerfil = async () => {
        const response = await axios.patch(`http://localhost:3000/api/v1/usuarios/${user?.ID_Usuario}`, {
            Nombre: NombreEdit,
            Email: correoEdit,
            password: passEdit,
            Telefono: telefonoEdit
        })
        closeModal2()
        const reload = await axios.get(`http://localhost:3000/api/v1/usuarios/${user?.ID_Usuario}`)
        userContext.setUser(reload.data);
    }

    const handleAddUsuario = async () => {
        const usuarioResponse = await axios.post('http://localhost:3000/api/v1/usuarios', {
            Nombre: inputUsuario.Nombre,
            Edad: 18,
            Email: inputUsuario.Email,
            password: inputUsuario.Password,
            Telefono: inputUsuario.Telefono,
            Cuenta: user?.Cuenta.Nombre
        });

        const nuevoUsuarioId = usuarioResponse.data.ID_Usuario;
        const correoInvitacion = await axios.post(`http://localhost:3000/api/v1/usuarios/${nuevoUsuarioId}/send-email`)

        const nuevoUsuario = usuarioResponse.data.Nombre;
        const agregarRole = await axios.post('http://localhost:3000/api/v1/rolesXUsuarios', {
            Usuario: nuevoUsuario,
            Role: "Usuario"
        });

        const crearNotificacion = await axios.post(`http://localhost:3000/api/v1/notificaciones`, {
            Descripcion: `Se le ha enviado el correo de invitacion a ${inputUsuario.Nombre}`,
            Estado: 'Visto',
            Cuenta: user?.Cuenta.Nombre
        });
        closeModal3()
        fetchUsers()
    }

    const handleEditUser = async (userID: number, newData: Partial<Usuario>) => {
        try {
            if (accountId) {
                const response = await axios.patch(`http://localhost:3000/api/v1/usuarios/${userID}`, newData);
                closeModal4()
                const updatedUsers = await fetchUsersByAccountId(accountId);
                setUsers(updatedUsers);
            } else {
                console.error("No se pudo obtener el ID de la cuenta");
            }
        } catch (error) {
            console.error("Error al editar el usuario:", error);
        }
    }

    const handleDeleteUsuario = async () => {
        await axios.delete(`http://localhost:3000/api/v1/usuarios/${SelectedUserID}`)
        fetchUsers();
        closeModal5();
    }

    const editroles = async () => {
        try {
            const borrarRoles = await axios.delete(`http://localhost:3000/api/v1/rolesXUsuarios?ID_Usuario=${SelectedUserID}`);
    
            const nuevoUsuario = axios.get(`http://localhost:3000/api/v1/usuarios/${SelectedUserID}`);
    
            let role = "";
            if (isAdminUser) {
                role = "Administrador";
            } else {
                role = "Usuario";
            }
    
            const agregarRole = await axios.post('http://localhost:3000/api/v1/rolesXUsuarios', {
                Usuario: nuevoUsuario,
                Role: role
            });
    
        } catch (error) {
            console.error("Ocurrió un error al editar los roles:", error);
        }
        fetchUsers()
        closeModal6()
    }

    type Row = {
        ID_Usuario: number;
        Nombre: string;
        Email: string;
        Telefono: string;
    };


    const columns = [
        {
            name: "ID",
            selector: (row: Row) => row.ID_Usuario,
            sortable: true
        },
        {
            name: "Nombre",
            selector: (row: Row) => row.Nombre,
            sortable: true
        },
        {
            name: "Correo electronico",
            selector: (row: Row) => row.Email,
            sortable: true
        },
        {
            name: "Telefono",
            selector: (row: Row) => row.Telefono
        },
        {
            name: "Opciones",
            cell: (row: Row) => (
                <>
                    <button type="button" className="btn btn-primary" onClick={() => { setSelectedUserID(row.ID_Usuario); openModal6(row.ID_Usuario) }}>Roles</button>
                    <button type="button" className="btn btn-warning" onClick={() => openModal4(row.ID_Usuario)}>Editar</button>
                    <button type="button" className="btn btn-danger" onClick={() => { setSelectedUserID(row.ID_Usuario); openModal5(); }}>Eliminar</button>
                </>
            )
        }
    ];

    const processedData = users
        .filter((users) =>
            users.Nombre.toLowerCase().includes(filtroNombreUser.toLowerCase()) &&
            users.Email.toLowerCase().includes(filtroEmail.toLowerCase()) &&
            users.Telefono.toLowerCase().includes(filtroTelefono.toLowerCase())
        ).map(user => ({
            ID_Usuario: user.ID_Usuario,
            Nombre: user.Nombre,
            Email: user.Email,
            Telefono: user.Telefono
        }));


    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <Menu setIsLogged={setIsLogged} />
                <div className="col py-3">
                    <div className="contenedorColumnas">
                        <div className=" mx-4 left-align">
                            <h1>{user?.Nombre}</h1>
                            <h4>Correo: {user?.Email}</h4>
                            <h4>Contraseña: {censoredPassword}</h4>
                            <h4>Telefono: {user?.Telefono}</h4>
                            <div>
                                <button title='Edit' type="button" className="btn btn-outline-primary" onClick={openModal}>
                                    Editar Información
                                </button>
                            </div>
                        </div>
                        {/* <div className="columna5 ">
                            <img src={`https://avatars.abstractapi.com/v1/?api_key=db2f543305634d799ec4f597394c4759&name=${user?.Nombre}`} alt="hugenerd" width="300" height="300" className="rounded-circle" />
                            <div>
                                <button title='Edit' type="button" className="btn btn-outline-primary">
                                    Cambiar Foto de perfil
                                </button>
                            </div>
                        </div> */}
                    </div>
                    <div className="mx-4 mt-5 left-align">
                        <h5>Cuenta a la que perteneces</h5>
                        <h6>Nombre: {user?.Cuenta.Nombre}</h6>
                        <h6>Usuario desde: {userDate}</h6>
                    </div>
                    {isEmpresa && isAdmin && (
                        <div className="contenedorColumnas left-align">
                            <div className="columnaTabla">
                                <h5>Usuarios de la cuenta:</h5>
                                <DataTable
                                    columns={columns}
                                    data={processedData}
                                    pagination
                                />
                                <div className="left-align">
                                    <button type="button" className="btn btn-dark" onClick={openModal3}>Agregar otro usuario</button>
                                </div>
                            </div>
                            <div className="bg-light border border-2 m-3 p-3 rounded">
                                <div>
                                    <h2>Filtrar usuarios</h2>
                                    <h4 className="left-align">Nombre</h4>
                                    <input className="input-field2"
                                        type="text"
                                        placeholder="Ingrese el nombre"
                                        value={filtroNombreUser}
                                        onChange={(e) => setFiltroNombreUser(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <h4 className="left-align">Correo electronico</h4>
                                    <input className="input-field2"
                                        type="text"
                                        placeholder="Ingrese el correo electronico"
                                        value={filtroEmail}
                                        onChange={(e) => setFiltroEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <h4 className="left-align">Telefono</h4>
                                    <input className="input-field2"
                                        type="text"
                                        placeholder="Ingrese el numero de telefono"
                                        value={filtroTelefono}
                                        onChange={(e) => setFiltroTelefono(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {showModal && (
                        <div className='modal' onClick={closeModal}>
                            <div className='modal-content' onClick={e => e.stopPropagation()}>
                                <h1>Por favor verifique su contraseña</h1>
                                <input className="input-field" type="password" placeholder="Contraseña" value={pass} onChange={e => setPass(e.target.value)} />
                                <div>
                                    <button className='round-button' onClick={(e) => { e.stopPropagation(); handleVerificarPass(); }}>Verificar</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {showModal2 && (
                        <div className='modal' onClick={closeModal2}>
                            <div className='modal-content' onClick={e => e.stopPropagation()}>
                                <h1>Editar perfil</h1>
                                <input className="input-field" type="text" placeholder="Nombre" value={NombreEdit} onChange={e => setNombreEdit(e.target.value)} />
                                <input className="input-field" type="text" placeholder="Correo" value={correoEdit} onChange={e => setCorreoEdit(e.target.value)} />
                                <input className="input-field" type="text" placeholder="Contraseña" value={passEdit} onChange={e => setPassEdit(e.target.value)} />
                                <input className="input-field" type="text" placeholder="Telefono" value={telefonoEdit} onChange={e => setTelefonoEdit(e.target.value)} />
                                <div>
                                    <button className='round-button' onClick={(e) => { e.stopPropagation(); handleEditPerfil(); }}>Guardar</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {showModal3 && (
                        <div className='modal' onClick={closeModal3}>
                            <div className='modal-content' onClick={e => e.stopPropagation()}>
                                <h1>Invitar nuevo usuario</h1>
                                <input className="input-field" name="Nombre" type="text" placeholder="Nombre" value={inputUsuario.Nombre} onChange={handleChange} />
                                <input className="input-field" name="Email" type="text" placeholder="Correo" value={inputUsuario.Email} onChange={handleChange} />
                                <input className="input-field" name="Telefono" type="text" placeholder="Numero de telefono" value={inputUsuario.Telefono} onChange={handleChange} />
                                <div>
                                    <button className='round-button' onClick={(e) => { e.stopPropagation(); handleAddUsuario(); }}>Invitar</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showModal4 && (
                        <div className='modal' onClick={closeModal4}>
                            <div className='modal-content' onClick={e => e.stopPropagation()}>
                                <h1>Editar Usuario</h1>
                                <input className="input-field" type="text" placeholder="Nombre" value={nombreUser} onChange={e => setNombreUser(e.target.value)} />
                                <input className="input-field" type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                                <button className='round-button' onClick={(e) => { e.stopPropagation(); handleEditUser(SelectedUserID, { Nombre: nombreUser, Email: email }); }}>Guardar</button>
                            </div>
                        </div>
                    )}
                    {showModal5 && (
                        <div className='modal' onClick={closeModal5}>
                            <div className='modal-content' onClick={e => e.stopPropagation()}>
                                <h1>Seguro que desea eliminar este registro?</h1>
                                <div>
                                    <button className='round-button' onClick={(e) => { e.stopPropagation(); handleDeleteUsuario(); }}>Eliminar</button>
                                    <button className='round-button' onClick={(e) => { e.stopPropagation(); closeModal5() }}>No Eliminar</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {showModal6 && (
                        <div className='modal' onClick={closeModal6}>
                            <div className='modal-content' onClick={e => e.stopPropagation()}>
                                <h1>Roles de Usuario</h1>
                                <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                    {isAdmin && (
                                        <>
                                            <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" checked={isAdminUser} onChange={() => { setIsAdminUser(true); setIsUser(false); }} />
                                            <label className="btn btn-outline-primary" htmlFor="btnradio1">Administrador</label>
                                            <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" checked={!isAdminUser} onChange={() => { setIsAdminUser(false); setIsUser(true); }} />
                                            <label className="btn btn-outline-primary" htmlFor="btnradio2">Usuario</label>
                                        </>
                                    )}
                                    {!isAdmin && isUser && (
                                        <>
                                            <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off" checked={!isUser} onChange={() => { setIsAdminUser(true); setIsUser(false); }} />
                                            <label className="btn btn-outline-primary" htmlFor="btnradio3">Administrador</label>
                                            <input type="radio" className="btn-check" name="btnradio" id="btnradio4" autoComplete="off" checked={isUser} onChange={() => { setIsAdminUser(false); setIsUser(true); }} />
                                            <label className="btn btn-outline-primary" htmlFor="btnradio4">Usuario</label>
                                        </>
                                    )}
                                </div>
                                <button className='round-button' onClick={editroles}>Guardar</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}