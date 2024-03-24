import { useEffect, useState } from "react";
import { Account, fetchAccount, fetchUsersByAccountId, Usuario, Role } from "../FuncionesUtiles";
import MenuAdmin from "../MenuAdmin";
import { useParams } from "react-router-dom";
import axios from "axios";

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
    const [userRoles, setUserRoles] = useState<number[]>([]);

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
            const response = await axios.get(`http://localhost:3000/api/v1/rolesXUsuarios?userID=${userID}`);
            const rolesData = response.data;
            // Obtener los IDs de los roles asociados al usuario
            const userRoleIDs = rolesData.map((roleData: any) => roleData.ID_Role);
            setUserRoles(userRoleIDs);
        } catch (error) {
            console.error("Error al obtener los roles del usuario:", error);
        }
    };

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

    const openModal3 = () => {
        setShowModal3(true);
    };

    const closeModal3 = () => {
        setShowModal3(false);
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


    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <MenuAdmin setIsLogged={setIsLogged} />
                <div className="col py-3">
                    <h1>Administrar cuenta: {account?.Nombre}</h1>
                    <div className="left-align">
                        Nombre de la cuenta: {account?.Nombre}
                        <button type="button" className="btn btn-info" style={{ marginLeft: '10px' }} onClick={openModal}>Editar</button>
                    </div>
                    <div>
                        <table style={{ width: '70%', marginTop: '20px' }} className="table table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users
                                    .filter((users) =>
                                        users.Nombre.toLowerCase().includes(filtroNombreUser.toLowerCase()) &&
                                        users.Email.toLowerCase().includes(filtroEmail.toLowerCase())
                                    )
                                    .map((users) => (
                                        <tr key={users.ID_Usuario}>
                                            <td>{users.ID_Usuario}</td>
                                            <td>{users.Nombre}</td>
                                            <td>{users.Email}</td>
                                            <td>
                                                <button type="button" className="btn btn-primary" onClick={openModal3}>Roles</button>
                                                <button type="button" className="btn btn-warning" onClick={() => openModal2(users.ID_Usuario)}>Editar</button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        <div className="filtros" style={{ width: '25%', marginLeft: '75%', marginTop: '-200px', backgroundColor: 'lightgrey', borderRadius: '10px', padding: '10px' }}>
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
                                <h4 className="left-align">Email</h4>
                                <input className="input-field2"
                                    type="text"
                                    placeholder="Ingrese el monto"
                                    value={filtroEmail}
                                    onChange={(e) => setFiltroEmail(e.target.value)}
                                />
                            </div>
                        </div>
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
                                    {roles.map(role => (
                                        <div key={role.ID_Roles}>
                                            <input
                                                type="checkbox"
                                                id={role.ID_Roles.toString()}
                                                checked={userRoles.includes(role.ID_Roles)}
                                                onChange={() => handleRoleSelection(role.ID_Roles)}
                                            />
                                            <label htmlFor={role.ID_Roles.toString()}>{role.Rol}</label>
                                        </div>
                                    ))}
                                    <button onClick={handleSaveRoles}>Guardar</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}