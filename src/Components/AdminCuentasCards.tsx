import MenuAdmin from "./MenuAdmin";
import { fetchAccounts } from "./FuncionesUtiles";
import AccountCard from "./Cards/CuentasCard";
import { Account } from "./FuncionesUtiles";
import { useEffect, useState } from "react";

interface Props {
    setIsLogged: (value: boolean) => void;
}

export function AdminCuentas({ setIsLogged }: Props) {
    const [accounts, setAccounts] = useState<Account[]>([]);

    useEffect(() => {
        fetchAccounts().then((data) => setAccounts(data));
    }, []);

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <MenuAdmin setIsLogged={setIsLogged} />
                <div className="col py-3">
                    <h1 className="left-align">Administrar cuentas</h1>
                    <div className="App">
                        {accounts.map((account) => (
                            <AccountCard key={account.ID_Cuenta} account={account} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}