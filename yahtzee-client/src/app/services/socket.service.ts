import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io'; // Use ngx-socket-io package for Angular

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) {}

  connect() {
    this.socket.connect(); // Establish socket connection
  }

  disconnect() {
    this.socket.disconnect(); // Disconnect socket
  }

  on(eventName: string, callback: Function) {
    this.socket.on(eventName, callback); // Listen for socket events
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data); // Emit socket events
  }
}
