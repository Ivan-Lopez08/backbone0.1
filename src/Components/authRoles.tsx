import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./UserContext";
import { RolXUsuario, fetchrolesByUsuarioID } from "./FuncionesUtiles";

export function AuthRoles() {
    const [rolesXUsuarios, setRolesXUsuarios] = useState<RolXUsuario[]>([]);
    const user = useAuth().obtenerInfoUsuario();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                const userID = user?.ID_Usuario;
                if (userID) {
                    try {
                        const roles = await fetchrolesByUsuarioID(userID);
                        setRolesXUsuarios(roles);
                    } catch (error) {
                        console.error('Error al obtener roles:', error);
                    }
                }
            }
        };

        fetchData();
    },[]);

    useEffect(() => {
        // Verificar si el usuario tiene el rol correspondiente
        const isAdmin = rolesXUsuarios.some(role => role.Role.ID_Roles === 4);

        if (isAdmin) {
            navigate('/Admin');
        } else {
            console.log(test)
            navigate('/');

        }
    }, [rolesXUsuarios]);

    return null; // Opcionalmente, puedes devolver algo aquí si es necesario
}