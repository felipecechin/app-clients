import {Button, Card, Col, Container, Form, Nav, Navbar, NavDropdown, Row} from "react-bootstrap";
import {useState} from "react";
import api from "../services/api";
import {toast} from "react-toastify";
import routes from "../Routes";
import Menu from "../utils/Menu";

function ClientForm() {
    const [nome, setNome] = useState("")
    const [dataNascimento, setDataNascimento] = useState("")
    const [cpf, setCpf] = useState("")
    const [celular, setCelular] = useState("")
    const [email, setEmail] = useState("")
    const [endereco, setEndereco] = useState("")
    const [observacao, setObservacao] = useState("")

    async function handleSubmit(e) {
        e.preventDefault();
        const data = {
            nome,
            data_nascimento: dataNascimento,
            cpf,
            email,
            celular,
            endereco,
            observacao
        }
        await api.post("/api/cliente", data).then(response => {
            toast.success(response.mensagem)
        }).catch(error => {
            let erros = error.response.data.erro;
            console.log(erros)
            console.log(Object.values(erros))
            erros = Object.values(erros)
            erros.forEach((item) => {
                item.forEach((mensagem) => {
                    toast.error(mensagem)
                })
            })
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
                            <Form onSubmit={handleSubmit}>
                                <Card.Header>Cadastro de cliente</Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Nome</Form.Label>
                                                <Form.Control type="text" value={nome}
                                                              onChange={(e) => setNome(e.currentTarget.value)}/>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Data de nascimento</Form.Label>
                                                <Form.Control type="text" value={dataNascimento}
                                                              onChange={(e) => setDataNascimento(e.currentTarget.value)}/>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>CPF</Form.Label>
                                                <Form.Control type="text" value={cpf}
                                                              onChange={(e) => setCpf(e.currentTarget.value)}/>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Celular</Form.Label>
                                                <Form.Control type="text" value={celular}
                                                              onChange={(e) => setCelular(e.currentTarget.value)}/>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>E-mail</Form.Label>
                                                <Form.Control type="email" value={email}
                                                              onChange={(e) => setEmail(e.currentTarget.value)}/>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Endereço completo</Form.Label>
                                                <Form.Control type="text" value={endereco}
                                                              onChange={(e) => setEndereco(e.currentTarget.value)}/>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <Form.Label>Observações</Form.Label>
                                            <Form.Control as={'textarea'} value={observacao}
                                                          onChange={(e) => setObservacao(e.currentTarget.value)}/>
                                        </Col>
                                    </Row>
                                </Card.Body>
                                <Card.Footer className={"d-flex justify-content-end"}>
                                    <Button variant={"primary"} type={"submit"}>Enviar</Button>
                                </Card.Footer>
                            </Form>
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
