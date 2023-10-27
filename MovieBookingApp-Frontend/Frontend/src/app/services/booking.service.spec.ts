import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookingService } from './booking.service';
import { constants } from '../shared/constants';

describe('BookingService', () => {
  let bookingService: BookingService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookingService],
    });

    bookingService = TestBed.inject(BookingService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(bookingService).toBeTruthy();
  });

  it('should handle errors in handleError method', () => {
    const errorMessage = 'Test error message';
    const errorResponse = { message: errorMessage };

    bookingService['handleError']({ error: errorResponse } as any).subscribe({
      error: (error) => {
        expect(error).toEqual(new Error(errorMessage));
      },
    });
  });

  it('should book a ticket', () => {
    const ticketBookRequest = { showingId: '123', seats: 2 };

    bookingService.bookTicket(ticketBookRequest).subscribe();

    const req = httpTestingController.expectOne(
      `${constants.BOOKING_SERVICE_URL}/book`
    );
    expect(req.request.method).toEqual('POST');
    req.flush({});
  });

  it('should get user bookings', () => {
    const userId = '123';

    bookingService.getUserBookings(userId).subscribe();

    const req = httpTestingController.expectOne(
      `${constants.BOOKING_SERVICE_URL}/tickets?userId=${userId}`
    );
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });
});
