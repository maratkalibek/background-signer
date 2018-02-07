import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SignService {

  private socketUrl: any = 'wss://127.0.0.1:13579/';

  constructor(private http: HttpClient) {
  }

  o(msg): Observable<any> {
    const websocket = new WebSocket(this.socketUrl);
    websocket.onopen = (evt) => {
      console.log('o', 'connection opened');
      websocket.send(JSON.stringify(msg));
    };
    websocket.onclose = (evt) => {
      console.log('o', 'connection closed');
    };
    let x = false;
    return Observable.create(observer => {
      websocket.onmessage = (evt) => {
        if (x) {
          observer.next(evt);
        }
        x = true;
      };
    });
  }

  selectCertificate(path: string): Observable<any> {
    const msg = {
      'method': 'browseKeyStore',
      'args': ['PKCS12', 'P12', path]
    };
    return this.o(msg);
  }

  getKeys(path: string, password: string): Observable<any> {
    const msg = {
      'method': 'getKeys',
      'args': ['PKCS12', path, password, 'ALL']
    };
    return this.o(msg);
  }

  getSubjectDN(path: string, alias: string, password: string) {
    const msg = {
      'method': 'getSubjectDN',
      'args': ['PKCS12', path, alias, password]
    };
    return this.o(msg);
  }

  getRdnByOid(path: string, alias: string, password: string, oid: string) {
    const msg = {
      'method': 'getRdnByOid',
      'args': ['PKCS12', path, alias, password, oid, 0]
    };
    return this.o(msg);
  }

  getSerialNumberByOid(path: string, alias: string, password: string) {
    return this.getRdnByOid(path, alias, password, '2.5.4.5');
  }

  getOByOid(path: string, alias: string, password: string) {
    return this.getRdnByOid(path, alias, password, '2.5.4.10');
  }

  getOUByOid(path: string, alias: string, password: string) {
    return this.getRdnByOid(path, alias, password, '2.5.4.11');
  }

  getCNByOid(path: string, alias: string, password: string) {
    return this.getRdnByOid(path, alias, password, '2.5.4.3');
  }

  signXML(path: string, alias: string, password: string, xml: string) {
    const msg = {
      'method': 'signXml',
      'args': ['PKCS12', path, alias, password, xml]
    };
    return this.o(msg);
  }

  signAndSave(path: string, alias: string, password: string, subject: string, token: any) {
    this.signXML(path, alias, password, token.token).subscribe(
      data => {
        console.log('Токен #' + token.id + ' подписан.');
        const signed = JSON.parse(data['data']).result;
        this.http.post('/api/save-signed', {token: token, subject: subject, signedValue: signed}).subscribe(
          d => {
            console.log('Токен #' + d + ' отправлен.');
          }
        );
      }
    );
  }
}
