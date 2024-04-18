import MenuAdmin from "./MenuAdmin";
import { fetchAccounts } from "./FuncionesUtiles";
import AccountCard from "./Cards/CuentasCard";
import { Account } from "./FuncionesUtiles";
import { useEffect, useState } from "react";

interface Props {
    setIsLogged: (value: boolean) => void;
}

export function HomeAdmin({ setIsLogged }: Props) {

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <MenuAdmin setIsLogged={setIsLogged} />
                <div className="col py-3">
                    <h1 className="left-align">Reportes:</h1>
                    <div className="App">
                        <iframe title="dashboard" width="1200" height="747"
                            src="https://app.powerbi.com/view?r=eyJrIjoiNWI5YzYzYTgtMjc2Zi00NDI4LWFmMzgtNDJmODZkOTAzMTY2IiwidCI6ImFmMmZkMTk2LTFkOWYtNDdiNC05MDY5LTM5MWE0NmY4MzYwMSIsImMiOjR9"
                            frameBorder="0"
                            allowFullScreen>
                        </iframe>
                    </div>
                </div>
            </div>
        </div>
    )
}