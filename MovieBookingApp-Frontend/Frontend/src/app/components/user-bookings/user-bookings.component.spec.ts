import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserBookingsComponent } from './user-bookings.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BookingService } from 'src/app/services/booking.service';
import { BehaviorSubject, of } from 'rxjs';
import { User } from 'src/app/models/user.model';

describe('UserBookingsComponent', () => {
  let component: UserBookingsComponent;
  let fixture: ComponentFixture<UserBookingsComponent>;
  let authService: AuthenticationService;
  let bookingService: BookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserBookingsComponent],
      imports: [HttpClientTestingModule],
      providers: [AuthenticationService, BookingService],
    });

    fixture = TestBed.createComponent(UserBookingsComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthenticationService);
    bookingService = TestBed.inject(BookingService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test ngOnInit call', () => {
    const mockUser:User = { firstName: "firstName", lastName: "lastName", email: "email", userId: "id", role: "ADMIN", jwtToken: ""}
    authService.user = new BehaviorSubject<User | null>(mockUser);
    const mockUserBookings = [{ id: 1, status: 'SUCCESS' }, { id: 2, status: 'ON HOLD' }];
    spyOn(bookingService, 'getUserBookings').and.returnValue(of(mockUserBookings));
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should test getStatusClass call for reject status', () => {
    const result = component.getStatusClass("REJECTED");
    expect(result).toBe('rejected');
  });

  it('should test getStatusClass call for hold status', () => {
    const result = component.getStatusClass("ON HOLD");
    expect(result).toBe('hold');
  });

  it('should test getStatusClass call for success status', () => {
    const result = component.getStatusClass("SUCCESS");
    expect(result).toBe('success');
  });

})
