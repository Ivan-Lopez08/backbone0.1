import { useEffect, useState } from "react";
import { Usuario, fetchUsersByAccountId, formatearFecha } from "./FuncionesUtiles";
import Menu from "./Menu";
import { useAuth } from "./UserContext";

interface Props {
    setIsLogged: (value: boolean) => void;
}

export function Perfil({ setIsLogged }: Props) {
    const user = useAuth().user;
    const [ userDate, setUserDate ] = useState('')
    const [ censoredPassword, setCensoredPassword ] = useState('');
    const [users, setUsers] = useState<Usuario[]>([]);
    const [filtroNombreUser, setFiltroNombreUser] = useState('');
    const [filtroEmail, setFiltroEmail] = useState('');
    const [accountId, setAccountId] = useState<number | null>(null);

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

    useEffect(()=> {
        if (user?.Cuenta.ID_Cuenta !== undefined) {
            const accountId = user?.Cuenta.ID_Cuenta;
            setAccountId(accountId);
            fetchUsersByAccountId(accountId).then((userData) => setUsers(userData));
        } else {
            window.alert("Error al conseguir los datos")
        }
    });

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <Menu setIsLogged={setIsLogged} />
                <div className="col py-3">
                    <div className="contenedorColumnas">
                        <div className="columna4 left-align">
                            <h1>{user?.Nombre}</h1>
                            <h4>Correo: {user?.Email}</h4>
                            <h4>Contraseña: {censoredPassword}</h4>
                            <h4>Telefono: {}</h4>
                            <div>
                                <button title='Edit' type="button" className="btn btn-outline-primary">
                                    Editar Información
                                </button>
                            </div>
                        </div>
                        <div className="columna5 ">
                            <img src={`https://i.pravatar.cc/150?u=${user?.Nombre}`} alt="hugenerd" width="300" height="300" className="rounded-circle" />
                            <div>
                                <button title='Edit' type="button" className="btn btn-outline-primary">
                                    Cambiar Foto de perfil
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="left-align">
                        <h5>Cuenta a la que perteneces</h5>
                        <h6>Nombre: {user?.Cuenta.Nombre}</h6>
                        <h6>Usuario desde: {userDate}</h6>
                    </div>
                    <div className="contenedorColumnas left-align">
                        <div className="columnaTabla">
                            <h5>Usuarios de la cuenta:</h5>
                            <table className="table table-hover">
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
                                                <button type="button" className="btn btn-primary" >Roles</button>
                                                <button type="button" className="btn btn-warning" >Editar</button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                            </table>
                            <div className="left-align">
                                <button type="button" className="btn btn-dark">Agregar otro usuario</button>
                            </div>
                        </div>
                        <div className="columnaFiltro">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}