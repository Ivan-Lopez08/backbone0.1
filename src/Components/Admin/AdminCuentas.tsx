import { useEffect, useState } from "react";
import { Account, fetchAccount, fetchUsersByAccountId, Usuario, Role, fetchrolesByUsuarioID, RolXUsuario } from "../FuncionesUtiles";
import MenuAdmin from "../MenuAdmin";
import { useParams } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";

interface Props {
    setIsLogged: (value: boolean) => void;
}

interface AccountCardProps {
    account: Account;
}

export function AdminC({ setIsLogged }: Props) {
    const { id } = useParams<{ id: string }>();
    const [account, setAccount] = useState<Account>();
    const [filtroNombreUser, setFiltroNombreUser] = useState('');
    const [filtroEmail, setFiltroEmail] = useState('');
    const [users, setUsers] = useState<Usuario[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [showModal3, setShowModal3] = useState(false);
    const [nombre, setNombre] = useState(account?.Nombre);
    const [nombreUser, setNombreUser] = useState('');
    const [email, setEmail] = useState('');
    const [SelectedUserID, setSelectedUserID] = useState(0);
    const [accountId, setAccountId] = useState<number | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
    const [userRoles, setUserRoles] = useState<RolXUsuario[]>([]);
    const [showModal4, setShowModal4] = useState(false);
    const [showModal5, setShowModal5] = useState(false);
    const [inputUsuario, setInputUsuario] = useState({
        Nombre: '',
        Email: '',
        Password: 'backBone2024',
        Telefono: '',
    })

    useEffect(() => {
        if (id !== undefined) {
            const accountId = parseInt(id, 10);
            setAccountId(accountId);
            fetchAccount(accountId).then((data) => setAccount(data));
            fetchUsersByAccountId(accountId).then((userData) => setUsers(userData));
        } else {
            window.alert("Error al conseguir los datos")
        }
    }, []);

    useEffect(() => {
        if (account) {
            setNombre(account.Nombre);
        }
    }, [account]);

    useEffect(() => {
        // Obtener los roles disponibles desde la API
        axios.get("http://localhost:3000/api/v1/roles")
            .then(response => setRoles(response.data))
            .catch(error => console.error("Error al obtener los roles:", error));
    }, []);

    const fetchUserRoles = async (userID: number) => {
        try {
            setUserRoles(await fetchrolesByUsuarioID(userID));
        } catch (error) {
            console.error("Error al obtener los roles del usuario:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputUsuario({
            ...inputUsuario,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        if (SelectedUserID !== 0) {
            fetchUserRoles(SelectedUserID);
        }
    }, [SelectedUserID]);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const openModal2 = (userID: number) => {
        const userToEdit = users.find(user => user.ID_Usuario === userID);
        if (userToEdit) {
            setNombreUser(userToEdit.Nombre);
            setEmail(userToEdit.Email);
            setSelectedUserID(userID);
            setShowModal2(true);
        }
    };

    const closeModal2 = () => {
        setShowModal2(false);
    };

    const openModal3 = async () => {
        // if (userRoles.includes(1)) {
        //     // Si el usuario es Administrador, seleccionar el botón de radio de Administrador
        //     document.getElementById("btnradio1")?.click();
        // } else {
        //     // Si el usuario no es Administrador, seleccionar el botón de radio de Usuario
        //     document.getElementById("btnradio2")?.click();
        // }
        setShowModal3(true);
    };

    const closeModal3 = () => {
        setShowModal3(false);
    };

    const openModal4 = () => {
        setShowModal4(true);
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

    const handleEditName = async () => {
        try {
            if (account && account.ID_Cuenta) { // Verifica que account y ID_Cuenta no sean undefined
                const response = await axios.patch(`http://localhost:3000/api/v1/cuentas/${account.ID_Cuenta}`, {
                    Nombre: nombre
                });
                // Si la solicitud de modificación es exitosa, actualiza la cuenta
                if (response.status === 200) {
                    // Vuelve a obtener la cuenta actualizada
                    const updatedAccount = await fetchAccount(account.ID_Cuenta);
                    // Actualiza el estado de la cuenta con la versión actualizada
                    setAccount(updatedAccount);
                }
            } else {
                console.error("No se pudo obtener el ID de la cuenta");
            }
            closeModal()
        } catch (error) {
            console.error("Error al editar el nombre de la empresa:", error);
        }
    }

    const handleEditUser = async (userID: number, newData: Partial<Usuario>) => {
        try {
            if (accountId) {
                const response = await axios.patch(`http://localhost:3000/api/v1/usuarios/${userID}`, newData);
                closeModal2()
                const updatedUsers = await fetchUsersByAccountId(accountId);
                setUsers(updatedUsers);
            } else {
                console.error("No se pudo obtener el ID de la cuenta");
            }
        } catch (error) {
            console.error("Error al editar el usuario:", error);
        }
    }

    const handleRoleSelection = (roleID: number) => {
        setSelectedRoles(prevSelectedRoles => {
            if (prevSelectedRoles.includes(roleID)) {
                return prevSelectedRoles.filter(id => id !== roleID);
            } else {
                return [...prevSelectedRoles, roleID];
            }
        });
    };

    const handleSaveRoles = async () => {
        try {
            // Iterar sobre cada rol seleccionado
            for (const roleID of selectedRoles) {
                // Verificar si ya existe un registro para el usuario y el rol seleccionado
                const existingRole = await axios.get(`http://localhost:3000/api/v1/rolesXUsuarios?userID=${SelectedUserID}&roleID=${roleID}`);

                // Si no existe un registro, agregar uno
                if (!existingRole.data) {
                    // Obtener el nombre del usuario y del rol
                    const selectedUser = users.find(user => user.ID_Usuario === SelectedUserID);
                    const selectedRole = roles.find(role => role.ID_Roles === roleID);

                    if (selectedUser && selectedRole) {
                        // Agregar el registro de rolesXUsuarios
                        await axios.post("http://localhost:3000/api/v1/rolesXUsuarios", {
                            userName: selectedUser.Nombre,
                            roleName: selectedRole.Rol
                        });
                    }
                }
            }

            console.log("Roles asignados exitosamente");
            // Actualizar la lista de roles del usuario o hacer cualquier otra acción necesaria
            closeModal();
        } catch (error) {
            console.error("Error al asignar los roles:", error);
        }
    };


    type UsuarioRow = {
        ID_Usuario: number;
        Nombre: string;
        Email: string;
    };

    const usuarioColumns = [
        {
            name: "ID",
            selector: (row: UsuarioRow) => row.ID_Usuario,
            sortable: true
        },
        {
            name: "Nombre",
            selector: (row: UsuarioRow) => row.Nombre,
            sortable: true
        },
        {
            name: "Correo electronico",
            selector: (row: UsuarioRow) => row.Email,
            sortable: true
        },
        {
            name: "Opciones",
            cell: (row: UsuarioRow) => (
                <>
                    <button type="button" className="btn btn-primary" onClick={openModal3}>Roles</button>
                    <button type="button" className="btn btn-warning" onClick={() => openModal2(row.ID_Usuario)}>Editar</button>
                    <button type="button" className="btn btn-danger" onClick={() => { setSelectedUserID(row.ID_Usuario); openModal5(); }}>Eliminar</button>
                </>
            )
        }
    ];

    const processedUsuarios = users
        .filter((usuario) =>
            usuario.Nombre.toLowerCase().includes(filtroNombreUser.toLowerCase()) &&
            usuario.Email.toLowerCase().includes(filtroEmail.toLowerCase())
        )
        .map(usuario => ({
            ID_Usuario: usuario.ID_Usuario,
            Nombre: usuario.Nombre,
            Email: usuario.Email
        }));


    const handleAddUsuario = async () => {
        const usuarioResponse = await axios.post('http://localhost:3000/api/v1/usuarios', {
            Nombre: inputUsuario.Nombre,
            Edad: 18,
            Email: inputUsuario.Email,
            password: inputUsuario.Password,
            Telefono: inputUsuario.Telefono,
            Cuenta: account?.Nombre
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
            Cuenta: account?.Nombre
        });
        closeModal4()
        if (account) {
            fetchUsersByAccountId(account?.ID_Cuenta).then((userData) => setUsers(userData));
        }

    }

    const handleDeleteUsuario = async () => {
        await axios.delete(`http://localhost:3000/api/v1/usuarios/${SelectedUserID}`)
        if (accountId) {
            const updatedUsers = await fetchUsersByAccountId(accountId);
            setUsers(updatedUsers);
        }
        closeModal5();
    }

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <MenuAdmin setIsLogged={setIsLogged} />
                <div className="col py-3">
                    <h1>Administrar cuenta: {account?.Nombre}</h1>
                    <div className="left-align">
                        <div className="left-align">
                            <strong >Informacion de la cuenta:</strong>
                        </div>
                        Nombre de la cuenta: {account?.Nombre}
                        <button type="button" className="btn btn-info" style={{ marginLeft: '10px' }} onClick={openModal}>Editar</button>
                    </div>
                    <div className="contenedorColumnas">
                        <div className="columnaTabla">
                            <div className="left-align">
                                <strong >Usuarios de la Cuenta:</strong>
                            </div>
                            <DataTable
                                columns={usuarioColumns}
                                data={processedUsuarios}
                                pagination
                            />
                            <div className="left-align">
                                <button type="button" className="btn btn-dark" onClick={openModal4}>Agregar otro usuario</button>
                            </div>
                        </div>
                        <div className="bg-light border border-2 m-3 p-3 rounded">
                            <div className="filtros">
                                <div>
                                    <h2>Filtrar usuarios</h2>
                                    <h4 className="left-align">Nombre</h4>
                                    <input className="input-field2"
                                        type="text"
                                        placeholder="Ingrese la descripción"
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
                            </div>
                        </div>
                    </div>
                    <div>
                        {showModal && (
                            <div className='modal' onClick={closeModal}>
                                <div className='modal-content' onClick={e => e.stopPropagation()}>
                                    <h1>Cambiar nombre</h1>
                                    <input className="input-field" type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
                                    <button className='round-button' onClick={(e) => { e.stopPropagation(); handleEditName(); }}>Guardar</button>
                                </div>
                            </div>
                        )}

                        {showModal2 && (
                            <div className='modal' onClick={closeModal2}>
                                <div className='modal-content' onClick={e => e.stopPropagation()}>
                                    <h1>Editar Usuario</h1>
                                    <input className="input-field" type="text" placeholder="Nombre" value={nombreUser} onChange={e => setNombreUser(e.target.value)} />
                                    <input className="input-field" type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                                    <button className='round-button' onClick={(e) => { e.stopPropagation(); handleEditUser(SelectedUserID, { Nombre: nombreUser, Email: email }); }}>Guardar</button>
                                </div>
                            </div>
                        )}
                        {showModal3 && (
                            <div className='modal' onClick={closeModal3}>
                                <div className='modal-content' onClick={e => e.stopPropagation()}>
                                    <h1>Roles de Usuario</h1>
                                    <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                        <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" defaultChecked />
                                        <label className="btn btn-outline-primary" htmlFor="btnradio1">Administrador</label>
                                        <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" />
                                        <label className="btn btn-outline-primary" htmlFor="btnradio2">Usuario</label>
                                    </div>
                                    <button className='round-button' onClick={handleSaveRoles}>Guardar</button>
                                </div>
                            </div>
                        )}
                        {showModal4 && (
                            <div className='modal' onClick={closeModal4}>
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
                    </div>
                </div>
            </div>
        </div>
    )
}