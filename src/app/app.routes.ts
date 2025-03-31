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

export const routes: Routes = [
    { path: '', component: LoginComponent, pathMatch: 'full'},
    { path: 'hospital', component:HospitalComponent},
    { path: 'add-hospital', component: AddHospitalComponent},
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'services', component: ServicesComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'patients', component: PatientsComponent },
    { path: 'appointments', component: AppointmentsComponent },
    { path: 'appointments/checked-list', component: AppointmentCheckedListComponent },
    { path: 'appointments/:id', component: AppointmentsComponent },
    { path: 'billing', component: BillingComponent },
    { path: 'doctors', component: DoctorsComponent },
    { path: 'prescriptions', component: PrescriptionsComponent },
    { path: 'lab-tests', component: LabTestsComponent },
    { path: 'inventory', component: InventoryComponent },
    { path: 'emergency', component: EmergencyComponent },
    { path: 'reports', component: ReportsComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'register', component: RegisterUserComponent }

];
