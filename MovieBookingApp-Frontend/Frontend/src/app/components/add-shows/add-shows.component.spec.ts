import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddShowsComponent } from './add-shows.component';
import { AdminService } from 'src/app/services/admin.service';
import { of, throwError } from 'rxjs';
import { constants } from 'src/app/shared/constants';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('AddShowsComponent', () => {
    let component: AddShowsComponent;
    let fixture: ComponentFixture<AddShowsComponent>;
    let adminService: AdminService;
    const dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);
    const matDialogData = { movieName: 'TestMovieName' };
  
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [AddShowsComponent],
        providers: [
          { provide: MatDialogRef, useValue: dialogRefMock },
          { provide: MAT_DIALOG_DATA, useValue: matDialogData },
          HttpClient, HttpHandler
        ]
      }).compileComponents();
    }));
  
    beforeEach(() => {
      fixture = TestBed.createComponent(AddShowsComponent);
      adminService = TestBed.inject(AdminService);
      component = fixture.componentInstance;
    });
  
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should test addShows call', () => {
      spyOn(adminService, 'addShows').and.returnValue(of("add"));
      spyOn(component, 'addShows').and.callThrough();
      component.addShows('theater',"7:00pm",50);
      expect(component.addShows).toHaveBeenCalled();
      expect(component.isSuccess).toBeTrue();
    });

    it('should test addShows through error', () => {
      spyOn(adminService, 'addShows').and.returnValue(throwError("error"));
      spyOn(component, 'addShows').and.callThrough();
      component.addShows('theater',"7:00pm",50);
      expect(component.addShows).toHaveBeenCalled();
      expect(component.isError).toBeTrue();
    });

    it('should test onNoClick call', () => {
      spyOn(component, 'onNoClick').and.callThrough();
      component.onNoClick();
      expect(component.onNoClick).toHaveBeenCalled();
    })
});