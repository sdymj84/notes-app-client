import React from 'react'
import { Switch, Route } from "react-router-dom";
import Home from './containers/Home';
import NotFound from './containers/NotFound';
import Login from './containers/Login'
import Signup from './containers/Signup'
import NewNote from './containers/NewNote'
import Note from './containers/Note'
import AppliedRoute from './components/AppliedRoute';


const Routes = ({ childProps }) => {
  return (
    < Switch >
      <AppliedRoute exact path='/' component={Home} props={childProps} />
      <AppliedRoute path='/login' component={Login} props={childProps} />
      <AppliedRoute path='/signup' component={Signup} props={childProps} />
      <AppliedRoute path='/notes/new' component={NewNote} props={childProps} />
      <AppliedRoute path='/notes/:noteId' component={Note} props={childProps} />
      <Route component={NotFound} />
    </Switch >
  )
}

export default Routes