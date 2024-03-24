import React, { useEffect, useState } from 'react';
import { Actividad, Presupuesto, fetchActividades } from '../FuncionesUtiles';
import { formatearFecha } from '../FuncionesUtiles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../UserContext';
import bin from "../../img/bin.png";
import edit from "../../img/edit.png";
import axios from 'axios';


interface OptionCardProps {
    Presupuesto: Presupuesto;
}

const PresupuestoCard: React.FC<OptionCardProps> = ({ Presupuesto }) => {
    const navigate = useNavigate();
    const [actividades, setActividades] = useState<Actividad[]>([]);
    const auth = useAuth();
    const [restante, setRestante] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [showModal3, setShowModal3] = useState(false);
    const [nombreActividad, setnombreActividad] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [costo, setCosto] = useState(0)
    const [nombrePresupuesto, setNombrePresupuesto] = useState('')
    const [objtivoPresupuesto, setObjtivoPresupuesto] = useState('')
    const [fechaInicio, setFechaInicio] = useState('')
    const [fechaFinal, setFechaFinal] = useState('')
    const [monto, setMonto] = useState(0)
    const [selectedActivityId, setSelectedActivityId] = useState(0);
    const [showModal4, setShowModal4] = useState(false);
    const [nombreActividadEdit, setnombreActividadEdit] = useState('')
    const [descripcionEdit, setDescripcionEdit] = useState('')
    const [costoEdit, setCostoEdit] = useState('')
    const [showModal5, setShowModal5] = useState(false);



    const fetchDataActivity = async () => {
        fetchActividades(Presupuesto.ID_Presupuesto).then((data) => {
            setActividades(data);
            const totalCostoActividades = data.reduce((total, actividad) => total + actividad.Costo, 0);
            setRestante(Presupuesto.Monto_Asignado - totalCostoActividades);
        });
    }

    useEffect(() => {
        fetchDataActivity()
    }, []);

    const cardStyle = {
        width: '24rem',
        margin: '10px',

    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const openModal2 = () => {
        setNombrePresupuesto(Presupuesto.Nombre);
        setMonto(Presupuesto.Monto_Asignado);
        setObjtivoPresupuesto(Presupuesto.Objetivo);
        if (Presupuesto.Fecha_Inicio instanceof Date && Presupuesto.Fecha_Final instanceof Date) {
            setFechaInicio(Presupuesto.Fecha_Inicio.toISOString().split('T')[0]); // Convertir a cadena de texto y tomar solo la parte de la fecha
            setFechaFinal(Presupuesto.Fecha_Final.toISOString().split('T')[0]); // Convertir a cadena de texto y tomar solo la parte de la fecha
        }
        setShowModal2(true);
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

    const openModal4 = (ActividadID: number) => {
        const registroToEdit = actividades.find(data => data.ID_Actividad === ActividadID);
        if (registroToEdit) {
            setnombreActividadEdit(registroToEdit.Nombre_Actividad);
            setCostoEdit(registroToEdit.Costo.toString())
            setDescripcionEdit(registroToEdit.Descripcion);
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

    const handleAddActivity = async () => {
        if (costo <= 0 || monto <= 0) {
            window.alert('El costo debe ser mayores que cero.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:3000/api/v1/actividades', {
                Nombre_Actividad: nombreActividad,
                Descripcion: descripcion,
                Costo: costo,
                Presupuesto: Presupuesto.Nombre
            });
            console.log('Presupuesto creado exitosamente:', response.data);
            closeModal();
            fetchDataActivity();
        } catch (error) {
            console.error('Error al crear el Presupuesto:', error);
            window.alert("No se pudo crear el presupuesto")
        }
    }

    const handleEditBudget = async () => {
        try {

            if (monto <= 0) {
                window.alert('El monto debe ser mayor que cero.');
                return;
            }
            const response = await axios.patch(`http://localhost:3000/api/v1/presupuestos/${Presupuesto.ID_Presupuesto}`, {
                Nombre: nombrePresupuesto,
                Monto_Asignado: monto,
                Objetivo: objtivoPresupuesto,
                Fecha_Inicio: new Date(fechaInicio), // Convertir la cadena de texto a objeto de tipo Date
                Fecha_Final: new Date(fechaFinal), // Convertir la cadena de texto a objeto de tipo Date
                // Agregar cualquier otra propiedad que necesites actualizar
            });
            console.log('Presupuesto editado exitosamente:', response.data);
            setShowModal2(false);
            // Actualizar la lista de presupuestos después de la edición
            fetchDataActivity();
        } catch (error) {
            console.error('Error al editar el presupuesto:', error);
            window.alert("No se pudo editar el presupuesto")
        }
    };

    const handleDeleteActivity = async () => {
        await axios.delete(`http://localhost:3000/api/v1/actividades/${selectedActivityId}`)
        fetchDataActivity();
        closeModal5();
    }

    const handleDeletePresupuesto = async () => {
        console.log(Presupuesto.ID_Presupuesto)
        await axios.delete(`http://localhost:3000/api/v1/presupuestos/${Presupuesto.ID_Presupuesto}`)
        fetchDataActivity();
        closeModal5();
    }

    const handleEditActividad = async (ActividadID: number, newData: Partial<Actividad>) => {
        try {
            const montoNumero = newData.Costo;
            if (montoNumero) {
                if (montoNumero <= 0 || isNaN(montoNumero)) {
                    window.alert("Por favor ingrese un monto válido");
                    return;
                }
            }
            if (ActividadID) {
                const response = await axios.patch(`http://localhost:3000/api/v1/actividades/${ActividadID}`, newData);
                fetchDataActivity();
                closeModal4()
            } else {
                console.error("No se pudo obtener el ID de la cuenta");
            }
        } catch (error) {
            console.error("Error al editar el usuario:", error);
        }
    }


    return (
        <div className="card" style={cardStyle}>
            {/* <img className="card-img-top" src="..." alt="Card image cap"/> */}
            <div className="card-body">
                <h5 className="card-title">{Presupuesto.Nombre}</h5>
                <p className="card-text">Objetivo: {Presupuesto.Objetivo} </p>
                <div className='left-align'>
                    <strong>Fondos asignados: {Presupuesto.Monto_Asignado} Lps</strong>
                </div>
                <div className='left-align'>
                    <strong className='left-align' style={{ color: restante < 0 ? 'red' : 'black' }}>
                        Fondos restantes: {restante} Lps
                    </strong>
                </div>
            </div>
            <div className='left-align'>
                Actividades:
            </div>
            {actividades.length === 0 && (
                <div className="card-body">
                    <p>No hay actividades creadas para este presupuesto.</p>
                </div>
            )}
            {actividades.map((actividad) => (
                <ul className="list-group list-group-flush" key={actividad.ID_Actividad}>
                    <li className="list-group-item">{actividad.Nombre_Actividad} <strong>{actividad.Costo}Lps   </strong>
                        <button onClick={() => {
                            setSelectedActivityId(actividad.ID_Actividad);
                            openModal3();
                        }} title='Delete' type="button" className="btn btn-outline-danger">
                            <img className='icon-sized' src={bin} alt="Icono de eliminar" />
                        </button>
                        <button title='Edit' type="button" className="btn btn-outline-primary" onClick={() => { setSelectedActivityId(actividad.ID_Actividad); openModal4(actividad.ID_Actividad) }}>
                            <img className='icon-sized' src={edit} alt="Icono de editar" />
                        </button>
                    </li>
                </ul>
            ))}

            <div className="card-body">
                <button style={{ margin: '5px' }} type="button" className="btn btn-success" onClick={openModal}>Nueva actividad</button>
                <button style={{ margin: '5px' }} type="button" className="btn btn-primary" onClick={openModal2}>Editar presupuesto</button>
            </div>
            {showModal && (
                <div className='modal' onClick={closeModal}>
                    <div className='modal-content' onClick={e => e.stopPropagation()}>
                        <h1>Crear Actividad</h1>
                        <input className="input-field" type="text" placeholder="Nombre" value={nombreActividad} onChange={e => setnombreActividad(e.target.value)} />
                        <input className="input-field" type="text" placeholder="Descripcion" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
                        <input className="input-field" type="text" placeholder="Costo" value={costo} onChange={e => setCosto(parseFloat(e.target.value))} />
                        <button className='round-button' onClick={(e) => { e.stopPropagation(); handleAddActivity(); }}>Guardar</button>
                    </div>
                </div>
            )}
            {showModal2 && (
                <div className='modal' onClick={closeModal2}>
                    <div className='modal-content' onClick={e => e.stopPropagation()}>
                        <h1>Editar presupuesto</h1>
                        <input className="input-field" type="text" placeholder="Nombre" value={nombrePresupuesto} onChange={e => setNombrePresupuesto(e.target.value)} />
                        <input className="input-field" type="text" placeholder="Monto" value={monto === 0 ? '' : monto} onChange={e => {
                            const value = parseFloat(e.target.value); setMonto(isNaN(value) || value <= 0 ? 0 : value);
                        }} />
                        <input className="input-field" type="text" placeholder="Objetivo" value={objtivoPresupuesto} onChange={e => setObjtivoPresupuesto(e.target.value)} />
                        {/* <input className="input-field" type="date" placeholder="Fecha Inicio" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
                        <input className="input-field" type="date" placeholder="Fecha final" value={fechaFinal} onChange={e => setFechaFinal(e.target.value)} /> */}
                        <button className='round-button' onClick={(e) => { e.stopPropagation(); handleEditBudget(); }}>Guardar</button>
                        <button className='round-button btn btn-danger' onClick={(e) => { e.stopPropagation(); closeModal2(); openModal5() }}>Eliminar presupuesto</button>
                    </div>
                </div>
            )}
            {showModal3 && (
                <div className='modal' onClick={closeModal3}>
                    <div className='modal-content' onClick={e => e.stopPropagation()}>
                        <h1>Seguro que desea eliminar la actividad?</h1>
                        <div>
                            <button className='round-button' onClick={(e) => { e.stopPropagation(); handleDeleteActivity(); }}>Eliminar</button>
                            <button className='round-button' onClick={(e) => { e.stopPropagation(); closeModal3() }}>No Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
            {showModal4 && (
                <div className='modal' onClick={closeModal4}>
                    <div className='modal-content' onClick={e => e.stopPropagation()}>
                        <h1>Editar Actividad</h1>
                        <input className="input-field" type="text" placeholder="Nombre" value={nombreActividadEdit} onChange={e => setnombreActividadEdit(e.target.value)} />
                        <input className="input-field" type="text" placeholder="Monto" value={costoEdit} onChange={e => setCostoEdit(e.target.value)} />
                        <input className="input-field" type="text" placeholder="Descripcion" value={descripcionEdit} onChange={e => setDescripcionEdit(e.target.value)} />
                        <button className='round-button' onClick={(e) => { e.stopPropagation(); handleEditActividad(selectedActivityId, { Nombre_Actividad: nombreActividadEdit, Descripcion: descripcionEdit, Costo: parseFloat(costoEdit) }); }}>Guardar</button>
                    </div>
                </div>
            )}
            {showModal5 && (
                <div className='modal' onClick={closeModal5}>
                    <div className='modal-content' onClick={e => e.stopPropagation()}>
                        <h1>Seguro que desea eliminar el presupuesto?</h1>
                        <div>
                            <button className='round-button' onClick={(e) => { e.stopPropagation(); handleDeletePresupuesto(); }}>Eliminar</button>
                            <button className='round-button' onClick={(e) => { e.stopPropagation(); closeModal5() }}>No Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PresupuestoCard;