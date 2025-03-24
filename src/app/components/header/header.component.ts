import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Route, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  menuOpen = false;
  email: string | null;
  role: string | null;

  constructor(private renderer: Renderer2, private router:Router) {
    this.email= localStorage.getItem('Email');
    this.role= localStorage.getItem('role');
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

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.renderer.addClass(document.body, 'dark-mode');
    }
  }

  logout(){
    alert('logout');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    localStorage.removeItem('Email');
    localStorage.removeItem('Password');
    localStorage.removeItem('UserLoginId');
    localStorage.removeItem('counter');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    // this.router.navigate(['/']);
  }
}
