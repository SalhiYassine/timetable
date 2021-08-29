import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Message from '../components/Message';

const NotValidPermissionPage = () => {
  return (
    <Container fluid className='d-flex flex-column'>
      <Message variant='danger'>
        You must be an admin to access this page
      </Message>
      <h1 className='text-center my-5'>User Missing Permissions!</h1>
      <LinkContainer fluid to='/'>
        <Button className='mx-auto'>RETURN HOME</Button>
      </LinkContainer>
    </Container>
  );
};

export default NotValidPermissionPage;
