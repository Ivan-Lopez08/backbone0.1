import { useParams } from "react-router-dom";
import MenuAdmin from "../MenuAdmin";
import { useEffect, useState } from "react";
import { Option, fetchInver, fetchInversiones, fetchOpcionesByInversionId, inversion } from "../FuncionesUtiles";
import edit from "../../img/edit.png";
import axios from "axios";

interface Props {
    setIsLogged: (value: boolean) => void;
}

export function AdminInversion({ setIsLogged }: Props) {
    const { id } = useParams<{ id: string }>();
    const [inversion, setInversion] = useState<inversion>();
    const [inversionID, setInversionID] = useState<number | null>(null);
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [options, setOptions] = useState<Option[]>([])
    const [filtroNombreOpt, setFiltroNombreOpt] = useState('');
    const [filtroIDOpt, setFiltroIDOpt] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [nombre, setNombre] = useState(inversion?.Nombre);
    const [showModal2, setShowModal2] = useState(false);
    const [descripcion, setDescripcion] = useState(inversion?.Descripcion);
    const [showModal3, setShowModal3] = useState(false);
    const [video, setVideo] = useState(inversion?.Video);
    const [showModal4, setShowModal4] = useState(false);
    const [SelectedOptID, setSelectedOptID] = useState(0);
    const [NombreOpt, setNombreOpt] = useState('');
    const [enlaceOpt, setEnlaceOpt] = useState('');
    const [imagenOpt, setImagenOpt] = useState('');
    const [descripcionOpt, setDescripcionOpt] = useState('');
    const [showModal5, setShowModal5] = useState(false);
    const [showModal6, setShowModal6] = useState(false);

    const FetchInversion = async () => {
        if (id !== undefined) {
            const inversionID = parseInt(id, 10);
            setInversionID(inversionID);
            fetchInver(inversionID).then((data) => setInversion(data));
            fetchOpcionesByInversionId(inversionID).then((OptData) => setOptions(OptData));
        } else {
            window.alert("Error al conseguir los datos")
        }
    }

    useEffect(() => {
        if (inversion !== undefined) {
            setVideoUrl(`https://www.youtube.com/embed/${inversion.Video}`);
        }
    })

    useEffect(() => {
        FetchInversion();
    }, [])

    useEffect(() => {
        if (inversion) {
            setNombre(inversion.Nombre);
            setDescripcion(inversion.Descripcion);
            setVideo(inversion.Video);
        }
    }, [inversion]);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const openModal2 = () => {
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

    const openModal4 = (OptID: number) => {
        const optToEdit = options.find(option => option.ID_Opcion === OptID);
        if (optToEdit) {
            setNombreOpt(optToEdit.Nombre);
            setEnlaceOpt(optToEdit.Enlace);
            setImagenOpt(optToEdit.Imagen);
            setDescripcionOpt(optToEdit.Descripcion);
            setSelectedOptID(optToEdit.ID_Opcion)
            setShowModal4(true);
        }
    };

    const closeModal4 = () => {
        setShowModal4(false);
    };

    const openModal5 = (OptID: number) => {
        setSelectedOptID(OptID)
        setShowModal5(true);
    };

    const closeModal5 = () => {
        setShowModal5(false);
    };

    const openModal6 = () => {
        setShowModal6(true);
    };

    const closeModal6 = () => {
        setShowModal6(false);
    };

    const handleEditNombre = async () => {
        try {
            if (inversion && inversion.ID_Inversion) {
                const response = await axios.patch(`http://localhost:3000/api/v1/inversiones/${inversion.ID_Inversion}`, {
                    Nombre: nombre
                });
                if (response.status === 200) {
                    const updatedInversion = await fetchInver(inversion.ID_Inversion);
                    setInversion(updatedInversion);
                }
            } else {
                console.error("No se pudo obtener el ID de la cuenta");
            }
            closeModal()
        } catch (error) {
            console.error("Error al editar el nombre de la empresa:", error);
        }
    }

    const handleEditDescripcion = async () => {
        try {
            if (inversion && inversion.ID_Inversion) {
                const response = await axios.patch(`http://localhost:3000/api/v1/inversiones/${inversion.ID_Inversion}`, {
                    Descripcion: descripcion
                });
                if (response.status === 200) {
                    const updatedInversion = await fetchInver(inversion.ID_Inversion);
                    setInversion(updatedInversion);
                }
            } else {
                console.error("No se pudo obtener el ID de la cuenta");
            }
            closeModal2()
        } catch (error) {
            console.error("Error al editar el nombre de la empresa:", error);
        }
    }

    const handleEditVideo = async () => {
        try {
            if (inversion && inversion.ID_Inversion) {
                const response = await axios.patch(`http://localhost:3000/api/v1/inversiones/${inversion.ID_Inversion}`, {
                    Video: video
                });
                if (response.status === 200) {
                    const updatedInversion = await fetchInver(inversion.ID_Inversion);
                    setInversion(updatedInversion);
                }
            } else {
                console.error("No se pudo obtener el ID de la cuenta");
            }
            closeModal3()
        } catch (error) {
            console.error("Error al editar el nombre de la empresa:", error);
        }
    }

    const handleEditOpcion = async (optID: number, newData: Partial<Option>) => {
        try {
            if (inversionID) {
                const response = await axios.patch(`http://localhost:3000/api/v1/opciones-inversiones/${optID}`, newData);
                closeModal4()
                const updatedOptions = await fetchOpcionesByInversionId(inversionID);
                setOptions(updatedOptions);
            } else {
                console.error("No se pudo obtener el ID de la cuenta");
            }
        } catch (error) {
            console.error("Error al editar el usuario:", error);
        }
    }

    const handleDeleteOpt = async () => {
        await axios.delete(`http://localhost:3000/api/v1/opciones-inversiones/${SelectedOptID}`)
        FetchInversion();
        closeModal5();
    }

    const handleAddOpt = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/v1/opciones-inversiones', {
                Nombre: NombreOpt,
                Enlace: enlaceOpt,
                Imagen: imagenOpt,
                Descripcion: descripcionOpt,
                Inversion: inversion?.Nombre
            });
            console.log('Presupuesto creado exitosamente:', response.data);
            closeModal6();
            if (inversionID) {
                const updatedOptions = await fetchOpcionesByInversionId(inversionID);
                setOptions(updatedOptions);
            }
        } catch (error) {
            console.error('Error al crear el Presupuesto:', error);
            window.alert("No se pudo crear el presupuesto")
        }
    }

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <MenuAdmin setIsLogged={setIsLogged} />
                <div className="col py-3">
                    <h1>Administrar Inversion: {inversion?.Nombre}</h1>
                    <div className="contenedorColumnas">
                        <div className="columna1">
                            <div className="left-align">
                                <strong>Nombre: </strong>{inversion?.Nombre}
                                <button title='Edit' type="button" className="btn btn-outline-primary" onClick={openModal}>
                                    <img className='icon-sized' src={edit} alt="Icono de editar" />
                                </button>
                            </div>
                            <div className="left-align">
                                <strong>Descripcion: </strong> {inversion?.Descripcion}
                                <button title='Edit' type="button" className="btn btn-outline-primary" onClick={openModal2}>
                                    <img className='icon-sized' src={edit} alt="Icono de editar" />
                                </button>
                            </div>
                        </div>
                        <div className="columna2">
                            <div>
                                <strong>
                                    Video:
                                </strong>
                            </div>

                            <iframe className='video'
                                src={videoUrl}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            >
                            </iframe>
                            <div>
                                <button title='Edit' type="button" className="btn btn-outline-primary" onClick={openModal3}>
                                    Cambiar video
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="left-align titulo2">
                        <strong >
                            Opciones para invertir:
                        </strong>
                    </div>
                    <div className="contenedorColumnas">
                        <div className="columnaTabla">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Enlace</th>
                                        <th>Imagen</th>
                                        <th>Descripcion</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {options
                                        .filter((options) =>
                                            options.Nombre.toLowerCase().includes(filtroNombreOpt.toLowerCase()) &&
                                            (filtroIDOpt ? options.ID_Opcion === parseInt(filtroIDOpt) : true)
                                        )
                                        .map((options) => (
                                            <tr key={options.ID_Opcion}>
                                                <td>{options.ID_Opcion}</td>
                                                <td>{options.Nombre}</td>
                                                <td>{options.Enlace}</td>
                                                <td>{options.Imagen}</td>
                                                <td>{options.Descripcion}</td>
                                                <td>
                                                    <button type="button" className="btn btn-danger" onClick={() => openModal5(options.ID_Opcion)}>Eliminar</button>
                                                    <button type="button" className="btn btn-success" onClick={() => openModal4(options.ID_Opcion)}>Editar</button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            <div className="left-align">
                                <button type="button" className="btn btn-dark" onClick={openModal6}>Agregar otra opción</button>
                            </div>
                        </div>
                        <div className="columnaFiltro">
                            <div>
                                <h2>Filtrar Opciones</h2>
                                <h4 className="left-align">Nombre</h4>
                                <input className="input-field2"
                                    type="text"
                                    placeholder="Ingrese el nombre"
                                    value={filtroNombreOpt}
                                    onChange={(e) => setFiltroNombreOpt(e.target.value)}
                                />
                            </div>
                            <div>
                                <h4 className="left-align">ID</h4>
                                <input className="input-field2"
                                    type="text"
                                    placeholder="Ingrese el ID"
                                    value={filtroIDOpt}
                                    onChange={(e) => setFiltroIDOpt(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    {showModal && (
                        <div className='modal' onClick={closeModal}>
                            <div className='modal-content' onClick={e => e.stopPropagation()}>
                                <h1>Cambiar nombre</h1>
                                <input className="input-field" type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
                                <button className='round-button' onClick={(e) => { e.stopPropagation(); handleEditNombre(); }}>Guardar</button>
                            </div>
                        </div>
                    )}
                    {showModal2 && (
                        <div className='modal' onClick={closeModal2}>
                            <div className='modal-content' onClick={e => e.stopPropagation()}>
                                <h1>Cambiar Descripcion</h1>
                                <textarea className="input-field" placeholder="Descripcion" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
                                <button className='round-button' onClick={(e) => { e.stopPropagation(); handleEditDescripcion(); }}>Guardar</button>
                            </div>
                        </div>
                    )}
                    {showModal3 && (
                        <div className='modal' onClick={closeModal3}>
                            <div className='modal-content' onClick={e => e.stopPropagation()}>
                                <h1>Cambiar Video</h1>
                                <input className="input-field" type="text" placeholder="Video" value={video} onChange={e => setVideo(e.target.value)} />
                                <button className='round-button' onClick={(e) => { e.stopPropagation(); handleEditVideo(); }}>Guardar</button>
                            </div>
                        </div>
                    )}
                    {showModal4 && (
                        <div className='modal' onClick={closeModal4}>
                            <div className='modal-content' onClick={e => e.stopPropagation()}>
                                <h1>Editar Opcion</h1>
                                <input className="input-field" type="text" placeholder="Nombre" value={NombreOpt} onChange={e => setNombreOpt(e.target.value)} />
                                <input className="input-field" type="text" placeholder="Enlace" value={enlaceOpt} onChange={e => setEnlaceOpt(e.target.value)} />
                                <input className="input-field" type="text" placeholder="Imagen" value={imagenOpt} onChange={e => setImagenOpt(e.target.value)} />
                                <textarea className="input-field" placeholder="Descripcion" value={descripcionOpt} onChange={e => setDescripcionOpt(e.target.value)} />
                                <button className='round-button' onClick={(e) => { e.stopPropagation(); handleEditOpcion(SelectedOptID, { Nombre: NombreOpt, Enlace: enlaceOpt, Imagen: imagenOpt, Descripcion: descripcionOpt }); }}>Guardar</button>
                            </div>
                        </div>
                    )}
                    {showModal5 && (
                        <div className='modal' onClick={closeModal5}>
                            <div className='modal-content' onClick={e => e.stopPropagation()}>
                                <h1>Seguro que desea eliminar la opción?</h1>
                                <div>
                                    <button className='round-button' onClick={(e) => { e.stopPropagation(); handleDeleteOpt(); }}>Eliminar</button>
                                    <button className='round-button' onClick={(e) => { e.stopPropagation(); closeModal5() }}>No Eliminar</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {showModal6 && (
                        <div className='modal' onClick={closeModal6}>
                            <div className='modal-content' onClick={e => e.stopPropagation()}>
                                <h1>Agregar Opción</h1>
                                <input className="input-field" type="text" placeholder="Nombre" value={NombreOpt} onChange={e => setNombreOpt(e.target.value)} />
                                <input className="input-field" type="text" placeholder="Enlace" value={enlaceOpt} onChange={e => setEnlaceOpt(e.target.value)} />
                                <input className="input-field" type="text" placeholder="Imagen" value={imagenOpt} onChange={e => setImagenOpt(e.target.value)} />
                                <textarea className="input-field" placeholder="Descripcion" value={descripcionOpt} onChange={e => setDescripcionOpt(e.target.value)} />
                                <button className='round-button' onClick={(e) => { e.stopPropagation(); handleAddOpt(); }}>Guardar</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}