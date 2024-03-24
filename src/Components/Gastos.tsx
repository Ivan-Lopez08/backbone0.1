import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Gasto, formatearFecha } from "./FuncionesUtiles";
import { useAuth } from "./UserContext";
import Menu from "./Menu";
import bin from "../img/bin.png";
import edit from "../img/edit.png";


interface Props {
    setIsLogged: (value: boolean) => void;
}

export function Gastos({ setIsLogged }: Props) {
    //usestate para guardar la informacion de la API
    const [data, setData] = useState<Gasto[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [monto, setMonto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [tipo, setTipo] = useState('')
    const { obtenerInfoUsuario } = useAuth();
    const navigate = useNavigate();
    const [filtroDescripcion, setFiltroDescripcion] = useState('');
    const [filtroMonto, setFiltroMonto] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');
    const [total, setTotal] = useState(0)
    const [showModal2, setShowModal2] = useState(false);
    const [selectedGastoId, setSelectedGastoId] = useState(0);
    const [showModal3, setShowModal3] = useState(false);
    const [montoEdit, setMontoEdit] = useState('');
    const [descripcionEdit, setDescripcionEdit] = useState('');
    const [tipoEdit, setTipoEdit] = useState('')

    const fetchData = async () => {
        try {
            const usuario = obtenerInfoUsuario();
            if (!usuario) {
                console.error("El usuario no ha iniciado sesión.");
                setIsLogged(false); // Opcional: Si no ha iniciado sesión, puedes actualizar el estado de isLogged
                navigate('/Login');
                return; // Retorna para salir de la función si no hay usuario
            }
            if (usuario) {
                const url = `http://localhost:3000/api/v1/gastos/${usuario?.Cuenta?.ID_Cuenta}`;
                const response = await axios.get(url);
                setData(response.data);
                const totalGastos = response.data.reduce((total: number, gasto: Gasto) => total + gasto.Monto, 0);
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
        setMonto('')
        setDescripcion('')
        setTipo('')
    };

    const openModal2 = () => {
        setShowModal2(true);
    };

    const closeModal2 = () => {
        setShowModal2(false);
    };

    const openModal3 = (GastoID: number) => {
        const registroToEdit = data.find(data => data.ID_Gasto === GastoID);
        if (registroToEdit) {
            setMontoEdit(registroToEdit.Monto.toString());
            setDescripcionEdit(registroToEdit.Descripcion);
            setTipoEdit(registroToEdit.Tipo);
            setShowModal3(true);
        }
    };

    const closeModal3 = () => {
        setShowModal3(false);
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
            const response = await axios.post('http://localhost:3000/api/v1/gastos', {
                Descripcion: descripcion,
                Monto: parseFloat(monto),
                Tipo: tipo,
                Cuenta: obtenerInfoUsuario()?.Cuenta.Nombre
            });
            console.log('Gasto creado exitosamente:', response.data);
            closeModal(); // Cerrar el modal después de agregar el ingreso
            fetchData(); // Actualizar los datos después de agregar el ingreso
        } catch (error) {
            console.error('Error al crear el gasto:', error);
            window.alert("No se pudo realizar el gasto")
        }
    };

    const handleDeleteGasto = async () => {
        await axios.delete(`http://localhost:3000/api/v1/gastos/${selectedGastoId}`)
        fetchData();
        closeModal2();
    }

    const handleEditRegistro = async (GastoID: number, newData: Partial<Gasto>) => {
        try {
            const montoNumero = newData.Monto;
            if(montoNumero){
                if (montoNumero <= 0 || isNaN(montoNumero)) {
                    window.alert("Por favor ingrese un monto válido");
                    return;
                }
            } 
            if (GastoID) {
                const response = await axios.patch(`http://localhost:3000/api/v1/gastos/${GastoID}`, newData);
                fetchData();
                closeModal3()
            } else {
                console.error("No se pudo obtener el ID de la cuenta");
            }
        } catch (error) {
            console.error("Error al editar el usuario:", error);
        }
    }

    const calculateLastMonthGastos = () => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    
        const lastMonthGastos = data.filter((gasto) => {
            const gastoDate = new Date(gasto.Fecha_Gasto);
            return gastoDate.getMonth() === lastMonth && gastoDate.getFullYear() === currentDate.getFullYear();
        });
    
        return lastMonthGastos.reduce((total, gasto) => total + gasto.Monto, 0);
    };
    
    // Calcula el total de ingresos para el mes actual
    const calculateCurrentMonthGastos = () => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
    
        const currentMonthGastos = data.filter((gasto) => {
            const gastoDate = new Date(gasto.Fecha_Gasto);
            return gastoDate.getMonth() === currentMonth && gastoDate.getFullYear() === currentDate.getFullYear();
        });
    
        return currentMonthGastos.reduce((total, gasto) => total + gasto.Monto, 0);
    };

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <Menu setIsLogged={setIsLogged} />
                <div className="col py-3">
                    <div className="contenedorColumnas">
                        <div className="columna1">
                            <div className='rounded-box2'>
                                <h2>Total de gastos de este mes</h2>
                                {calculateCurrentMonthGastos()} Lps.
                            </div>
                        </div>
                        <div className="columna2">
                            <div className='rounded-box2'>
                                <h2>Total de gastos del mes pasado</h2>
                                {calculateLastMonthGastos()} Lps.
                            </div>
                        </div>
                    </div>
                    <div className="contenedorColumnas">
                        <div className="columnaTabla">
                            <h5 className="left-align"><strong>Historial de gastos:</strong></h5>
                            <div className="right-align">
                                <button type="button" className="btn btn-dark" onClick={openModal}>Agregar nuevo gasto</button>
                            </div>
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th style={{ width: '10%' }}>#ID</th>
                                        <th style={{ width: '20%' }}>Fecha</th>
                                        <th style={{ width: '10%' }}>Monto</th>
                                        <th style={{ width: '20%' }}>Tipo</th>
                                        <th style={{ width: '30%' }}>Descripción</th>
                                        <th style={{ width: '10%' }}>Opciones</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {data
                                        .filter((gasto) =>
                                            gasto.Descripcion.toLowerCase().includes(filtroDescripcion.toLowerCase()) &&
                                            gasto.Monto.toString().toLowerCase().includes(filtroMonto.toLowerCase()) &&
                                            (filtroTipo ? gasto.Tipo.toLowerCase() === filtroTipo.toLowerCase() : true)
                                        )
                                        .map((gasto) => (
                                            <tr key={gasto.ID_Gasto}>
                                                <td>{gasto.ID_Gasto}</td>
                                                <td>{formatearFecha(new Date(gasto.Fecha_Gasto))}</td>
                                                <td>{gasto.Monto}</td>
                                                <td>{gasto.Tipo}</td>
                                                <td>{gasto.Descripcion}</td>
                                                <td>
                                                    <button title='Delete' type="button" className="btn btn-outline-danger" onClick={() => { setSelectedGastoId(gasto.ID_Gasto); openModal2() }}>
                                                        <img className='icon-sized' src={bin} alt="Icono de eliminar" />
                                                    </button>
                                                    <button title='Edit' type="button" className="btn btn-outline-primary" onClick={() => { setSelectedGastoId(gasto.ID_Gasto); openModal3(gasto.ID_Gasto) }}>
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
                                <div>
                                    <h4>Tipo</h4>
                                    <select className="input-field2"
                                        value={filtroTipo} title="filtro tipo"
                                        onChange={(e) => setFiltroTipo(e.target.value)}
                                    >
                                        <option value="">Seleccionar tipo</option>
                                        <option value="variable">Variable</option>
                                        <option value="fijo">Fijo</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    {showModal && (
                        <div className='modal' onClick={closeModal}>
                            <div className='modal-content' onClick={e => e.stopPropagation()}>
                                <h1>Ingrese los datos del gasto</h1>
                                <input className="input-field" type="text" placeholder="Monto" value={monto} onChange={e => setMonto(e.target.value)} />
                                <input className="input-field" type="text" placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
                                <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="input-field" title="Que tipo de gasto es?">
                                    <option value="" disabled hidden>Que tipo de gasto es?</option>
                                    <option value="variable">Variable</option>
                                    <option value="fijo">Fijo</option>
                                </select>
                                <button className='round-button' onClick={(e) => { e.stopPropagation(); handleIngreso(); }}>Ingresar</button>
                            </div>
                        </div>
                    )}
                    {showModal2 && (
                        <div className='modal' onClick={closeModal2}>
                            <div className='modal-content' onClick={e => e.stopPropagation()}>
                                <h1>Seguro que desea eliminar este registro?</h1>
                                <div>
                                    <button className='round-button' onClick={(e) => { e.stopPropagation(); handleDeleteGasto(); }}>Eliminar</button>
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
                                <select value={tipoEdit} onChange={(e) => setTipoEdit(e.target.value)} className="input-field" title="Que tipo de gasto es?">
                                    <option value="" disabled hidden>Que tipo de gasto es?</option>
                                    <option value="variable">Variable</option>
                                    <option value="fijo">Fijo</option>
                                </select>
                                <button className='round-button' onClick={(e) => { e.stopPropagation(); handleEditRegistro(selectedGastoId, { Monto: parseFloat(montoEdit), Descripcion: descripcionEdit, Tipo: tipoEdit }); }}>Guardar</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}