import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router';
import NotValidPermissionPage from '../pages/NotValidPermissionPage';

const AdminRoute = ({
  component: Component,
  path,
  isAuthenticated,
  isAdmin,
  ...children
}) => {
  if (isAuthenticated) {
    if (isAdmin) {
      return (
        <Route {...children} render={(props) => <Component {...props} />} />
      );
    } else {
      return <NotValidPermissionPage />;
    }
  }
  return (
    <Redirect
      to={
        path.split('/')[1] ? `/login?redirect=${path.split('/')[1]}` : `/login`
      }
    />
  );
};

export default AdminRoute;
