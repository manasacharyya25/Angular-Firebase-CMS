import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { signInWithEmailAndPassword } from "firebase/auth";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  email: string;
  password: string;
  showLoading: boolean;

  constructor(private router: Router, private auth: Auth, private notifier: NotifierService) {
    this.auth.onAuthStateChanged((user)=> {
      if(user) {
        this.router.navigate(['admin']);
      }
    })
   }

  ngOnInit(): void {
    if(this.auth.currentUser) {
      this.router.navigate(['admin']);
    }
  }

  login() {
    if(this.email!=null && this.password!=null) {
      this.showLoading = true;      
      signInWithEmailAndPassword(this.auth, this.email, this.password)
        .then((userCredential) => {
          // DONOT ROUTE FROM HERE AS AUTH STATE IS NOT SAVED HERE. USE OnAuthStateChanged Observable in Constructor and Route From There.
          // const user = userCredential.user;
          // this.router.navigate(['admin'])
        })
        .catch((error) => {
          this.showLoading = false;
          this.notifier.notify("error", "Invalid Email/Password");
        });
    } else {
      this.notifier.notify("warning", "Enter Email and Password");
    }
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
  }

  onCredentialsEntered(event: any) {
    if(event && event.key=="Enter") {
      this.login();
    }
  }

}
