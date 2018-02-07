import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html'
})
export class TokenComponent implements OnInit {
  title = 'token';

  token: string;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
  }

  sendToken() {
    this.http.post('/api/save-token', {token: this.token}).subscribe(
      data => {
        console.log('токен для подписи отправлен...');
      }
    );
  }
}
