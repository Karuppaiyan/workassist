import { Injectable } from '@angular/core';
import { usersData } from './data';

@Injectable({
  providedIn: 'root'
})
export class DataSourceService {
  public Id: number;
  public Name: string;
  // tslint:disable-next-line:ban-types
  public usersData: { [key: string]: Object }[];

  constructor() {
    // tslint:disable-next-line:ban-types
    this.usersData = usersData as { [key: string]: Object }[];

   }

  checkusernameandpassword(uname: string, pwd: string) {
    if (uname === 'admin' && pwd === 'admin' || uname === 'user' && pwd === 'user') {
      localStorage.setItem('username', 'admin');
      if (uname === 'admin') {
        this.Id = 0;
      } else if (uname === 'user') {
        this.Id = 1;
      }
      return true;
    } else { return false; }
  }

  getUsersData() {
    return this.usersData;
  }
  getBlackData() {
    // return this.blackData;
  }
}
