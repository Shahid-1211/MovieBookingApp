import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SignupComponent } from './signup.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { WelcomePageComponent } from '../welcome-page/welcome-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { User } from 'src/app/models/user.model';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authService: AuthenticationService;
  let router: Router;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignupComponent, WelcomePageComponent],
      imports: [ReactiveFormsModule, MatSnackBarModule, BrowserAnimationsModule],
      providers: [HttpClient, HttpHandler],
    });

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);
    snackBar = TestBed.inject(MatSnackBar);
    spyOn(router, 'navigate').and.stub();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test onSubmit call', () => {
    component.signupForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmedPassword: 'password123',
        answerToSecretQuestion: 'answer',
        secretQuestionId: 1,
    });
    spyOn(authService, 'signup').and.returnValue(of({}));
    spyOn(component, 'onSubmit').and.callThrough();
    component.onSubmit();
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should test onSubmit call with error', () => {
    component.signupForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmedPassword: 'password123',
        answerToSecretQuestion: 'answer',
        secretQuestionId: 1,
    });
    spyOn(authService, 'signup').and.returnValue(throwError("error"));
    spyOn(component, 'onSubmit').and.callThrough();
    component.onSubmit();
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should test onSubmit call else condition', () => {
    component.signupForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmedPassword: 'password1234',
        answerToSecretQuestion: 'answer',
        secretQuestionId: 1,
    });
    spyOn(component, 'onSubmit').and.callThrough();
    component.onSubmit();
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should test ngOnInit call', () => {
    authService.user = new BehaviorSubject<User | null>({email:"email", role:"ADMIN"} as User);
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  })

})
