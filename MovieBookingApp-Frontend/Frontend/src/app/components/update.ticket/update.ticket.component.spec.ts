import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateTicketComponent } from './update.ticket.component';
import { AdminService } from 'src/app/services/admin.service';
import { of, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('UpdateTicketComponent', () => {
  let component: UpdateTicketComponent;
  let fixture: ComponentFixture<UpdateTicketComponent>;
  let adminService: AdminService;
  let matDialogRef: MatDialogRef<UpdateTicketComponent>;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateTicketComponent],
      imports: [BrowserAnimationsModule],
      providers: [
        AdminService,
        {
          provide: MAT_DIALOG_DATA,
          useValue: { movieName: 'Movie A', theatreName: 'Theatre X', showTime: '18:00' },
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {},
          },
        },
        MatSnackBar,HttpClient, HttpHandler
      ],
    });

    fixture = TestBed.createComponent(UpdateTicketComponent);
    component = fixture.componentInstance;
    adminService = TestBed.inject(AdminService);
    matDialogRef = TestBed.inject(MatDialogRef);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test updateTickets call', () => {
    component.seatsToAdd = 50;
    spyOn(adminService, 'updateTickets').and.returnValue(of({}));
    spyOn(component, 'updateTickets').and.callThrough();
    component.updateTickets();
    expect(component.updateTickets).toHaveBeenCalled();
  });

  it('should test updateTickets call throw error', () => {
    component.seatsToAdd = 50;
    spyOn(adminService, 'updateTickets').and.returnValue(throwError("error"));
    spyOn(component, 'updateTickets').and.callThrough();
    component.updateTickets();
    expect(component.updateTickets).toHaveBeenCalled();
  });

  it('should test onNoClick call', () => {
    spyOn(component, 'onNoClick').and.callThrough();
    component.onNoClick();
    expect(component.onNoClick).toHaveBeenCalled();
  });

});