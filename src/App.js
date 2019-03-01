import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import './App.css';
import Routes from './Routes';
import { Auth } from "aws-amplify";

class App extends Component {
  state = {
    isAuthenticated: false,
    isAuthenticating: true,
  }

  userHasAuthenticated = authenticated => {
    this.setState({
      isAuthenticated: authenticated
    })
  }

  componentDidMount = async () => {
    try {
      await Auth.currentSession()
      this.userHasAuthenticated(true)
    } catch (e) {
      console.log(e.message)
    }

    this.setState({ isAuthenticating: false })
  }

  handleLogout = async () => {
    try {
      await Auth.signOut()
      this.userHasAuthenticated(false)
    } catch (e) {
      console.log(e.response)
      alert(e.response.data.error)
    }
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    }

    return (
      !this.state.isAuthenticating &&
      <Container className="App">
        <Navbar bg="light" fluid="true" collapseOnSelect>
          <Navbar.Brand>
            <Link className="link" to="/">Scratch</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end" >
            <Nav>
              {this.state.isAuthenticated
                ? < Nav.Item onClick={this.handleLogout}>
                  <Nav.Link>Logout</Nav.Link>
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
      </Container >
    );
  }
}

export default App;
