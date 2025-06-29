import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ServicesComponent } from './components/services/services.component';
import { ContactComponent } from './components/contact/contact.component';
import { PatientsComponent } from './components/patients/patients.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { BillingComponent } from './components/billing/billing.component';
import { DoctorsComponent } from './components/doctors/doctors.component';
import { PrescriptionsComponent } from './components/prescriptions/prescriptions.component';
import { LabTestsComponent } from './components/lab-tests/lab-tests.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { EmergencyComponent } from './components/emergency/emergency.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SettingsComponent } from './components/settings/settings.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { LoginComponent } from './components/login/login.component';
import { HospitalComponent } from './components/hospital/hospital.component';
import { AddHospitalComponent } from './components/add-hospital/add-hospital.component';
import { AppointmentCheckedListComponent } from './components/appointment-checked-list/appointment-checked-list.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' },
  { path: 'hospital', component: HospitalComponent, canActivate: [authGuard] },
  { path: 'add-hospital', component: AddHospitalComponent, canActivate: [authGuard] },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'about', component: AboutComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'patients', component: PatientsComponent, canActivate: [authGuard] },
  { path: 'appointments', component: AppointmentsComponent, canActivate: [authGuard] },
  { path: 'appointments/checked-list', component: AppointmentCheckedListComponent, canActivate: [authGuard] },
  { path: 'appointments/:id', component: AppointmentsComponent, canActivate: [authGuard] },
  { path: 'billing', component: BillingComponent, canActivate: [authGuard] },
  { path: 'doctors', component: DoctorsComponent, canActivate: [authGuard] },
  { path: 'prescriptions', component: PrescriptionsComponent, canActivate: [authGuard] },
  { path: 'lab-tests', component: LabTestsComponent, canActivate: [authGuard] },
  { path: 'inventory', component: InventoryComponent, canActivate: [authGuard] },
  { path: 'emergency', component: EmergencyComponent, canActivate: [authGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [authGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
  { path: 'register', component: RegisterUserComponent }
];
