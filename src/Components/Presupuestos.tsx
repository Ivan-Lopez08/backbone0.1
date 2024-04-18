import Menu from "./Menu";
import { Presupuesto, fetchPresupuestos } from "./FuncionesUtiles";
import { useEffect, useState } from "react";
import { useAuth } from "./UserContext";
import PresupuestoCard from "./Cards/PresuouestoCard";
import axios from "axios";

interface Props {
    setIsLogged: (value: boolean) => void;
}

export function Presupuestos({ setIsLogged }: Props) {
    const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
    const auth = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [nombrePresupuesto, setNombrePresupuesto] = useState('')
    const [fechaInicio, setFechaInicio] = useState('')
    const [fechaFinal, setFechaFinal] = useState('')
    const [monto, setMonto] = useState('')
    const [objetivo, setObjetivo] = useState('')

    const fetchData = async () => {
        if (auth.user) {
            fetchPresupuestos(auth.user.Cuenta.ID_Cuenta).then((data) => setPresupuestos(data));
        }
    };

    useEffect(() => {
        // Obtener la fecha de hoy
        const today = new Date();
        // Establecer la fecha de inicio como la fecha de hoy (en formato ISO)
        setFechaInicio(today.toISOString().split('T')[0]);

        // Obtener la fecha dentro de un mes
        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
        // Establecer la fecha final como la fecha dentro de un mes (en formato ISO)
        setFechaFinal(oneMonthFromNow.toISOString().split('T')[0]);
    }, []);


    useEffect(() => {
        fetchData()
    }, [auth.user]);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleAddBudget = async () => {
        if (nombrePresupuesto.trim() === '') {
            window.alert("El nombre del presupuesto no puede estar vacío.");
            return;
        }
        
        const montoNumber = parseFloat(monto);
        if (isNaN(montoNumber) || montoNumber <= 0) {
            window.alert("El monto debe ser un número válido y mayor que cero.");
            return;
        }
        try {
            console.log(monto, nombrePresupuesto, fechaInicio, fechaFinal, auth.user?.Cuenta.Nombre)
            const response = await axios.post('http://localhost:3000/api/v1/presupuestos', {
                Monto_Asignado: parseFloat(monto),
                Nombre: nombrePresupuesto,
                Objetivo: objetivo,
                Fecha_Inicio: fechaInicio,
                Fecha_Final: fechaFinal,
                Cuenta: auth.user?.Cuenta.Nombre
            });
            setNombrePresupuesto('');
            setMonto('');
            setObjetivo('');
            console.log('Presupuesto creado exitosamente:', response.data);
            closeModal();
            fetchData();
        } catch (error) {
            console.error('Error al crear el Presupuesto:', error);
            window.alert("No se pudo crear el presupuesto")
        }
    }

    const handleUpdatePresupuestos = () => {
        fetchData();
    };

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <Menu setIsLogged={setIsLogged} />
                <div className="col py-3">
                    <h1 className="left-align">Mis presupuestos</h1>

                    <div className="d-flex justify-content-start mb-3">
                        <button type="button" className="btn btn-dark" onClick={openModal}>Nuevo presupuesto</button>
                    </div>
                    {presupuestos.length === 0 && (
                        <h4>Aun no ha creado ningún presupuesto</h4>
                    )}
                    <div className="row">
                        {presupuestos.map((presupuesto) => (
                            <PresupuestoCard key={presupuesto.ID_Presupuesto} Presupuesto={presupuesto} onUpdatePresupuestos={handleUpdatePresupuestos} />
                        ))}
                    </div>
                    {showModal && (
                        <div className='modal' onClick={closeModal}>
                            <div className='modal-content' onClick={e => e.stopPropagation()}>
                                <h1>Crear Presupuesto</h1>
                                <input className="input-field" type="text" placeholder="Nombre" value={nombrePresupuesto} onChange={e => setNombrePresupuesto(e.target.value)} />
                                <input className="input-field" type="text" placeholder="Monto" value={monto} onChange={e => setMonto(e.target.value)} />
                                <input className="input-field" type="text" placeholder="Objetivo" value={objetivo} onChange={e => setObjetivo(e.target.value)} />
                                <button className='round-button' onClick={(e) => { e.stopPropagation(); handleAddBudget(); }}>Guardar</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}