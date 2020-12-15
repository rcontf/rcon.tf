import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { loginUser } from '../redux/users/userSlice';

export default function AuthSuccess() {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(loginUser());
    history.push("/")
    // eslint-disable-next-line
  }, []);

  return <div>...</div>;
}
