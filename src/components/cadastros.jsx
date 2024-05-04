import { useEffect, useState } from "react";

function Cadastros() {
    const [usersData, setUsersData] = useState(undefined);

   useEffect(() => {
        const fetchUsersData = async () => {
            const response = await fetch('http://localhost:50100/usersData',
            {method:'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok){
            const data = await response.json();
            if (data){
                setUsersData(data.Dados);
            }
        }else{
            setTimeout(() => {
                fetchUsersData();
            }, 2000);
        }
    }

    fetchUsersData();
   },[]);

    return(
        <main className='cadastros-page'>
            <section id="content-container">
                <div className="section-title">
                    <h1>Lista de Usuarios</h1>
                </div>
                <section className="table-container">
                    <table border={1}>
                        <tr>
                            <th className="table-id table-title">Id</th>
                            <th className="table-email table-title">Email</th>
                            <th className="table-name table-title">Criado</th>
                        </tr>
                        {usersData ? (
                            usersData.map( (item) => (
                                <tr>
                                   <td className="table-id">{item.id}</td>
                                   <td className="table-email">{item.email}</td>
                                   <td className="table-name">{item.created}</td>
                                </tr>
                            ))
                        ): null}
                    </table>
                </section>
            </section>
        </main>
    )
}

export default Cadastros;