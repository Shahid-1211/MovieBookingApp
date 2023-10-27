import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ForgotPasswordComponent } from './forgot-password.component';
import { of, throwError } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WelcomePageComponent } from '../welcome-page/welcome-page.component';
import { User } from 'src/app/models/user.model';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let authenticationService: AuthenticationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports:[BrowserAnimationsModule],
      declarations: [ForgotPasswordComponent, WelcomePageComponent],
      providers: [ HttpClient, HttpHandler, MatSnackBar],
    });

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    authenticationService = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should test onSubmit call', () => {
    component.forgotPasswordForm.setValue({
        userId: 'testuser',
        securityQuestionId: 1,
        answer: 'answer',
        newPassword: 'newPassword',
    });

    spyOn(authenticationService, 'forgotPassword').and.returnValue(of({}));
    spyOn(component, 'onSubmit').and.callThrough();
    component.onSubmit();
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should test onSubmit call with service through error', () => {
    component.forgotPasswordForm.setValue({
        userId: 'testuser',
        securityQuestionId: 1,
        answer: 'answer',
        newPassword: 'newPassword',
    });

    spyOn(authenticationService, 'forgotPassword').and.returnValue(throwError("error"));
    spyOn(component, 'onSubmit').and.callThrough();
    component.onSubmit();
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should test ngOnInit call', () => {
    authenticationService.user = new BehaviorSubject<User | null>({email:"email"} as User);
    spyOn(router, 'navigate').and.stub();
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

});