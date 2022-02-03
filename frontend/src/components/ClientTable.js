import {Button, Card, Col, Container, Form, InputGroup, Nav, Row, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import Menu from "../utils/Menu";
import api from "../services/api";
import {toast} from "react-toastify";
import {useHistory} from "react-router-dom";
import ReactPaginate from "react-paginate";

function ClientForm() {
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [clients, setClients] = useState([])
    const history = useHistory();
    useEffect(() => {
        setPageCount(Math.ceil(total / 10))
    }, [total])

    const getClients = async () => {
        try {
            const result = await api.get('/api/cliente?search=' + search + '&page=' + page);
            if (result.data) {
                setTotal(result.data.total);
                setClients(result.data.clientes);
            }
        } catch (e) {
            toast.error('Erro ao buscar registros de protocolo(s).')
        }
    }
    useEffect(() => {
        getClients();
    }, [page]);

    useEffect(() => {
        const searchText = async () => {
            await setPage(1);
            getClients();
        }
        searchText();
    }, [search])

    const handlePageClick = (data) => {
        setPage(data.selected + 1)
    }

    const TableRow = (props) => {
        return (
            <tr>
                <td className={'text-wrap'}>
                    {props.nome}
                </td>
                <td>
                    {props.email}
                </td>
                <td>
                    <Button variant="primary" onClick={() => handleEditClient(props.id)}
                            className="text-white ms-2">
                        Editar
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteClient(props.id)}
                            className="text-white ms-2">
                        Excluir
                    </Button>
                </td>
            </tr>
        );
    };

    const handleEditClient = (id) => {
        history.push('/editar/' + id)
    }

    const handleDeleteClient = async (id) => {
        await api.delete('/api/cliente/' + id
        ).then(response => {
            toast.success(response.data.mensagem);
            getClients();
        }).catch(error => {
            toast.error(error.data.erro);
        })
    }

    return (
        <>
            <Menu/>
            <Container>
                <Row className={'mt-2'}>
                    <Col md={2}>
                    </Col>
                    <Col md={8}>

                        <Card>
                            <Card.Header>Lista de clientes</Card.Header>
                            <Card.Body>
                                <Row className="justify-content-start align-items-center mb-3">
                                    <Col xs={8} md={6} lg={6}>
                                        <InputGroup size={"sm"}>
                                            <InputGroup.Text>
                                                Pesquisar
                                            </InputGroup.Text>
                                            <Form.Control type="text" placeholder="Nome ou e-mail" value={search}
                                                          onChange={(e) => setSearch(e.currentTarget.value)}/>
                                        </InputGroup>
                                    </Col>
                                </Row>
                                <Table striped bordered hover>
                                    <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>E-mail</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {clients.map(c => <TableRow key={`clients-${c.id}`} {...c} />)}
                                    </tbody>
                                </Table>
                            </Card.Body>
                            <Card.Footer className="px-3 border-0 d-lg-flex align-items-center justify-content-between">
                                <Nav>
                                    {pageCount > 0 && (
                                        <ReactPaginate
                                            previousLabel={'Prévio'}
                                            nextLabel={'Próximo'}
                                            breakLabel={'...'}
                                            pageCount={pageCount}
                                            marginPagesDisplayed={0}
                                            pageRangeDisplayed={3}
                                            onPageChange={handlePageClick}
                                            containerClassName={'pagination mb-2 mb-lg-0'}
                                            pageClassName={'page-item'}
                                            pageLinkClassName={'page-link'}
                                            previousClassName={'page-item'}
                                            previousLinkClassName={'page-link'}
                                            nextClassName={'page-item'}
                                            nextLinkClassName={'page-link'}
                                            breakClassName={'page-item'}
                                            breakLinkClassName={'page-link'}
                                            activeClassName={'active'}
                                            forcePage={page - 1}
                                        />
                                    )}
                                </Nav>
                                {total > 0 ? (
                                    <small
                                        className="fw-bold">Mostrando <b>{clients.length}</b> de <b>{total}</b> registro(s).</small>
                                ) : <small className="fw-bold">Sem registros.</small>}
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col md={2}>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default ClientForm;
