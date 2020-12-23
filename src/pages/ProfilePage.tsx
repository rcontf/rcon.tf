import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layouts/Layout';
import { userSelector } from '../redux/users/userSlice';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);

  console.log(user);

  return (
    <Layout>
      <h1>{user.name}</h1>
    </Layout>
  );
}
