import React, { Component } from 'react'
import config from '../config'
import { Form, Container } from "react-bootstrap";
import './NewNote.css'
import LoaderButton from "../components/LoaderButton";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";

export class NewNote extends Component {

  constructor(props) {
    super(props)

    // We use a class property instead of saving it in the state 
    // because the file object we save does not change or drive the rendering of our component.
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
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`)
      return
    }

    this.setState({ isLoading: true })

    // create note
    try {
      const attachment = this.file
        ? await s3Upload(this.file)
        : null

      const result = await API.post('notes', '/notes', {
        body: {
          attachment,
          content: this.state.content
        }
      })

      console.log(result)
      this.props.history.push('/')
    } catch (e) {
      console.log(e.message)
      alert(e.message)
      this.setState({ isLoading: false })
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

