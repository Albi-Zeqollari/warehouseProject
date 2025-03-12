import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { UserComponent } from './components/user/user.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrderComponent } from './components/order/order.component';
import { TruckComponent } from './components/truck/truck.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    OrderDetailComponent,
    OrderComponent,
    TruckComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
