import Logo from "../img/logo.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Ingreso, formatearFecha } from "./FuncionesUtiles";
import { useAuth } from "./UserContext";
import Menu from "./Menu";
import bin from "../img/bin.png";
import edit from "../img/edit.png";

interface Props {
    setIsLogged: (value: boolean) => void;
}

export function Ingresos({ setIsLogged }: Props) {

    const [data, setData] = useState<Ingreso[]>([]);

    const [showModal, setShowModal] = useState(false);
    const [monto, setMonto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const { obtenerInfoUsuario } = useAuth();
    const navigate = useNavigate();
    const [filtroDescripcion, setFiltroDescripcion] = useState('');
    const [filtroMonto, setFiltroMonto] = useState('');
    const [total, setTotal] = useState(0)
    const [showModal2, setShowModal2] = useState(false);
    const [selectedIngresoId, setSelectedIngresoId] = useState(0);
    const [showModal3, setShowModal3] = useState(false);
    const [montoEdit, setMontoEdit] = useState('');
    const [descripcionEdit, setDescripcionEdit] = useState('');


    const fetchData = async () => {
        try {
            const usuario = obtenerInfoUsuario();
            if (!usuario) {
                console.error("El usuario no ha iniciado sesión.");
                setIsLogged(false);
                navigate('/Login');
                return;
            }
            if (usuario) {
                const url = `http://localhost:3000/api/v1/ingresos/${usuario?.Cuenta?.ID_Cuenta}`;
                const response = await axios.get(url);
                setData(response.data);
                const totalGastos = response.data.reduce((total: number, ingreso: Ingreso) => total + ingreso.Monto, 0);
                setTotal(totalGastos);
            } else {
                console.error("El usuario aún no está definido.");
            }
        } catch (error) {
            console.error("Error al obtener los datos:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setDescripcion('')
        setMonto('')
    };

    const openModal2 = () => {
        setShowModal2(true);
    };

    const closeModal2 = () => {
        setShowModal2(false);

    };

    const openModal3 = (IngresoID: number) => {
        const registroToEdit = data.find(data => data.ID_Ingreso === IngresoID);
        if (registroToEdit) {
            setMontoEdit(registroToEdit.Monto.toString());
            setDescripcionEdit(registroToEdit.Descripcion);
            setShowModal3(true);
        }
    };

    const closeModal3 = () => {
        setShowModal3(false);

    };

    const calculateLastMonthIncomes = () => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth(); // Mes actual (0-11)
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Mes pasado
    
        const lastMonthIncomes = data.filter((ingreso) => {
            const ingresoDate = new Date(ingreso.Fecha_Ingreso);
            return ingresoDate.getMonth() === lastMonth && ingresoDate.getFullYear() === currentDate.getFullYear();
        });
    
        return lastMonthIncomes.reduce((total, ingreso) => total + ingreso.Monto, 0);
    };
    
    // Calcula el total de ingresos para el mes actual
    const calculateCurrentMonthIncomes = () => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth(); // Mes actual (0-11)
    
        const currentMonthIncomes = data.filter((ingreso) => {
            const ingresoDate = new Date(ingreso.Fecha_Ingreso);
            return ingresoDate.getMonth() === currentMonth && ingresoDate.getFullYear() === currentDate.getFullYear();
        });
    
        return currentMonthIncomes.reduce((total, ingreso) => total + ingreso.Monto, 0);
    };

    const handleIngreso = async () => {
        try {
            if (!monto.trim()) {
                window.alert("Por favor ingrese un monto válido");
                return;
            }
            const montoNumero = parseFloat(monto);
            if (montoNumero <= 0 || isNaN(montoNumero)) {
                window.alert("Por favor ingrese un monto válido");
                return;
            }
            const response = await axios.post('http://localhost:3000/api/v1/ingresos', {
                Descripcion: descripcion,
                Monto: parseFloat(monto),
                Cuenta: obtenerInfoUsuario()?.Cuenta.Nombre
            });
            console.log('Ingreso creado exitosamente:', response.data);
            closeModal(); // Cerrar el modal después de agregar el ingreso
            fetchData(); // Actualizar los datos después de agregar el ingreso
        } catch (error) {
            console.error('Error al crear el ingreso:', error);
            window.alert("No se pudo realizar el ingreso")
        }
    };

    const handleDeleteIngreso = async () => {
        await axios.delete(`http://localhost:3000/api/v1/ingresos/${selectedIngresoId}`)
        fetchData();
        closeModal2();
    }

    const handleEditRegistro = async (IngresoID: number, newData: Partial<Ingreso>) => {
        try {
            const montoNumero = newData.Monto;
            if(montoNumero){
                if (montoNumero <= 0 || isNaN(montoNumero)) {
                    window.alert("Por favor ingrese un monto válido");
                    return;
                }
            } 
            if (IngresoID) {
                const response = await axios.patch(`http://localhost:3000/api/v1/ingresos/${IngresoID}`, newData);
                fetchData();
                closeModal3()
            } else {
                console.error("No se pudo obtener el ID de la cuenta");
            }
        } catch (error) {
            console.error("Error al editar el usuario:", error);
        }
    }

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <Menu setIsLogged={setIsLogged} />
                <div className="col py-3">
                    <div className="contenedorColumnas">
                        <div className="columna1">
                            <div className='rounded-box2'>
                                <h2>Total de ingresos de este mes</h2>
                                {calculateCurrentMonthIncomes()} Lps.
                            </div>
                        </div>
                        <div className="columna2">
                            <div className='rounded-box2'>
                                <h2>Total de ingresos del mes pasado</h2>
                                {calculateLastMonthIncomes()} Lps.
                            </div>
                        </div>
                    </div>
                    <div className="contenedorColumnas">
                        <div className="columnaTabla">
                            <h5 className="left-align"><strong>Historial de ingresos:</strong></h5>
                            <div className="right-align">
                                <button type="button" className="btn btn-dark" onClick={openModal}>Agregar nuevo ingreso</button>
                            </div>
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th style={{ width: '10%' }}>#ID</th>
                                        <th style={{ width: '20%' }}>Fecha</th>
                                        <th style={{ width: '20%' }}>Monto</th>
                                        <th style={{ width: '40%' }}>Descripción</th>
                                        <th style={{ width: '10%' }}>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data
                                        .filter((gasto) =>
                                            gasto.Descripcion.toLowerCase().includes(filtroDescripcion.toLowerCase()) &&
                                            gasto.Monto.toString().toLowerCase().includes(filtroMonto.toLowerCase())
                                        )
                                        .map(ingreso => (
                                            <tr key={ingreso.ID_Ingreso}>
                                                <td>{ingreso.ID_Ingreso}</td>
                                                <td>{formatearFecha(new Date(ingreso.Fecha_Ingreso))}</td>
                                                <td>{ingreso.Monto} Lps.</td>
                                                <td>{ingreso.Descripcion}</td>
                                                <td>
                                                    <button title='Delete' type="button" className="btn btn-outline-danger" onClick={() => { setSelectedIngresoId(ingreso.ID_Ingreso); openModal2() }}>
                                                        <img className='icon-sized' src={bin} alt="Icono de eliminar" />
                                                    </button>
                                                    <button title='Edit' type="button" className="btn btn-outline-primary" onClick={() => { setSelectedIngresoId(ingreso.ID_Ingreso); openModal3(ingreso.ID_Ingreso) }}>
                                                        <img className='icon-sized' src={edit} alt="Icono de editar" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            
                        </div>
                        <div className="bg-light border border-2 m-3 p-3 rounded">
                            <div className="filtros">
                                <div>
                                    <h2>Filtrar datos</h2>
                                    <h4>Descripción</h4>
                                    <input className="input-field2"
                                        type="text"
                                        placeholder="Ingrese la descripción"
                                        value={filtroDescripcion}
                                        onChange={(e) => setFiltroDescripcion(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <h4>Monto</h4>
                                    <input className="input-field2"
                                        type="text"
                                        placeholder="Ingrese el monto"
                                        value={filtroMonto}
                                        onChange={(e) => setFiltroMonto(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>


                    {showModal && (
                        <div className='modal' onClick={closeModal}>
                            <div className='modal-content' onClick={e => e.stopPropagation()}>
                                <h1>Nuevo ingreso</h1>
                                <input className="input-field" type="text" placeholder="Monto" value={monto} onChange={e => setMonto(e.target.value)} />
                                <input className="input-field" type="text" placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
                                <button className='round-button' onClick={(e) => { e.stopPropagation(); handleIngreso(); }}>Ingresar</button>
                            </div>
                        </div>
                    )}
                    {showModal2 && (
                        <div className='modal' onClick={closeModal2}>
                            <div className='modal-content' onClick={e => e.stopPropagation()}>
                                <h1>Seguro que desea eliminar este registro?</h1>
                                <div>
                                    <button className='round-button' onClick={(e) => { e.stopPropagation(); handleDeleteIngreso(); }}>Eliminar</button>
                                    <button className='round-button' onClick={(e) => { e.stopPropagation(); closeModal2() }}>No Eliminar</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {showModal3 && (
                        <div className='modal' onClick={closeModal3}>
                            <div className='modal-content' onClick={e => e.stopPropagation()}>
                                <h1>Editar registro</h1>
                                <input className="input-field" type="text" placeholder="Monto" value={montoEdit} onChange={e => setMontoEdit(e.target.value)} />
                                <input className="input-field" type="text" placeholder="Descripcion" value={descripcionEdit} onChange={e => setDescripcionEdit(e.target.value)} />
                                <button className='round-button' onClick={(e) => { e.stopPropagation(); handleEditRegistro(selectedIngresoId, { Monto: parseFloat(montoEdit), Descripcion: descripcionEdit }); }}>Guardar</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}