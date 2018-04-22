import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Message } from './message';
import { environment } from 'environments/environment';

const SERVER_URL = environment.SERVER_URL;

@Injectable()
export class SocketService {

  private socket: WebSocket;

  initSocket() {
    console.log('Initializing socket connection...');
    this.socket = new WebSocket(SERVER_URL);
    this.socket.onerror = (event) => console.log('Websocket error:' + event);
  }

  closeSocket() {
    if (this.socket) {
      console.log('Closing socket connection...');
      this.socket.close();
      this.socket = null;
    }
  }

  send(message: Message) {
    if (!message) return;
    this.socket.send(JSON.stringify(message));
  }

  onOpen(): Observable<any> {
    return new Observable<Message>(observer => {
      this.socket.onopen = (event) => observer.next();
    })
  }

  onClose(): Observable<any> {
    return new Observable<Message>(observer => {
      this.socket.onclose = (event) => observer.next();
    })
  }

  onMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.onmessage = (event) => {
        if (typeof(event.data) === "string") {
          const message: Message = new Message(JSON.parse(event.data));
          observer.next(message);
        }
      }
    });
  }

}
