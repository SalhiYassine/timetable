import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router';

const PrivateRoute = ({
  component: Component,
  path,
  isAuthenticated,
  ...children
}) => {
  if (isAuthenticated) {
    return <Route {...children} render={(props) => <Component {...props} />} />;
  }
  return (
    <Redirect
      to={
        path.split('/')[1] ? `/login?redirect=${path.split('/')[1]}` : `/login`
      }
    />
  );
};

export default PrivateRoute;
