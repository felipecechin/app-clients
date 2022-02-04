import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import api from "../services/api";
import {toast} from "react-toastify";
import Menu from "../utils/Menu";
import InputMask from 'react-input-mask';
import {useLocation, useParams} from "react-router-dom";
import moment from "moment";

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
                const result = await api.get('/api/client/' + id);
                if (result.data) {
                    setName(result.data.name)
                    let date = moment(result.data.birthdate, 'YYYY-MM-DD')
                    setBirthDate(date.format('DD/MM/YYYY'))
                    setCpf(result.data.cpf)
                    setCellPhone(result.data.cellphone)
                    setEmail(result.data.email)
                    setAddress(result.data.address)
                    setNote(result.data.note || '')
                }
            } catch (e) {
                toast.error('Erro ao buscar cliente.')
            }
        }

        if (id) {
            getClient(id)
        }
    }, [id])

    async function handleSubmit(e) {
        e.preventDefault();
        const data = {
            name,
            birthdate: birthDate,
            cpf,
            email,
            cellphone: cellPhone,
            address
        }
        const isEmpty = Object.values(data).some(x => (x == null || x === ''));
        if (isEmpty) {
            toast.error('Por favor, preencha todos os campos obrigatórios')
            return
        }
        setHiddenButton(true);
        data.note = note
        if (id) {
            await api.put("/api/client/" + id, data).then(response => {
                toast.success(response.data.message)
            }).catch(error => {
                if (error.response) {
                    let errors = error.response.data.error;
                    errors = Object.values(errors);
                    errors.forEach((item) => {
                        item.forEach((message) => {
                            toast.error(message)
                        })
                    })
                } else {
                    toast.error('Ocorreu algum erro ao enviar formulário')
                }
            }).finally(() => {
                setHiddenButton(false)
            })
        } else {
            await api.post("/api/client", data).then(response => {
                toast.success(response.data.message)
                setName("")
                setBirthDate("")
                setCpf("")
                setEmail("")
                setCellPhone("")
                setAddress("")
                setNote("")
            }).catch(error => {
                if (error.response) {
                    let errors = error.response.data.error;
                    errors = Object.values(errors);
                    errors.forEach((item) => {
                        item.forEach((message) => {
                            toast.error(message)
                        })
                    })
                } else {
                    toast.error('Ocorreu algum erro ao enviar formulário')
                }
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
                                    {id && 'Editar cliente (obrigatórios *)'}
                                    {!id && 'Cadastro de cliente (obrigatórios *)'}
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Nome*</Form.Label>
                                                <Form.Control type="text" value={name}
                                                              onChange={(e) => setName(e.currentTarget.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Data de nascimento*</Form.Label>
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
                                                <Form.Label>CPF*</Form.Label>
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
                                                <Form.Label>Celular*</Form.Label>
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
                                                <Form.Label>E-mail*</Form.Label>
                                                <Form.Control type="email" value={email}
                                                              onChange={(e) => setEmail(e.currentTarget.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Endereço completo*</Form.Label>
                                                <Form.Control type="text" value={address}
                                                              onChange={(e) => setAddress(e.currentTarget.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <Form.Label>Observação</Form.Label>
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
