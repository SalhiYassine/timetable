import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDetails, login, logOut } from './actions/userAction';
// Routing
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// Custom Routing
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import AdminRoute from './routes/AdminRoute';
// Components
import Loader from './components/Loader';
import PageRouter from './routes/PageRouter';
const App = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.userLogin);

  useEffect(() => {
    if (loading) {
      dispatch(getDetails());
    }
  }, []);

  if (loading) {
    return <Loader />;
  }

  return <PageRouter />;
};

export default App;
