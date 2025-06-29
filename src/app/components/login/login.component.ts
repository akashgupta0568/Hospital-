import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonserviceService } from '../../commonservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ProgressSpinnerModule],
  // providers: [MessageService,ToastModule,CommonserviceService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  showModal: boolean = true;
  isRegister: boolean = false;
  isLoading: boolean = false;
  isLoggedIn: boolean = false;
  showHeader: boolean = false;
  showAddHospitalForm: boolean = false;

  email: string = '';
  password: string = '';
  phoneNumber: string = '';
  name: string = '';
  RegPassword: string = '';
  RoleID: any = 0;
  HospitalID: any = 0;
  roles: any;
  hospitals: any[] = [];

  newHospital = {
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    email: '',
    licenseNumber: '',
  };

  constructor(
    private renderer: Renderer2,
    private service: CommonserviceService,
    private router: Router,
    private messageService: MessageService,

  ) {}

  ngOnInit(): void {
    this.service.hideHeader();
    this.showModal = true;
    this.checkUserData();
    this.getRoles();
    this.email = localStorage.getItem('Email') || '';
    this.password = localStorage.getItem('Password') || '';
  }

  /** Fetch Roles & Hospital Data */
  getRoles(): void {
    this.service.getRoles().subscribe({
      next: (res: any) => {
        this.roles = res.roles;
        this.hospitals = res.hospitals;
      },
      error: (error) => console.error(error),
      complete: () => console.log('Get Request Complete'),
    });
  }

  /** Handle Role Selection Change */
  onRoleChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.RoleID = target.value || '';
  }

  /** Toggle between Login & Register Form */
  toggleForm(): void {
    this.isRegister = !this.isRegister;
  }

  /** Toggle Theme (Dark/Light Mode) */
  toggleTheme(): void {
    const body = document.body;
    const theme = body.classList.contains('dark-mode') ? 'light' : 'dark';

    body.classList.toggle('dark-mode');
    localStorage.setItem('theme', theme);
  }

  /** Close Login Modal & Redirect */
  closeModal(): void {
    this.showModal = false;
    this.router.navigate(['/home']);
  }

  /** Login User */
  login(): void {
    this.isLoading = true;

    const user = { Email: this.email, Password: this.password };

    this.service.login(user).subscribe(
      (response: any) => {
        if(response.message === 'Login successful!') {
        console.log('Login Response:', response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.roleName);
        localStorage.setItem('Email', this.email);
        localStorage.setItem('Password', this.password);
        localStorage.setItem('UserLoginId', response.userId);
        localStorage.removeItem('NewUserId');
        // this.service.showSuccess('Login Successful', 'Welcome to the Dashboard!');
        this.router.navigate(['/home']);
        this.messageService.add({ severity: 'success', summary: 'Login Successful', detail: 'Welcome to the Dashboard!' });
        this.isLoading = false;
      }
        // Redirect based on Role
        // const roleRoutes: { [key: string]: string } = {
        //   Admin: '/home',
        //   Doctor: '/doctor/dashboard',
        //   Patient: '/patient/dashboard',
        //   Staff: '/staff/dashboard',
        // };

        // this.router.navigate([roleRoutes[response.roleName] || '/login']);
        else {
          // this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: 'Invalid email or password.' });
          this.router.navigate(['/login']);
          this.isLoading = false;
        }
      },
      (error:any) => {
        // this.service.showError(error.message, 'Invalid email or password.');
        // alert('Invalid email or password.');
        this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: error.error.message });
        // this.service.showError('Invalid email or password.', 'Login Failed');
        this.isLoading = false;
      }
    );
  }

  showSuccessMessage() {
    this.service.showSuccess('Login Successful', 'Welcome to your dashboard!');
  }

  /** Check if User is Already Logged In */
  checkUserData(): void {
    const storedUser = localStorage.getItem('userData');

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.showModal = user?.identifier ? false : true;
      } catch {
        this.showModal = true;
        console.error('Error loading user data');
      }
    } else {
      this.showModal = true;
    }
  }

  /** Register a New User */
  register(): void {
    this.isLoading = true;

    const userPayload = {
      FullName: this.name,
      Email: this.email,
      PhoneNumber: this.phoneNumber,
      Password: this.RegPassword,
      RoleID: this.RoleID,
    };

    this.service.register(userPayload).subscribe(
      (response: any) => {
        if (!response.success) {
        console.log('Registration Response:', response);
        localStorage.setItem('NewUserId', response.userId);
        this.isLoading = false;
        this.messageService.add({ severity: 'success', summary: 'Registration Successful', detail: 'You can now log in!' });

        // Reset form fields
        this.email = '';
        this.RegPassword = '';
        this.phoneNumber = '';
        this.name = '';
        }
        else {
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Registration Failed', detail: 'Please try again.' });
        }
      },
      (error: any) => {
        this.isLoading = false;
        console.error('Registration Error:', error);
        this.messageService.add({ severity: 'error', summary: 'Registration Failed', detail: error.error.message });
      }
    );
  }


  /** Check if User Wants to Add a New Hospital */
  checkHospitalSelection(event: any): void {
    this.showAddHospitalForm = event.target.value === 'add';
  }

  /** Add a New Hospital */
  // addHospital(): void {
  //   if (this.newHospital.name) {
  //     this.service.addHospital(this.newHospital).subscribe(
  //       (res: any) => console.log(res),
  //       (error) => alert(error)
  //     );

  //     this.showAddHospitalForm = false;
  //   } else {
  //     alert('Please fill all required fields.');
  //   }
  // }
}
