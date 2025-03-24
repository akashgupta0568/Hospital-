import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonserviceService } from '../../commonservice.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  menuItems = [
    { title: 'Add Hospitals', icon: 'fas fa-hospital', link: '/add-hospital' },
    { title: 'Doctors & Staff', icon: 'fas fa-user-md', link: '/doctors' },
    { title: 'Patient Records', icon: 'fas fa-user-injured', link: '/patients' },
    { title: 'Appointments', icon: 'fas fa-calendar-check', link: '/appointments' },
    { title: 'Billing & Payments', icon: 'fas fa-file-invoice-dollar', link: '/billing' },
    { title: 'Prescriptions', icon: 'fas fa-pills', link: '/prescriptions' },
    { title: 'Laboratory Tests', icon: 'fas fa-vial', link: '/lab-tests' },
    { title: 'Inventory & Pharmacy', icon: 'fas fa-prescription-bottle-alt', link: '/inventory' },
    { title: 'Emergency Services', icon: 'fas fa-ambulance', link: '/emergency' },
    { title: 'Health Reports', icon: 'fas fa-chart-line', link: '/reports' },
    { title: 'Settings & Profile', icon: 'fas fa-cog', link: '/settings' },
    { title: 'Register User', icon: 'fas fa-user-plus', link: '/register' }
  ];

  constructor( private service: CommonserviceService){
    this.service.showHeader();
  }
}
