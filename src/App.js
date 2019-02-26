import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import './App.css';
import Routes from './Routes';

class App extends Component {
  state = {
    isAuthenticated: false,
  }

  userHasAuthenticated = authenticated => {
    this.setState({
      isAuthenticated: authenticated
    })
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    }

    return (
      <Container className="App">
        <Navbar bg="light" fluid="true" collapseOnSelect>
          <Navbar.Brand>
            <Link className="link" to="/">Scratch</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end" >
            <Nav>
              {this.state.isAuthenticated
                ? <Nav.Item>
                  <LinkContainer to="/logout">
                    <Nav.Link>Logout</Nav.Link>
                  </LinkContainer>
                </Nav.Item>
                : <Fragment>
                  <Nav.Item>
                    <LinkContainer to="/signup">
                      <Nav.Link>Signup</Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                  <Nav.Item>
                    <LinkContainer to="/login">
                      <Nav.Link>Login</Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                </Fragment>}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </Container>
    );
  }
}

export default App;
