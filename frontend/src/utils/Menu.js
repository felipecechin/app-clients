import {Container, Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";

function Menu() {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="#home">App Clientes</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link to={'/'} className={'nav-link'}>Cadastro</Link>
                        <Link to={'/listar'} className={'nav-link'}>Listar</Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Menu;
