import { HttpClient, HttpHandler } from "@angular/common/http";
import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { of, throwError } from "rxjs";
import { BookTicketComponent } from "./book-ticket.component";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { BookingService } from "src/app/services/booking.service";

describe('BookTicketComponent', () => {
    let component: BookTicketComponent;
    let fixture: ComponentFixture<BookTicketComponent>;
    let ticketService: BookingService;
    const mockData = { showId: '123' };
    const dialogRefMock = {
        close: jasmine.createSpy('close'),
    };

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports:[BrowserAnimationsModule],
        declarations: [BookTicketComponent],
        providers: [
            { provide: MatDialogRef, useValue: dialogRefMock },
            { provide: MAT_DIALOG_DATA, useValue: mockData },
            HttpClient, HttpHandler, MatSnackBar
        ]
      }).compileComponents();
    }));
  
    beforeEach(() => {
      fixture = TestBed.createComponent(BookTicketComponent);
      ticketService = TestBed.inject(BookingService);
      component = fixture.componentInstance;
    });
  
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should test bookTickets call', () => {
        component.seatsToBook  = 5;
        spyOn(ticketService, 'bookTicket').and.returnValue(of({}));
        spyOn(component, 'bookTickets').and.callThrough();
        component.bookTickets();
        expect(component.bookTickets).toHaveBeenCalled();
        expect(component.isSuccess).toBeTrue();
    });

    it('should test bookTickets call with error response', () => {
        component.seatsToBook  = 5;
        spyOn(ticketService, 'bookTicket').and.returnValue(throwError("error"));
        spyOn(component, 'bookTickets').and.callThrough();
        component.bookTickets();
        expect(component.bookTickets).toHaveBeenCalled();
        expect(component.isError).toBeTrue();
    });

    it('should test onNoClick call', () => {
        spyOn(component, 'onNoClick').and.callThrough();
        component.onNoClick();
        expect(component.onNoClick).toHaveBeenCalled();
    })

});