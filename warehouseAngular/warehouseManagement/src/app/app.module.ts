import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { UserComponent } from './components/user/user.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrderComponent } from './components/order/order.component';
import { TruckComponent } from './components/truck/truck.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatMenuModule} from '@angular/material/menu';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatNativeDateModule } from '@angular/material/core';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import { HomeComponent } from './components/home/home.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { WarehouseComponent } from './components/warehouse/warehouse.component';
import { ViewOrderComponent } from './components/view-order/view-order.component';
import { ManageItemsComponent } from './components/manage-items/manage-items.component';
import { CreateItemsComponent } from './components/create-items/create-items.component';
import { EditItemComponent } from './components/edit-item/edit-item.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    OrderDetailComponent,
    OrderComponent,
    CreateOrderComponent,
    TruckComponent,
    HomeComponent,
    EditUserComponent,
    CreateUserComponent,
    WarehouseComponent,
    ViewOrderComponent,
    ManageItemsComponent,
    CreateItemsComponent,
    EditItemComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatMenuModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatDatepickerModule,
    MatCardModule,
    MatNativeDateModule,
    MatTableModule,
    MatSelectModule,
    MatPaginatorModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
