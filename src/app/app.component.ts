import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommonserviceService } from './commonservice.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FormsModule, CommonModule, ToastModule, ButtonModule, RippleModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [MessageService,ToastModule]
})
export class AppComponent implements OnInit {

  showModal: boolean = true;
  isRegister: boolean = false;
  email: string = '';
  password: string = '';
  phoneNumber: string = '';
  name: string = '';
  isLoggedIn: boolean = false;
  roles: any;
  RoleID: any = 0;
  RegPassword: string = '';
  HospitalID: any = 0;
  hospitals: any;
  showHeader: boolean = false;
  marginTop: string = '85px';

  constructor(
    private renderer: Renderer2,
    private service: CommonserviceService,
    private messageService: MessageService,
    private router: Router,
    private titleService: Title,
    private meta: Meta
  ) {
    this.updateMargin();
  }

  title = 'Hospital Management System';

  ngOnInit() {
    this.service.showHeader$.subscribe((isVisible) => {
      this.showHeader = isVisible;
    });

    this.showModal = true;
    this.applySavedTheme();
    this.checkUserData();

    // Set SEO Meta Tags
    this.titleService.setTitle('Hospital Management System');
    this.meta.addTags([
      { name: 'description', content: 'Manage hospital records, billing, appointments, and more.' },
      { name: 'keywords', content: 'hospital, management, patients, doctors, appointments, billing' },
      { name: 'author', content: 'YourCompanyName' },
      { name: 'robots', content: 'index, follow' }
    ]);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateMargin();
  }

  updateMargin() {
    const screenWidth = window.innerWidth;
    this.marginTop = screenWidth < 768 ? '66px' : '80px';
  }

  applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.renderer.addClass(document.body, 'dark-mode');
    }
  }

  show() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
  }

  getRoles() {
    this.service.getRoles().subscribe({
      next: (res: any) => {
        this.roles = res.roles;
        this.hospitals = res.hospitals;
      },
      error: (error) => {
        alert(error);
      },
      complete: () => {
        console.log("Get Request Complete");
      }
    });
  }

  onRoleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.RoleID = target.value ? target.value : '';
  }

  toggleForm() {
    this.isRegister = !this.isRegister;
  }

  toggleTheme() {
    const body = document.body;
    if (body.classList.contains('dark-mode')) {
      this.renderer.removeClass(body, 'dark-mode');
      localStorage.setItem('theme', 'light');
    } else {
      this.renderer.addClass(body, 'dark-mode');
      localStorage.setItem('theme', 'dark');
    }
  }

  closeModal() {
    this.showModal = false;
  }

  login() {
    const user = {
      identifier: this.email,
      password: this.password
    };

    this.service.login(user).subscribe({
      next: (response) => {
        if (response.success === 1) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId);
          this.isLoggedIn = true;
          this.showModal = false;
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        if (error.status === 0) {
          alert("Server is not responding. Please try again later.");
        } else {
          alert(`Login failed: ${error.message}`);
        }
      },
      complete: () => {
        console.log('Login request completed');
      }
    });
  }

  checkUserData() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedIn = true;
      this.showModal = false;
    } else {
      this.isLoggedIn = false;
      this.showModal = true;
    }
  }

  register() {
    const userPayload = {
      FullName: this.name,
      Email: this.email,
      PhoneNumber: this.phoneNumber,
      Password: this.RegPassword,
      RoleID: this.RoleID,
      HospitalID: this.HospitalID
    };

    this.service.register(userPayload).subscribe({
      next: (response: any) => {
        alert('Registration Successful');
      },
      error: (error: any) => {
        alert(`Registration Failed: ${error.message}`);
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.isLoggedIn = false;
    this.showModal = true;
    this.router.navigate(['/']);
  }
  showSuccessMessage() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Toast message works!' });
  }
  showSuccess() {
    this.service.showSuccess('Success', 'Toast message works!' );
  }
  // l() {
  //   // Example: Show success message after login
  //   this.messageService.add({
  //     severity: 'success',
  //     summary: 'Login Successful',
  //     detail: 'Welcome to the dashboard!',
  //   })
  // }
}
