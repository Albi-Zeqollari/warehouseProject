import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
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
import { EditOrderComponent } from './components/edit-order/edit-order.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },

    {
      path: 'orders',
      component: OrderComponent,
      canActivate: [AuthGuard],
      data: { roles: ['CLIENT'] }
    },
    {
      path: 'home',
      component: HomeComponent,
      canActivate: [AuthGuard],
      data: { roles: ['CLIENT', 'SYSTEM_ADMIN', 'WAREHOUSE_MANAGER'] }
    },
    {
      path: 'orders/:id',
      component: EditOrderComponent,
      canActivate: [AuthGuard],
      data: { roles: ['CLIENT','WAREHOUSE_MANAGER'] }
    },

    {
      path: 'create-orders',
      component: CreateOrderComponent,
      canActivate: [AuthGuard],
      data: { roles: ['CLIENT'] }
    },
    {
      path: 'users',
      component: UserComponent,
      canActivate: [AuthGuard],
      data: { roles: ['SYSTEM_ADMIN'] }
    },
    {
      path: 'create-users',
      component: CreateUserComponent,
      canActivate: [AuthGuard],
      data: { roles: ['SYSTEM_ADMIN'] }
    },
    {
      path: 'trucks',
      component: TruckComponent,
      canActivate: [AuthGuard],
      data: { roles: ['WAREHOUSE_MANAGER'] }
    },
    {
      path: 'warehouse',
      component: WarehouseComponent,
      canActivate: [AuthGuard],
      data: { roles: ['WAREHOUSE_MANAGER'] }
    },
    {
      path: 'manage-items',
      component: ManageItemsComponent,
      canActivate: [AuthGuard],
      data: { roles: ['WAREHOUSE_MANAGER'] }
    },
    {
      path: 'create-items',
      component: CreateItemsComponent,
      canActivate: [AuthGuard],
      data: { roles: ['WAREHOUSE_MANAGER'] }
    },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
