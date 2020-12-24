import axios from 'axios';
import { UserData } from './types';

export async function getUserInfo() {
  const { data } = await axios.get<UserData>('/api/users');
  return { id: data.id, avatar: data.avatar, name: data.name };
}
