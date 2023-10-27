import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BehaviorSubject, of } from 'rxjs';
import { Router } from '@angular/router';
import { ScrollService } from 'src/app/services/scroll.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatToolbar } from '@angular/material/toolbar';
import { MatMenu } from '@angular/material/menu';
import { User } from 'src/app/models/user.model';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthenticationService;
  let router: Router;
  let scrollService: ScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent, MatToolbar, MatMenu],
      providers: [
        AuthenticationService,
        {
          provide: Router,
          useValue: {
            navigate: () => {},
          },
        },
        ScrollService, HttpClient, HttpHandler
      ],
    });

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);
    scrollService = TestBed.inject(ScrollService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test ngOnInit call', () => {
    authService.user = new BehaviorSubject<User | null>({email:"email", role:"ADMIN"} as User);
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should test ngOnInit call with null user', () => {
    authService.user = new BehaviorSubject<User | null>(null);
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should test navigateToMyBookings', () => {
    spyOn(component, 'navigateToMyBookings').and.callThrough();
    component.navigateToMyBookings();
    expect(component.navigateToMyBookings).toHaveBeenCalled();
  });

  it('should test onLogout', () => {
    spyOn(authService, 'logout').and.stub();
    spyOn(component, 'onLogout').and.callThrough();
    component.onLogout();
    expect(component.onLogout).toHaveBeenCalled();
  });

  it('should test scrollTo', () => {
    spyOn(component, 'scrollTo').and.callThrough();
    component.scrollTo('');
    expect(component.scrollTo).toHaveBeenCalled();
  });
});