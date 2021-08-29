import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Routing
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// Custom Routing
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import AdminRoute from './AdminRoute';
import { Container } from 'react-bootstrap';

// Components

const PageRouter = () => {
  const { authenticated, admin } = useSelector((state) => state.userLogin);
  return (
    <Router>
      <Container>
        <Switch>
          <h2>Working PageRouter</h2>
        </Switch>
      </Container>
    </Router>
  );
};

export default PageRouter;
