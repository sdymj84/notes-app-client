import React, { Component } from 'react'
import config from '../config'
import { Form, Container } from "react-bootstrap";
import './Note.css'
import LoaderButton from "../components/LoaderButton";
import { API, Storage } from "aws-amplify";
import { s3Upload, s3Delete } from "../libs/awsLib";

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
      const attachmentUrl = attachment && await Storage.vault.get(attachment)

      this.setState({
        content,
        attachmentUrl,
        note,
      })

    } catch (e) {
      console.log(e.response)
      alert(e.response.data.error)
      this.props.history.push('/')
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
    console.log(this.file)
  }

  handleSubmit = async (e) => {
    e.preventDefault()

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`)
      return
    }

    this.setState({ isLoading: true })

    // save note
    try {
      const attachment = this.file
        ? await s3Upload(this.file)
        : this.state.note.attachment

      const { noteId } = this.props.match.params
      await API.put('notes', `/notes/${noteId}`, {
        body: {
          attachment,
          content: this.state.content
        }
      })

      this.props.history.push('/')
    } catch (e) {
      console.log(e.response)
      alert(e.response.data.error)
      this.setState({ isLoading: false })
    }
  }

  handleDelete = async (e) => {
    e.preventDefault()
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    )
    if (!confirmed) {
      return
    }

    this.setState({ isDeleting: true })

    const { noteId } = this.props.match.params
    console.log(noteId)

    try {
      await s3Delete(this.state.note.attachment)
      await API.del('notes', `/notes/${noteId}`)
      this.props.history.push('/')
    } catch (e) {
      console.log(e.response)
      alert(e.response.data.error)
      this.setState({ isDeleting: false })
    }

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
            {this.state.note.attachment &&
              <div className="attachment">
                <a href={this.state.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer">
                  {this.formatFilename(this.state.note.attachment)}
                </a>
              </div>}
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
