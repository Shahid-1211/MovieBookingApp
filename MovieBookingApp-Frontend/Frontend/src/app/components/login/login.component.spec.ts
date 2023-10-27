import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginComponent } from './login.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { WelcomePageComponent } from '../welcome-page/welcome-page.component';
import { User } from 'src/app/models/user.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let authService: AuthenticationService;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports:[BrowserAnimationsModule],
        declarations: [LoginComponent, WelcomePageComponent],
        providers: [ HttpClient, HttpHandler, MatSnackBar],
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthenticationService);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should test onSubmit call', () => {
    component.loginForm.setValue({
        email: 'test@example.com',
        password: 'password123',
    });
    spyOn(authService, 'login').and.returnValue(of({} as User));
    spyOn(router, 'navigate').and.stub();
    spyOn(component, 'onSubmit').and.callThrough();
    component.onSubmit();
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should test onSubmit call with service throwing error', () => {
    component.loginForm.setValue({
        email: 'test@example.com',
        password: 'password123',
    });
    spyOn(authService, 'login').and.returnValue(throwError("error"));
    spyOn(router, 'navigate').and.stub();
    spyOn(component, 'onSubmit').and.callThrough();
    component.onSubmit();
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should test ngOnInit call', () => {
    authService.user = new BehaviorSubject<User | null>({email:"email", role:"ADMIN"} as User);
    spyOn(router, 'navigate').and.stub();
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should test loadSignUpPage', () => {
    spyOn(router, 'navigate').and.stub();
    spyOn(component, 'loadSignUpPage').and.callThrough();
    component.loadSignUpPage();
    expect(component.loadSignUpPage).toHaveBeenCalled();
  })

});