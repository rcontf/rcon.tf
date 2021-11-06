import axios from 'axios';
import { GetServerResponse } from './types';
import { AddServerDto } from './types';

export async function getUserServers() {
  try {
    const { data } = await axios.get<GetServerResponse[]>('/api/servers');
    return data;
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function addUserServer(
  dto: AddServerDto
): Promise<GetServerResponse> {
  try {
    const { data } = await axios.post('/api/servers', dto);
    return data;
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function deleteUserServer(ip: string): Promise<void> {
  try {
    await axios.delete(`/api/servers/${ip}`);
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}

export async function editUserServer(
  ip: string,
  dto: AddServerDto
): Promise<GetServerResponse> {
  try {
    const { data } = await axios.patch<GetServerResponse>(
      `/api/servers/${ip}`,
      dto
    );
    return data;
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
}
