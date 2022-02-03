import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import {useState} from "react";
import api from "../services/api";
import {toast} from "react-toastify";
import Menu from "../utils/Menu";
import InputMask from 'react-input-mask';

function ClientForm() {
    const [nome, setNome] = useState("")
    const [dataNascimento, setDataNascimento] = useState("")
    const [cpf, setCpf] = useState("")
    const [celular, setCelular] = useState("")
    const [email, setEmail] = useState("")
    const [endereco, setEndereco] = useState("")
    const [observacao, setObservacao] = useState("")
    const [esconderSubmit, setEsconderSubmit] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault();
        setEsconderSubmit(true);
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
            toast.success(response.data.mensagem)
            setNome("")
            setDataNascimento("")
            setCpf("")
            setEmail("")
            setCelular("")
            setEndereco("")
            setObservacao("")
        }).catch(error => {
            let erros = error.response.data.erro;
            erros = Object.values(erros);
            erros.forEach((item) => {
                item.forEach((mensagem) => {
                    toast.error(mensagem)
                })
            })
        }).finally(() => {
            setEsconderSubmit(false)
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
                                                              onChange={(e) => setNome(e.currentTarget.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Data de nascimento</Form.Label>
                                                <InputMask
                                                    mask={'99/99/9999'}
                                                    formatChars={{9: '[0-9]'}}
                                                    onChange={(e) => setDataNascimento(e.currentTarget.value)}
                                                    className={'form-control'}
                                                    placeholder={''}
                                                    value={dataNascimento}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>CPF</Form.Label>
                                                <InputMask
                                                    mask={'999.999.999-99'}
                                                    formatChars={{9: '[0-9]'}}
                                                    onChange={(e) => setCpf(e.currentTarget.value)}
                                                    className={'form-control'}
                                                    placeholder={''}
                                                    value={cpf}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Celular</Form.Label>
                                                <InputMask
                                                    mask={'(99) 9999-9999'}
                                                    formatChars={{9: '[0-9]'}}
                                                    onChange={(e) => setCelular(e.currentTarget.value)}
                                                    className={'form-control'}
                                                    placeholder={''}
                                                    value={celular}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>E-mail</Form.Label>
                                                <Form.Control type="email" value={email}
                                                              onChange={(e) => setEmail(e.currentTarget.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Endereço completo</Form.Label>
                                                <Form.Control type="text" value={endereco}
                                                              onChange={(e) => setEndereco(e.currentTarget.value)}
                                                />
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
                                    {!esconderSubmit && <Button variant={"primary"} type={"submit"}>Enviar</Button>}
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
