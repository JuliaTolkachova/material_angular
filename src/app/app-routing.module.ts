import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HeroesComponent} from './heroes/heroes.component';
import {HeroDetailComponent} from './hero-detail/hero-detail.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HomepageComponent} from './homepage/homepage.component';
import {PieChartComponent} from './pie-chart/pie-chart.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './auth_guard';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'homepage', component: HomepageComponent,  canActivate: [AuthGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'detail/:id', component: HeroDetailComponent, canActivate: [AuthGuard]},
  {path: 'heroes', component: HeroesComponent, canActivate: [AuthGuard]},
  {path: 'pie-chart', component: PieChartComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
