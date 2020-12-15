import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getUserDetails } from '../redux/users/userSlice';

export default function AuthSuccess() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserDetails());
    window.location.replace('/');
    // eslint-disable-next-line
  }, []);

  return <div>Authenticated.</div>;
}
