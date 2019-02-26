import React, { Component } from 'react'
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import './Login.css'
import { Auth } from "aws-amplify";

export class Login extends Component {
  state = {
    email: "",
    password: "",
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const user = await Auth.signIn(this.state.email, this.state.password)
      this.props.userHasAuthenticated(true)
      console.log(user)
    } catch (e) {
      alert(e.message)
    }
  }

  render() {
    console.log(this.props)
    return (
      <Container className="Login">
        <Form onSubmit={this.handleSubmit}>
          <Form.Group as={Row} controlId="email">
            <Form.Label column sm={2}>
              Email
              </Form.Label>
            <Col sm={10}>
              <Form.Control type="email" placeholder="Email"
                onChange={this.handleChange}
                value={this.state.email}
                autoFocus />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="password">
            <Form.Label column sm={2}>
              Password
            </Form.Label>
            <Col sm={10}>
              <Form.Control type="password" placeholder="Password"
                onChange={this.handleChange}
                value={this.state.password} />
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Col sm={{ span: 10, offset: 2 }}>
              <Button type="submit"
                variant="outline-secondary"
                block
                disabled={!this.validateForm()}
              >Log in</Button>
            </Col>
          </Form.Group>
        </Form>
      </Container>
    )
  }
}

export default Login
