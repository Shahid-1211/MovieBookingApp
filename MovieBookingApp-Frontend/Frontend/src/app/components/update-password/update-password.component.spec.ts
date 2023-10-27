import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UpdatePasswordComponent } from './update-password.component';
import { of, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('UpdatePasswordComponent', () => {
  let component: UpdatePasswordComponent;
  let fixture: ComponentFixture<UpdatePasswordComponent>;
  let authService: AuthenticationService;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatePasswordComponent],
      imports: [ReactiveFormsModule, MatSnackBarModule, BrowserAnimationsModule],
      providers: [HttpClient, HttpHandler],
    });

    fixture = TestBed.createComponent(UpdatePasswordComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthenticationService);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test onSubmit call', () => {
    component.updatePasswordForm.patchValue({
        securityQuestionId: 1,
        answer: 'answer',
        newPassword: 'password123',
    });
    spyOn(authService, 'updatePassword').and.returnValue(of({}));
    spyOn(component, 'onSubmit').and.callThrough();
    component.onSubmit();
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should test onSubmit call with error', () => {
    component.updatePasswordForm.patchValue({
        securityQuestionId: 1,
        answer: 'answer',
        newPassword: 'password123',
    });
    spyOn(authService, 'updatePassword').and.returnValue(throwError("error"));
    spyOn(component, 'onSubmit').and.callThrough();
    component.onSubmit();
    expect(component.onSubmit).toHaveBeenCalled();
  });
});