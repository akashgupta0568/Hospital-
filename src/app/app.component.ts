import { Component, HostListener, OnInit, Renderer2} from '@angular/core';
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


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FormsModule, CommonModule,ToastModule,ButtonModule,RippleModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  // providers: [MessageService]
})
export class AppComponent implements OnInit {

  showModal: boolean = true;
  isRegister: boolean = false;
  email: string = '';
  password: string = '';
  phoneNumber: string = '';
  name: string = '';
  isLoggedIn: boolean = false;
  roles:any;
  RoleID:any = 0;
  RegPassword:string='';
  HospitalID:any = 0;
  hospitals: any;
  showHeader: boolean = false;
  marginTop: string = '85px';
  constructor(private renderer: Renderer2,private service : CommonserviceService,private messageService: MessageService) {
    this.updateMargin();
  }

  title = 'hospital';

  show() {
    this.messageService.add({ summary: 'Success', detail: 'Message Content' });
}

  ngOnInit() {
    this.service.showHeader$.subscribe((isVisible) => {
      this.showHeader = isVisible;
      console.log(this.showHeader);
    });
    this.showModal = true;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.renderer.addClass(document.body, 'dark-mode');
    }

    this.checkUserData();
    // this.getRoles();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateMargin();
  }

  updateMargin() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      // Mobile & Tablet view
      this.marginTop = '66px';
    } else {
      // Desktop view
      this.marginTop = '80px';
    }
  }

  getRoles(){
    this.service.getRoles().subscribe({
      next: (res :any)=>{
        console.log(res);
        this.roles = res.roles;
        this.hospitals = res.hospitals;
        console.log(res);
      },
      error: (error) =>{
        alert(error);
      },
      complete:() =>{
        console.log("Get Request Compelete");
      }
    })
  }

  onRoleChange(event:Event) {
    const target = event.target as HTMLSelectElement;
    console.log(target.value);
    if (!target.value) {
      this.RoleID = ''; // Reset value if not selected
    }

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
    var user = {
      identifier: this.email,
      password: this.password
    };

    this.service.login(user).subscribe({
      next: (response) => {
        if (response.success === 1) {
          console.log('Login Successful:', response);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userData', JSON.stringify(user));
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
    this.closeModal();
  }

  checkUserData() {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.identifier) {
          this.showModal = false; // User is valid
          console.log('User data loaded successfully');
        } else {
          this.showModal = true; // Invalid user data
          console.log('Invalid user data found');
        }
      } catch (error) {
        this.showModal = true; // Error in parsing JSON
        console.log('Error loading user data');
      }
    } else {
      this.showModal = true; // No data found
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
    }
    console.log('User Payload:', userPayload);

    this.service.register(userPayload).subscribe(
      (response:any) => {
        alert('Registration Successful' + response);
      },
      (error:any) => {
        alert(`Registration Failed: ${error.message}`);
      }
    );
  }
    // this.closeModal();
}

