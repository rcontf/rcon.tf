import axios from 'axios';
import { GetServerResponse } from '../../types/types';
import { AddServerDto } from '../../types/types';

export async function getUserServers() {
  const { data } = await axios.get<GetServerResponse[]>('/api/servers');
  return data;
}

export async function addUserServer(
  dto: AddServerDto
): Promise<GetServerResponse | null> {
  const { data } = await axios.post('/api/servers', dto);
  if (data === false) return null;
  return data;
}

export async function deleteUserServer(ip: string): Promise<void> {
  await axios.delete(`/api/servers/${ip}`);
}

export async function editUserServer(
  ip: string,
  dto: AddServerDto
): Promise<void> {
  await axios.patch(`/api/servers/${ip}`, dto);
}
