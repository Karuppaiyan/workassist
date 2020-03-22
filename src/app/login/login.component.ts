import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { DataSourceService } from '../data-source.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ DataSourceService ]
})
export class LoginComponent implements OnInit {

  constructor(private routes: Router, private service: DataSourceService) { }

  msg = '';

  ngOnInit() {
  }

  check(uname: string, p: string)  {
    const output = this.service.checkusernameandpassword(uname, p);
    if (output === true) {
      if (this.service.Id === 0) {
        this.routes.navigate(['/admin']);
      } else {
        this.routes.navigate(['/user']);
      }
    } else {
      this.msg = 'Invalid username or password';
    }
  }
}
