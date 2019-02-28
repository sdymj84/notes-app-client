import React, { Component, Fragment } from 'react'
import { Redirect } from "react-router-dom";
import { Container, ListGroup } from "react-bootstrap";
import { API } from "aws-amplify";
import { GoPlus } from "react-icons/go";
import "./Home.css"

export class Home extends Component {

  state = {
    isLoading: true,
    notes: [],
  }

  componentDidMount = async () => {
    if (!this.props.isAuthenticated) {
      return
    }

    try {
      const notes = await API.get('notes', `/notes`)
      notes.sort((a, b) => a.createdAt < b.createdAt
        ? 1 : ((b.createdAt < a.createdAt) ? -1 : 0))
      this.setState({ notes }, () => console.log(this.state.notes))
    } catch (e) {
      console.log(e.message)
      alert(e.message)
    }

    this.setState({ isLoading: false })
  }

  renderLander() {
    return (
      <div className="Home">
        <div className="lander">
          <h1>Scratch</h1>
          <p>A Simple Note Taking App</p>
        </div>
      </div>
    )
  }

  renderNotesList(notes) {
    return (
      <Fragment>
        <ListGroup.Item
          variant='light'
          action href='/notes/new'
        ><GoPlus className="plus" /> Create a new note</ListGroup.Item>
        {notes.map((note, i) =>
          <ListGroup.Item
            key={note.noteId}
            variant='light'
            action href={`/notes/${note.noteId}`}
          >{note.content.split('\n')[0]}<br />
            <span className='date'>Created at : {new Date(note.createdAt).toLocaleString()}</span>
          </ListGroup.Item>
        )}
      </Fragment>
    )
  }

  renderNotes() {
    return (
      <Container className="notes">
        <h1>Your Notes</h1>
        <hr />
        <ListGroup>
          {!this.state.isLoading && this.renderNotesList(this.state.notes)}
        </ListGroup>
      </Container>
    )
  }

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to='/login' />
    }

    return this.props.isAuthenticated
      ? this.renderNotes()
      : this.renderLander()
  }
}

export default Home
