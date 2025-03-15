import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrderComponent } from './components/order/order.component';
import { TruckComponent } from './components/truck/truck.component';
import { UserComponent } from './components/user/user.component';
import { AuthGuard } from './auth/auth.guard';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { HomeComponent } from './components/home/home.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { WarehouseComponent } from './components/warehouse/warehouse.component';
import { ManageItemsComponent } from './components/manage-items/manage-items.component';
import { CreateItemsComponent } from './components/create-items/create-items.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'orders', component: OrderComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'create-orders', component: CreateOrderComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'create-users', component: CreateUserComponent, canActivate: [AuthGuard] },
  { path: 'orders/:id', component: OrderDetailComponent, canActivate: [AuthGuard] },
  { path: 'trucks', component: TruckComponent, canActivate: [AuthGuard] },
  { path: 'warehouse', component: WarehouseComponent, canActivate: [AuthGuard] },
  { path: 'manage-items', component: ManageItemsComponent, canActivate: [AuthGuard] },
  { path: 'create-items', component: CreateItemsComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
