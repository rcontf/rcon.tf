import axios from 'axios';
import { UserData } from './types';

export async function getUserInfo() {
  const { data } = await axios.get<UserData>('/api/users');

  if (data.id) {
    // If I have a user, refresh their token
    await axios.get("/api/auth/refresh")
    return { id: data.id, avatar: data.avatar, name: data.name, loggedIn: true };
  }

  return null
}
