import React, { Component } from 'react'
import { Redirect } from "react-router-dom";
import "./Home.css"

export class Home extends Component {
  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to='/login' />
    }

    return (
      <div className="Home">
        <div className="lander">
          <h1>Scratch</h1>
          <p>A Simple Note Taking App</p>
        </div>
      </div>
    )
  }
}

export default Home
