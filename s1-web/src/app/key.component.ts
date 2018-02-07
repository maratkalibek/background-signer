import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignService } from './sign.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-key',
  templateUrl: './key.component.html'
})
export class KeyComponent implements OnInit {

  path: string;
  password: string;
  subject: string;
  alias: string;
  xml: string;
  result: string;

  keys: any[] = [];

  constructor(private signService: SignService, private http: HttpClient) {
  }

  ngOnInit() {
    const timer = Observable.timer(5000, 5000);
    timer.subscribe( t => {
      this.signTokens(this.path, this.alias, this.password, this.subject);
    });
  }

  selectCertificate() {
    this.signService.selectCertificate('.').subscribe(
      data => {
        const d = JSON.parse(data['data']);
        if (d) {
          if (d['errorCode'] === 'NONE') {
            this.path = d.result;
          }
        }
      }
    );
  }

  showSubject() {
    this.signService.getKeys(this.path, this.password).subscribe(
      result => {
        this.alias = JSON.parse(result.data).result.split('|')[3];
        this.signService.getSubjectDN(this.path, this.alias, this.password).subscribe(
          data => {
            const subject = JSON.parse(data.data).result;
            this.subject = subject;
          }
        );
      }
    );
  }

  signTokens(path: string, alias: string, password: string, subject: string) {
    if (path && alias && password && subject) {
      console.log('Подгружаем токены...');
      this.http.get('/api/tokens').subscribe(
        (data: any[]) => {
          data.forEach(
            token => {
              this.signService.signAndSave(path, alias, password, subject, token);
            }
          );
        }
      );
    }
  }
}
