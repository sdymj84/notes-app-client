import React, { Component } from 'react'
import { Form, Row, Col, Container } from "react-bootstrap";
import './Signup.css'
import { Auth } from "aws-amplify";
import { Redirect } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";

export class Signup extends Component {
  state = {
    email: "",
    password: "",
    confirmPassword: "",
    isLoading: false,
    confirmationCode: "",
    newUser: null,
  }

  confirmPasswordInput = React.createRef()

  validateForm = () => {
    return this.state.email.length > 0
      && this.state.password.length > 0
      && this.state.confirmPassword.length > 0
  }

  validateConfirmationCode = () => {
    return this.state.confirmationCode > 0
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit = async (e) => {
    e.preventDefault()

    if (this.state.password !== this.state.confirmPassword) {
      alert("Passwords don't match")
      this.confirmPasswordInput.current.focus()
    } else {
      this.setState({ isLoading: true })

      try {
        const newUser = await Auth.signUp(this.state.email, this.state.password)
        this.setState({
          newUser: true,
          isLoading: false
        })
        console.log(newUser)
      }
      catch (e) {
        console.log(e)
        if (e.name === "UsernameExistsException") {
          Auth.resendSignUp(this.state.email)
          alert("Email already exist, if you already have signed up but haven't verified email yet please check email for confirmation code we just sent again.")
          this.setState({ newUser: true })
        }

        this.setState({ isLoading: false })
      }
    }
  }

  handleConfirmationSubmit = async (e) => {
    e.preventDefault()

    this.setState({ isLoading: true })

    try {
      await Auth.confirmSignUp(this.state.email, this.state.confirmationCode)
      const user = await Auth.signIn(this.state.email, this.state.password)
      this.props.userHasAuthenticated(true)
      console.log(user)
    }
    catch (e) {
      console.log(e.message)
      alert(e.message)
      this.setState({ isLoading: false })
    }
  }

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to='/' />
    }

    return (
      <Container className="Signup">
        {this.state.newUser
          ? this.renderConfirmationForm()
          : this.renderForm()}
      </Container>
    )
  }

  renderConfirmationForm() {
    return (
      <Form onSubmit={this.handleConfirmationSubmit}>

        <Form.Group controlId="confirmationCode">
          <Form.Control type="text" placeholder="Confirmation Code"
            onChange={this.handleChange}
            value={this.state.confirmationCode}
            autoFocus />
          <span className="help-tip">Please check your email for confirmation code</span>
        </Form.Group>

        <Form.Group>
          <LoaderButton
            block
            variant="outline-secondary"
            disabled={!this.validateConfirmationCode()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Confirm"
            loadingText="Verifying code..."
          />
        </Form.Group>
      </Form>
    )
  }

  renderForm() {
    return (
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

        <Form.Group as={Row} controlId="confirmPassword">
          <Form.Label column sm={2}>
            Confirm Password
            </Form.Label>
          <Col sm={10}>
            <Form.Control type="password" placeholder="Confirm Password"
              onChange={this.handleChange}
              value={this.state.confirmPassword}
              ref={this.confirmPasswordInput} />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Col sm={{ span: 10, offset: 2 }}>
            <LoaderButton
              block
              variant="outline-secondary"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Signup"
              loadingText="Signing up..."
            />

          </Col>
        </Form.Group>
      </Form>
    )
  }
}

export default Signup
