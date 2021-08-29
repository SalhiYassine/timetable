import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Redirect } from 'react-router';
const PublicRoute = ({
  component: Component,
  isAuthenticated,
  ...children
}) => {
  const path = window.location.search.split('=')[1]
    ? window.location.search.split('=')[1]
    : '';

  return (
    <Route
      render={(props) =>
        isAuthenticated ? (
          <Redirect to={`/${path}`} />
        ) : (
          <Component {...props} {...children} />
        )
      }
    />
  );
};

export default PublicRoute;
