export interface ServerLogs {
  actor: string;
  action: string;
  timestamp: number;
}

export interface AddServerDto {
  hostname: string;
  ip: string;
  port: number;
  password: string;
}

export interface EditServerDto {
  hostname: string;
  ip: string;
  port: number;
  password: string;
}

export interface GetServerResponse {
  hostname: string;
  ip: string;
  logs: Array<ServerLogs>;
  owner: string;
  password: string;
  port: number;
  type: string;
}
