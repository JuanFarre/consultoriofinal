import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header-main',
  templateUrl: './header-main.component.html',
  styleUrls: ['./header-main.component.css']
})
export class HeaderMainComponent implements OnInit {
  nombreUsuario: string = "";
  tipoUsuario: string = "";

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.nombreUsuario = localStorage.getItem('username') || "";
    this.tipoUsuario = localStorage.getItem('rol') || "";
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/welcome']);
  }
}