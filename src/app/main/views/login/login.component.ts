import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/@api/model/login.model';
import { UserToken } from 'src/app/@api/model/userToken.model';
import { AuthService } from 'src/app/@api/service/auth.service';
import { LoggerService } from 'src/app/shared/loggers/logger.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  public loginForm: FormGroup;
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private logger: LoggerService
  ) { 
    this.loginForm = this.formBuilder.group({
      usuario: ['', Validators.required],
      senha: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    if (this.auth.isAutenticado()) {
      this.router.navigate(['home']);
    }
  }

  fazerLogin() {
    this.loading = true;
    if (this.loginForm.valid) {
      const dadosLogin: Login = this.loginForm.getRawValue();
      this.auth.doLogin(dadosLogin).subscribe({next: (res) => {
        if (res !instanceof UserToken) {
          console.log('Erro desconhecido!');
          this.loading = false;
          return;
        }
        this.loading = false;
        this.logger.success('Login realizado com sucesso!', 'OK');
        this.router.navigateByUrl('/home');
      }, error: (error) => {
        this.logger.error(error.message, 'OK');
        this.loading = false;
      }})
    }
  }

}
