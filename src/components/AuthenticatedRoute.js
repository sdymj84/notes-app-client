import React from 'react'
import { Route, Redirect } from "react-router-dom";

const AuthenticatedRoute = ({ component: Comp, props: cProps, ...rest }) =>
  <Route {...rest} render={(props) =>
    cProps.isAuthenticated
      ? <Comp {...props} {...cProps} />
      : <Redirect to={`/login?redirect=${props.location.pathname}${props.location.search}`} />
  } />


export default AuthenticatedRoute
