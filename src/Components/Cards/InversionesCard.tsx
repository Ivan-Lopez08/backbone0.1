import React, { useEffect, useState } from 'react';
import { inversion } from '../FuncionesUtiles';
import { useNavigate } from 'react-router-dom';


interface InversionCardProps {
    inversion: inversion;
}

const InversionCard: React.FC<InversionCardProps> = ({ inversion }) => {
    const navigate = useNavigate();
    const [videoUrl, setVideoUrl] = useState<string>("");

    const verInversion = () => {
        navigate(`/AdminInversion/${inversion.ID_Inversion}`);
    };

    useEffect(() => {
        setVideoUrl(`https://www.youtube.com/embed/${inversion.Video}`);
    })

    return (
        <div className="card bg-ligthgray shadow-md rounded-lg p-4 d-flex">
            <div className='contenedorColumnas'>
                <div className='columna1 left-align'>
                    <div><strong>ID:</strong> {inversion.ID_Inversion}</div>
                    <div><strong>Nombre: </strong>{inversion.Nombre}</div>
                    <div><strong>Descripcion: </strong>{inversion.Descripcion}</div>
                    <button type="button" className="btn btn-secondary btn-lg btn-block mt-3" onClick={verInversion} style={{ width: '100%' }}>
                        Ver más
                    </button>
                </div>
                <div className='columna2'>
                    <iframe className='video'
                        src={videoUrl}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default InversionCard;