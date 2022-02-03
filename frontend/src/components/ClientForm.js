import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import api from "../services/api";
import {toast} from "react-toastify";
import Menu from "../utils/Menu";
import InputMask from 'react-input-mask';
import {useLocation, useParams} from "react-router-dom";

function ClientForm() {
    const {id} = useParams();
    const [name, setName] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [cpf, setCpf] = useState("")
    const [cellPhone, setCellPhone] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")
    const [note, setNote] = useState("")
    const [hiddenButton, setHiddenButton] = useState(false)
    const location = useLocation();
    useEffect(() => {
        if (location.pathname === '/') {
            setName("")
            setBirthDate("")
            setCpf("")
            setEmail("")
            setCellPhone("")
            setAddress("")
            setNote("")
        }
    }, [location]);


    useEffect(() => {
        async function getClient(id) {
            try {
                const result = await api.get('/api/cliente/' + id);
                if (result.data) {
                    setName(result.data.nome)
                }
            } catch (e) {
                toast.error('Erro ao buscar cliente.')
            }
        }

        if (id) {
            getClient(id)
        }
    }, [])

    async function handleSubmit(e) {
        e.preventDefault();
        setHiddenButton(true);
        const data = {
            nome: name,
            data_nascimento: birthDate,
            cpf,
            email,
            celular: cellPhone,
            endereco: address,
            observacao: note
        }

        if (id) {
            await api.put("/api/cliente/" + id, data).then(response => {
                toast.success(response.data.mensagem)
            }).catch(error => {
                let erros = error.response.data.erro;
                erros = Object.values(erros);
                erros.forEach((item) => {
                    item.forEach((mensagem) => {
                        toast.error(mensagem)
                    })
                })
            }).finally(() => {
                setHiddenButton(false)
            })
        } else {
            await api.post("/api/cliente", data).then(response => {
                toast.success(response.data.mensagem)
                setName("")
                setBirthDate("")
                setCpf("")
                setEmail("")
                setCellPhone("")
                setAddress("")
                setNote("")
            }).catch(error => {
                let erros = error.response.data.erro;
                erros = Object.values(erros);
                erros.forEach((item) => {
                    item.forEach((mensagem) => {
                        toast.error(mensagem)
                    })
                })
            }).finally(() => {
                setHiddenButton(false)
            })
        }
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
                                <Card.Header>
                                    {id && 'Editar cliente'}
                                    {!id && 'Cadastro de cliente'}</Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Nome</Form.Label>
                                                <Form.Control type="text" value={name}
                                                              onChange={(e) => setName(e.currentTarget.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Data de nascimento</Form.Label>
                                                <InputMask
                                                    mask={'99/99/9999'}
                                                    formatChars={{9: '[0-9]'}}
                                                    onChange={(e) => setBirthDate(e.currentTarget.value)}
                                                    className={'form-control'}
                                                    placeholder={''}
                                                    value={birthDate}
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
                                                    onChange={(e) => setCellPhone(e.currentTarget.value)}
                                                    className={'form-control'}
                                                    placeholder={''}
                                                    value={cellPhone}
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
                                                <Form.Control type="text" value={address}
                                                              onChange={(e) => setAddress(e.currentTarget.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <Form.Label>Observações</Form.Label>
                                            <Form.Control as={'textarea'} value={note}
                                                          onChange={(e) => setNote(e.currentTarget.value)}/>
                                        </Col>
                                    </Row>
                                </Card.Body>
                                <Card.Footer className={"d-flex justify-content-end"}>
                                    {!hiddenButton && <Button variant={"primary"} type={"submit"}>Enviar</Button>}
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
