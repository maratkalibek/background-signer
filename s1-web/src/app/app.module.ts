import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { SignService } from './sign.service';

import { AppComponent } from './app.component';
import { TokenComponent } from './token.component';
import { KeyComponent } from './key.component';
import { SignedComponent } from './signed.component';

const appRoutes: Routes = [
  { path: '', component: KeyComponent },
  { path: 'token', component: TokenComponent },
  { path: 'signed/:id', component: SignedComponent },
  { path: '**', component: KeyComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    TokenComponent,
    KeyComponent,
    SignedComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes, {}
    )
  ],
  providers: [ SignService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
