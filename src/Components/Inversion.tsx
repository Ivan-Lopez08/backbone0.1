import { useParams } from "react-router-dom";
import Menu from "./Menu";
import { useEffect, useState } from "react";
import axios from "axios";
import OptionCard from "./Cards/OpcionCard";
import { Option, fetchOptions } from "./FuncionesUtiles";

interface Props {
    setIsLogged: (value: boolean) => void;
}

interface inversion {
    ID_Inversion: number;
    Nombre: String;
    Descripcion: string;
    Video: string;
}

export function Inversion({ setIsLogged }: Props) {
    const { id } = useParams<{ id: string }>();
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [inversion, setInversion] = useState<inversion>()
    const [options, setOptions] = useState<Option[]>([]);

    useEffect(() => {
        // Obtener la información de la inversión utilizando el ID
        axios.get(`http://localhost:3000/api/v1/inversiones/${id}`)
            .then(response => {
                const inversionData: inversion = response.data;
                // Establecer el enlace del video en el estado
                setInversion(inversionData);
                setVideoUrl(`https://www.youtube.com/embed/${inversionData.Video}`);
            })
            .catch(error => {
                console.error("Error al obtener la información de la inversión:", error);
            });
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchOptions(parseInt(id)).then((data) => setOptions(data));
        }
    }, [id]);



    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <Menu setIsLogged={setIsLogged}/>
                <div className="col py-3">
                    <h1 className="left-align">Inversión en {inversion?.Nombre}</h1>
                    <div className="video-container">
                        <iframe
                            src={videoUrl}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                    <div className="left-align">
                        <div>
                            <h4><strong>Aqui tienes una breve descripcion de este metodo de inversion: </strong></h4>
                            <p className="font-weight-normal">{inversion?.Descripcion}</p>
                        </div>                       
                    </div>
                    <h4 className="left-align">Lugares donde puedes invertir:</h4>
                    <div className="row">
                    {options.map((opt) => (
                      <OptionCard key={opt.ID_Opcion} Opciones={opt} />
                  ))}
                    </div>
                </div>
            </div>
        </div>
    )
}