import React, { Component } from 'react'
import config from '../config'
import { Form, Container } from "react-bootstrap";
import './Note.css'
import LoaderButton from "../components/LoaderButton";
import { API, Storage } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";
import { Link } from "react-router-dom";

export class Note extends Component {

  constructor(props) {
    super(props)
    this.file = null
    this.state = {
      isLoading: "",
      isDeleting: "",
      content: "",
      note: null,
      attachmentUrl: "",
    }
  }

  componentDidMount = async () => {
    const { noteId } = this.props.match.params
    try {
      const note = await API.get('notes', `/notes/${noteId}`)
      const { content, attachment } = note
      const attachmentUrl = await Storage.vault.get(attachment)

      this.setState({
        content,
        attachmentUrl,
        note,
      })

    } catch (e) {
      console.log(e)
      alert(e.message)
    }
  }

  formatFilename = (filename) => {
    return filename.replace(/^\w+-/, "")
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

  handleDelete = (e) => {
    e.preventDefault()
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    )
    if (!confirmed) {
      return
    }

    this.setState({ isDeleting: true })
    setTimeout(() => {
      console.log("delete")
      this.setState({ isDeleting: false })
    }, 1000);
  }

  render() {
    return (
      this.state.note &&
      <Container className="Note">
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="content">
            <Form.Control as="textarea"
              onChange={this.handleChange}
              value={this.state.content}
            />
          </Form.Group>
          <Form.Group controlId="file">
            <Form.Label>Attachment</Form.Label>
            <div className="attachment">
              <a href={this.state.attachmentUrl}
                rel="noopener noreferrer">
                {this.formatFilename(this.state.note.attachment)}
              </a>
            </div>
            <Form.Control onChange={this.handleFileChange} type="file" />
          </Form.Group>
          <LoaderButton
            block
            variant="outline-secondary"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Save"
            loadingText="Saving…"
          />
          <LoaderButton
            block
            onClick={this.handleDelete}
            variant="outline-danger"
            disabled={!this.validateForm()}
            isLoading={this.state.isDeleting}
            text="Delete"
            loadingText="Deleting…"
          />
        </Form>
      </Container>
    )
  }
}

export default Note
