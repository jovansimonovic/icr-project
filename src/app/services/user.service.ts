import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  city: string;
  zipCode: number;
  phoneNumber: string;
  // favoriteCategories?: string[];
}

@Injectable()
export class UserService {
  static dummyUserList: Array<User> = [
    {
      id: 0,
      firstName: 'ime1',
      lastName: 'prezime1',
      email: 'korisnik1@gmail.com',
      password: 'korisnik1',
      address: 'adresa korisnik 1',
      city: 'grad1',
      zipCode: 13400,
      phoneNumber: '601234567',
    },
    {
      id: 1,
      firstName: 'ime2',
      lastName: 'prezime2',
      email: 'korisnik2@gmail.com',
      password: 'korisnik2',
      address: 'adresa korisnik 2',
      city: 'grad2',
      zipCode: 14300,
      phoneNumber: '607654321',
    },
  ];

  currentUser?: User;

  // tracks state of current user's data
  private userSubject = new BehaviorSubject<User>(
    this.getUserFromLocalStorage()
  );
  userSubject$ = this.userSubject.asObservable();

  // tracks login state of user
  private loginStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$ = this.loginStatus.asObservable();

  // returns user based on the provided email
  getUserByEmail(email: string): User {
    this.currentUser = UserService.dummyUserList.find(
      (user) => user.email === email
    )!;

    return this.currentUser;
  }

  // fetches user data from local storage
  getUserFromLocalStorage() {
    return JSON.parse(localStorage.getItem('user')!);
  }

  // updates user
  updateUser(newUser: User) {
    UserService.dummyUserList.find((user) => {
      if (user.id === newUser.id) {
        user.firstName = newUser.firstName;
        user.lastName = newUser.lastName;
        user.email = newUser.email;
        user.password = newUser.password;
        user.address = newUser.address;
        user.city = newUser.city;
        user.zipCode = newUser.zipCode;
        user.phoneNumber = newUser.phoneNumber;
      }
    });
    localStorage.setItem('user', JSON.stringify(newUser));
    this.userSubject.next(newUser);
  }

  // checks if the provided password is valid
  isPasswordValid(email: string, password: string): boolean {
    return (
      UserService.dummyUserList.find(
        (user) => user.email === email && user.password === password
      ) !== undefined
    );
  }

  // registers a new user
  registerUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    address: string,
    city: string,
    zipCode: number,
    phoneNumber: string
  ): User {
    let maxId: number = 0;

    UserService.dummyUserList.forEach((user) => {
      if (maxId < user.id) {
        maxId = user.id;
      }
    });

    let id = ++maxId;
    let user: User = {
      id,
      firstName,
      lastName,
      email,
      password,
      address,
      city,
      zipCode,
      phoneNumber,
    };

    UserService.dummyUserList.push(user);

    this.currentUser = user;

    return user;
  }

  // logs the user in
  login(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser = user;
    this.userSubject.next(user);
    this.loginStatus.next(true);
  }

  // checks if the user is logged in
  isLoggedIn() {
    return !!localStorage.getItem('user');
  }

  // logs the user out
  logout() {
    localStorage.removeItem('user');
    this.loginStatus.next(false);
  }
}
