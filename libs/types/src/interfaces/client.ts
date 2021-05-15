import ws from 'ws';

export interface IClient {
  id: string;
  ws: ws;
}
