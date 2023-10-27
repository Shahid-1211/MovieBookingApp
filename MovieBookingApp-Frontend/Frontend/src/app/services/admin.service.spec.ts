import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AddMovieRequest, AdminService } from './admin.service';
import { TicketUpdate } from '../models/ticketUpdate.model';
import { constants } from '../shared/constants';

describe('AdminService', () => {
  let adminService: AdminService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminService],
    });

    adminService = TestBed.inject(AdminService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(adminService).toBeTruthy();
  });

  it('should handle errors in handleError method', () => {
    const errorMessage = 'Test error message';
    const errorResponse = { message: errorMessage };

    adminService['handleError']({ error: errorResponse } as any).subscribe({
      error: (error) => {
        expect(error).toEqual(new Error(errorMessage));
      },
    });
  });

  it('should update ticket status', () => {
    const ticketId = '123';
    const status = 'CONFIRMED';

    adminService.updateTicketStatus(ticketId, status).subscribe();

    const req = httpTestingController.expectOne(
      `${constants.ADMIN_SERVICE_URL}/update/${ticketId}/${status}`
    );
    expect(req.request.method).toEqual('PUT');
    req.flush({});
  });

  it('should update tickets', () => {
    const request: TicketUpdate = { movieName:"movie", theatreName:"theatre", showTime:"7:00pm", tickets:20 };

    adminService.updateTickets(request).subscribe();

    const req = httpTestingController.expectOne(
      `${constants.ADMIN_SERVICE_URL}/updateTickets`
    );
    expect(req.request.method).toEqual('PUT');
    req.flush({});
  });

  it('should add new movie', () => {
    const movie = {  } as AddMovieRequest;

    adminService.addNewMovie(movie).subscribe();

    const req = httpTestingController.expectOne(
      `${constants.ADMIN_SERVICE_URL}/addmovie`
    );
    expect(req.request.method).toEqual('POST');
    req.flush({});
  });

  it('should delete movie by ID', () => {
    const movieId = '123';

    adminService.deleteMovieById(movieId).subscribe();

    const req = httpTestingController.expectOne(
      `${constants.ADMIN_SERVICE_URL}/delete/${movieId}`
    );
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });

  it('should delete show by ID', () => {
    const showId = '456';

    adminService.deleteShowById(showId).subscribe();

    const req = httpTestingController.expectOne(
      `${constants.ADMIN_SERVICE_URL}/delete-show/${showId}`
    );
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });

  it('should add shows', () => {
    const request: TicketUpdate = { movieName:"movie", theatreName:"theatre", showTime:"7:00pm", tickets:20 };

    adminService.addShows(request).subscribe();

    const req = httpTestingController.expectOne(
      `${constants.ADMIN_SERVICE_URL}/addShows`
    );
    expect(req.request.method).toEqual('PUT');
    req.flush({});
  });
});
