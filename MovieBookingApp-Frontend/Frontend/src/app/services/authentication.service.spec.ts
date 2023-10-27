import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthenticationService } from './authentication.service';
import { constants } from '../shared/constants';
import { Router } from '@angular/router';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let httpTestingController: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthenticationService],
    });

    authenticationService = TestBed.inject(AuthenticationService);
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.stub();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(authenticationService).toBeTruthy();
  });

  it('should handle errors in handleError method', () => {
    const errorMessage = 'Test error message';
    const errorResponse = { message: errorMessage };

    authenticationService['handleError']({ error: errorResponse } as any).subscribe({
      error: (error) => {
        expect(error).toEqual(new Error(errorMessage));
      },
    });
  });

  it('should log in', () => {
    const loginCredentials = { email: 'test@example.com', password: 'password' };

    authenticationService.login(loginCredentials).subscribe();

    const req = httpTestingController.expectOne(
      `${constants.USER_AUTH_SERVICE_URL}/login`
    );
    expect(req.request.method).toEqual('POST');
    req.flush({});
  });

  it('should sign up', () => {
    const signupCredentials = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'password',
      secretQuestionId: 1,
      answerToSecretQuestion: 'answer',
    };

    authenticationService.signup(signupCredentials).subscribe();

    const req = httpTestingController.expectOne(
      `${constants.USER_AUTH_SERVICE_URL}/register`
    );
    expect(req.request.method).toEqual('POST');
    req.flush({});
  });

  it('should update password', () => {
    const updatePasswordRequest = {
      securityQuestionId: 1,
      answer: 'answer',
      newPassword: 'newPassword',
    };

    authenticationService.updatePassword(updatePasswordRequest).subscribe();

    const req = httpTestingController.expectOne(
      `${constants.USER_AUTH_SERVICE_URL}/updatepassword`
    );
    expect(req.request.method).toEqual('PUT');
    req.flush({});
  });

  it('should handle forgot password', () => {
    const userId = '123';
    const forgotPasswordRequest = {
      securityQuestionId: 1,
      answer: 'answer',
      newPassword: 'newPassword',
    };

    authenticationService.forgotPassword(userId, forgotPasswordRequest).subscribe();

    const req = httpTestingController.expectOne(
      `${constants.USER_AUTH_SERVICE_URL}/${userId}/forgot`
    );
    expect(req.request.method).toEqual('PUT');
    req.flush({});
  });

  it('should auto-login', () => {
    localStorage.setItem(
      'authData',
      JSON.stringify({ jwtToken: 'testToken', firstName: "firstName", lastName: "lastName", email: "email", userId: "id", role: "ADMIN" })
    );

    authenticationService.autoLogin();

    expect(authenticationService.user.value).toEqual({
      jwtToken: 'testToken',
      firstName: "firstName", lastName: "lastName", email: "email", userId: "id", role: "ADMIN"
    });
  });

  it('should auto-login else call', () => {
    localStorage.setItem('authData','');

    authenticationService.autoLogin();

    expect(authenticationService.user.value).toBeNull();
  });

  it('should log out', () => {
    spyOn(localStorage, 'removeItem');

    authenticationService.logout();

    expect(authenticationService.user.value).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith('authData');
  });
});
