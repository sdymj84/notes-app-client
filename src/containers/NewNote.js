import React, { Component } from 'react'
import config from '../config'
import { Form, Container } from "react-bootstrap";
import './NewNote.css'
import LoaderButton from "../components/LoaderButton";

export class NewNote extends Component {

  constructor(props) {
    super(props)
    this.file = null
    this.state = {
      isLoading: "",
      content: "",
    }
  }

  validateForm = () => {
    return this.state.content.length > 0
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleFileChange = (e) => {
    this.file = e.target.files[0]
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert("")
    }

  }

  render() {
    return (
      <Container className="NewNote">
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="content">
            <Form.Control as="textarea"
              onChange={this.handleChange}
              value={this.state.content}
            />
          </Form.Group>
          <Form.Group controlId="file">
            <Form.Label>Attachment</Form.Label>
            <Form.Control onChange={this.handleFileChange} type="file" />
          </Form.Group>
          <LoaderButton
            block
            variant="outline-secondary"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Create"
            loadingText="Creating…"
          />
        </Form>
      </Container>
    )
  }
}

export default NewNote
