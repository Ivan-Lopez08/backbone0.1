import React, { createContext, useContext, useState } from "react";

interface Usuario {
  ID_Usuario: number;
  Nombre: string
  Edad: number
  Email: string
  password: string
  Telefono: string
  fecha_Creacion: string
  Cuenta: {
    ID_Cuenta: number;
    Nombre: string;
    Tipo: string;
    Fecha_Creacion: string;
    Deleted: null;
  };
}

interface AuthContextType {
  user: Usuario | null;
  setUser: (user: Usuario | null) => void;
  obtenerInfoUsuario: () => Usuario | null;
}

export const authContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  obtenerInfoUsuario: () => null // Inicialmente no hay usuario
});

export const useAuth = () => useContext(authContext);

interface AuthUsuarioProps {
  children: React.ReactNode; // Asegúrate de incluir esta propiedad
}

export const AuthUsuario: React.FC<AuthUsuarioProps> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);

  // Función para obtener la información del usuario
  const obtenerInfoUsuario = () => {
    return user;
  };

  return (
    <authContext.Provider value={{ user, setUser, obtenerInfoUsuario }}>
      {children}
    </authContext.Provider>
  );
};