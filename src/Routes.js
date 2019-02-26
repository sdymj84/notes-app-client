import React from 'react'
import { Switch, Route } from "react-router-dom";
import Home from './containers/Home';
import NotFound from './containers/NotFound';
import Login from './containers/Login'
import AppliedRoute from './components/AppliedRoute';

const Routes = ({ childProps }) => {
  return (
    // <Switch>
    //   <Route exact path='/'
    //     render={(props) => <Home {...props} {...childProps} />} />
    //   <Route exact path='/login'
    //     render={(props) => <Login {...props} {...childProps} />} />
    //   <Route component={NotFound} />
    // </Switch>

    < Switch >
      <AppliedRoute exact path='/' component={Home} props={childProps} />
      <AppliedRoute exact path='/login' component={Login} props={childProps} />
      <Route component={NotFound} />
    </Switch >
  )
}

export default Routes