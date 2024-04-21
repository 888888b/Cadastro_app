const Dados = [
    {
        id: '1',
        email: 'Test0034@mail.com',
        nome: 'Vitor'
    },
    {
        id: '2',
        email: 'Cuscuz0434@gmail.com',
        nome: 'Deutan'
    },{
        id: '3',
        email: 'Test0034@mail.com',
        nome: 'Jausin'
    },{
        id: '4',
        email: 'Cuscuz0434@gmail.com',
        nome: 'Dalagnou'
    }
];

function Cadastros() {
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
                            <th className="table-name table-title">Nome</th>
                        </tr>
                        {Dados.map( (item) => (
                            <tr>
                               <td className="table-id">{item.id}</td>
                               <td className="table-email">{item.email}</td>
                               <td className="table-name">{item.nome}</td>
                            </tr>
                        ))}
                    </table>
                </section>
            </section>
        </main>
    )
}

export default Cadastros;