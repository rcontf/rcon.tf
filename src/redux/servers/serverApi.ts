import axios from 'axios';
import { GetServerResponse } from '../../types/types';
import { AddServerDto } from '../../types/types';

export async function getUserServers() {
  const { data } = await axios.get<GetServerResponse[]>('/servers');
  return data;
}

export async function addUserServer(
  dto: AddServerDto
): Promise<GetServerResponse | null> {
  const { data } = await axios.post('/servers', dto);
  if (data === false) return null;
  return data;
}

export async function deleteUserServer(ip: string): Promise<void> {
  await axios.delete(`/servers/${ip}`);
}

export async function editUserServer(
  ip: string,
  dto: AddServerDto
): Promise<void> {
  await axios.patch(`/servers/${ip}`, dto);
}
