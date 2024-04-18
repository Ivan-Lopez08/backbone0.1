export function formatearFecha(fecha: Date): string {
  // Añade un cero al inicio si el número tiene un solo dígito
  function agregarCero(num: number): string {
    return num < 10 ? "0" + num : num.toString();
  }
  // Devuelve una cadena con el formato YYYY-MM-DD
  return (
    fecha.getFullYear() +
    "-" +
    agregarCero(fecha.getMonth() + 1) +
    "-" +
    agregarCero(fecha.getDate())
  )
}

export function obtenerNombreMes(fecha: Date): string {
  const nombresMeses: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  // El método getMonth() devuelve un número entre 0 (enero) y 11 (diciembre),
  // por lo que sumamos 1 para obtener el mes correcto en el arreglo.
  return nombresMeses[fecha.getMonth()];
}

export interface Account {
  ID_Cuenta: number;
  Nombre: string;
  Tipo: string;
  Fecha_Creacion: string;
  Deleted: null | string; // Puede ser null o una cadena
}

export interface Usuario {
  ID_Usuario: number;
  Nombre: string;
  Edad: number;
  Email: string;
  password: string;
  Telefono: string;
  fecha_Creacion: Date;
  Deleted: Date | null;
  Cuenta: {
    ID_Cuenta: number;
    Nombre: string;
    Tipo: string;
    Fecha_Creacion: Date;
    Deleted: Date | null;
  }
}

export interface Role {
  ID_Roles: number;
  Rol: string;
  Descripcion_Rol: string;
}

export interface inversion {
  ID_Inversion: number;
  Nombre: string;
  Descripcion: string;
  Video: string
}

export interface Option {
  ID_Opcion: number;
  Nombre: string;
  Enlace: string;
  Imagen: string;
  Descripcion: string;
  Inversion: {
    ID_Inversion: number;
    Nombre: string;
    Descripcion: string;
    Video: string;
  }
}

export interface Presupuesto {
  ID_Presupuesto: number;
  Nombre: string;
  Monto_Asignado: number;
  Objetivo: string;
  Fecha_Inicio: Date;
  Fecha_Final: Date;
  Cuenta: {
    ID_Cuenta: number;
    Nombre: string;
    Tipo: string;
    Fecha_Creacion: Date;
  };
}

export interface Actividad {
  ID_Actividad: number;
  Nombre_Actividad: string;
  Descripcion: string;
  Costo: number;
  Presupuesto: {
    ID_Presupuesto: number;
    Nombre: string;
    Monto_Asignado: number;
    Fecha_Inicio: Date;
    Fecha_Final: Date;
    Cuenta: {
      ID_Cuenta: number;
      Nombre: string;
      Tipo: string;
      Fecha_Creacion: Date;
    }
  }
}

export interface RolXUsuario {
  ID_RolesXUsuario: number,
  Role: {
    ID_Roles: number,
    Rol: string,
    Descripcion_Rol: string,
  },
  Usuario: {
    ID_Usuario: number,
    Nombre: string,
    Edad: number,
    Email: string,
    password: string,
    Cuenta: {
      ID_Cuenta: number,
      Nombre: string,
      Tipo: string
    }
  }
}

export interface Gasto {
  ID_Gasto: number;
  Descripcion: string;
  Monto: number;
  Fecha_Gasto: string;
  Tipo: string;
  Delete: null;
  Cuenta: {
      ID_Cuenta: number;
      Nombre: string;
      Tipo: string;
      Fecha_Creacion: string;
      Deleted: null;
  };
}

export interface Ingreso {
  ID_Ingreso: number;
  Descripcion: string;
  Monto: number;
  Fecha_Ingreso: string;
  Deleted: null;
  Cuenta: {
      ID_Cuenta: number;
      Nombre: string;
      Tipo: string;
      Fecha_Creacion: string;
      Deleted: null;
  };
}

export interface Notificacion{
  ID_Notificacion: number;
  Descripcion: string;
  Fecha: string;
  Cuenta: {
    ID_Cuenta: number;
    Nombre: string;
    Tipo: string;
    Fecha_Creacion: string;
    Deleted: null;
};
}

export async function fetchOptions(inversionId: number): Promise<Option[]> {
  const response = await fetch(`http://localhost:3000/api/v1/opciones-inversiones?ID_Inversion=${inversionId}`);
  const data = await response.json();

  // Filtrar los objetos por ID_Inversion
  const filteredOptions = data.filter((opcion: Option) => opcion.Inversion.ID_Inversion === inversionId);

  return filteredOptions;
}

export async function fetchAccounts(): Promise<Account[]> {
  const response = await fetch('http://localhost:3000/api/v1/cuentas');
  const data = await response.json();
  return data;
}

export async function fetchAccount(ID_Cuenta: number): Promise<Account> {
  const response = await fetch(`http://localhost:3000/api/v1/cuentas/${ID_Cuenta}`);
  const data = await response.json();
  return data;
}

export async function fetchUsersByAccountId(ID_Cuenta: number): Promise<Usuario[]> {
  const response = await fetch(`http://localhost:3000/api/v1/usuarios?ID_Cuenta=${ID_Cuenta}`);
  const data = await response.json();
  const filteredUsers = data.filter((users: Usuario) => users.Cuenta.ID_Cuenta === ID_Cuenta);
  return filteredUsers;
}

export async function fetchPresupuestos(ID_Cuenta: number): Promise<Presupuesto[]> {
  const response = await fetch(`http://localhost:3000/api/v1/presupuestos?ID_Cuenta=${ID_Cuenta}`);
  const data = await response.json();
  const filteredPresupuestos = data.filter((presupuesto: Presupuesto) => presupuesto.Cuenta.ID_Cuenta === ID_Cuenta);
  return filteredPresupuestos;
}

export async function fetchActividades(ID_Presupuesto: number): Promise<Actividad[]> {
  const response = await fetch(`http://localhost:3000/api/v1/actividades?ID_Presupuesto=${ID_Presupuesto}`);
  const data = await response.json();
  const filteredActivity = data.filter((actividad: Actividad) => actividad.Presupuesto.ID_Presupuesto === ID_Presupuesto);
  return filteredActivity;
}

export async function fetchInversiones(): Promise<inversion[]> {
  const response = await fetch('http://localhost:3000/api/v1/inversiones');
  const data = await response.json();
  return data;
}

export async function fetchInver(ID_Inversion: number): Promise<inversion> {
  const response = await fetch(`http://localhost:3000/api/v1/inversiones/${ID_Inversion}`);
  const data = await response.json();
  return data;
}

export async function fetchOpcionesByInversionId(ID_Inversion: number): Promise<Option[]> {
  const response = await fetch(`http://localhost:3000/api/v1/opciones-inversiones?ID_Inversion=${ID_Inversion}`);
  const data = await response.json();
  const filteredOptions = data.filter((opciones: Option) => opciones.Inversion.ID_Inversion === ID_Inversion);
  return filteredOptions;
}

export async function fetchrolesByUsuarioID(ID_Usuario: number): Promise<RolXUsuario[]> {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/rolesXUsuarios?ID_Usuario=${ID_Usuario}`);
    const data = await response.json();
    const filteredRoles = data.filter((roles: RolXUsuario) => roles.Usuario.ID_Usuario === ID_Usuario);
    console.log('se revisaron los roles'); // Agregar este console.log para verificar los roles obtenidos
    return filteredRoles;
  } catch (error) {
    console.error('Error al obtener los roles:', error);
    return [];
  }
}

export async function fetchGastos(ID_Cuenta: number): Promise<Gasto[]> {
  const response = await fetch(`http://localhost:3000/api/v1/gastos/${ID_Cuenta}`);
  const data = await response.json();
  const filteredGasto = data.filter((gasto: Gasto) => gasto.Cuenta.ID_Cuenta === ID_Cuenta);
  return filteredGasto;
}

export async function fetchIngresso(ID_Cuenta: number): Promise<Ingreso[]> {
  const response = await fetch(`http://localhost:3000/api/v1/ingresos/${ID_Cuenta}`);
  const data = await response.json();
  const filteredIngreso = data.filter((ingreso: Ingreso) => ingreso.Cuenta.ID_Cuenta === ID_Cuenta);
  return filteredIngreso;
}

export async function fetchNotificaciones(ID_Cuenta: number): Promise<Notificacion[]> {
  const response = await fetch(`http://localhost:3000/api/v1/notificaciones`);
  const data = await response.json();
  const filteredNotificaciones = data.filter((notificacion: Notificacion) => notificacion.Cuenta.ID_Cuenta === ID_Cuenta);
  return filteredNotificaciones;
}

