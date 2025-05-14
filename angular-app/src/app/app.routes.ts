import { Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { UserComponent } from '../components/user/user.component';
import { RegistrationStatsComponent } from '../components/registration-stats/registration-stats.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'user', component: UserComponent },
    { path: 'stats', component: RegistrationStatsComponent },


];
