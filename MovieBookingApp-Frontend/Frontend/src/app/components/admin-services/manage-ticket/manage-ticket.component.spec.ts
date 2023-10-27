import { HttpClient, HttpHandler } from "@angular/common/http";
import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { AdminService } from "src/app/services/admin.service";
import { of, throwError } from "rxjs";
import { ManageTicketComponent } from "./manage-ticket.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe('ManageTicketComponent', () => {
    let component: ManageTicketComponent;
    let fixture: ComponentFixture<ManageTicketComponent>;
    let adminService: AdminService;
  
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports:[BrowserAnimationsModule],
        declarations: [ManageTicketComponent],
        providers: [
          HttpClient, HttpHandler, MatSnackBar
        ]
      }).compileComponents();
    }));
  
    beforeEach(() => {
      fixture = TestBed.createComponent(ManageTicketComponent);
      adminService = TestBed.inject(AdminService);
      component = fixture.componentInstance;
    });
  
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should test updateTicketStatus call', () => {
        component.ngOnInit();

        const formValues = {
        ticketId: "id",
        ticketStatus: "success",
        };

        component.ticketStatusForm.patchValue(formValues);

        spyOn(adminService, 'updateTicketStatus').and.returnValue(of({}));
        spyOn(component, 'updateTicketStatus').and.callThrough();
        component.updateTicketStatus();
        expect(component.updateTicketStatus).toHaveBeenCalled();
    });

    it('should test updateTicketStatus call throw error', () => {
        component.ngOnInit();

        const formValues = {
        ticketId: "id",
        ticketStatus: "success",
        };

        component.ticketStatusForm.patchValue(formValues);

        spyOn(adminService, 'updateTicketStatus').and.returnValue(throwError("error"));
        spyOn(component, 'updateTicketStatus').and.callThrough();
        component.updateTicketStatus();
        expect(component.updateTicketStatus).toHaveBeenCalled();
    });

});