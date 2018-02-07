import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signed',
  templateUrl: './signed.component.html'
})
export class SignedComponent implements OnInit {

  signed: any;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      data => {
        this.http.get('/api/signed/' + data.id).subscribe(
          x => {
            this.signed = x;
          }
        );
      }
    );
  }
}
