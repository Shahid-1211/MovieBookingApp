import { HttpClient, HttpHandler } from "@angular/common/http";
import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { AddMovieRequest, AdminService } from "src/app/services/admin.service";
import { AddMovieComponent } from "./add-movie.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe('AddMovieComponent', () => {
    let component: AddMovieComponent;
    let fixture: ComponentFixture<AddMovieComponent>;
    let adminService: AdminService;
    let router: Router;
  
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [BrowserAnimationsModule],
        declarations: [AddMovieComponent],
        providers: [
          HttpClient, HttpHandler, MatSnackBar
        ]
      }).compileComponents();
    }));
  
    beforeEach(() => {
      fixture = TestBed.createComponent(AddMovieComponent);
      adminService = TestBed.inject(AdminService);
      router = TestBed.inject(Router);
      component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should test addTheater call', () => {
        spyOn(component, 'addTheater').and.callThrough();
        component.addTheater();
        expect(component.addTheater).toHaveBeenCalled();
    });

    it('should test removeTheater call', () => {
        component.addMovieRequest = {
            shows: [{theaterId:"id", showTime:"7:00pm", totalSeats:10}]
        } as AddMovieRequest;
        spyOn(component, 'removeTheater').and.callThrough();
        component.removeTheater(0);
        expect(component.removeTheater).toHaveBeenCalled();
        expect(component.addMovieRequest.shows.length).toBe(0);
    });

    it('should test submitMovieForm call', () => {
        component.addMovieRequest = {
            shows: [{theaterId:"T2b764eb8-7b5c-4e86-a119-d10734dfcc77", showTime:"7:00pm", totalSeats:10}]
        } as AddMovieRequest;
        spyOn(adminService, 'addNewMovie').and.returnValue(of({}));
        spyOn(router, 'navigate').and.stub();
        spyOn(component, 'submitMovieForm').and.callThrough();
        component.submitMovieForm();
        expect(component.submitMovieForm).toHaveBeenCalled();
    });

    it('should test submitMovieForm call through error', () => {
        component.addMovieRequest = {
            shows: [{theaterId:"T2b764eb8-7b5c-4e86-a119-d10734dfcc77", showTime:"7:00pm", totalSeats:10}]
        } as AddMovieRequest;
        spyOn(adminService, 'addNewMovie').and.returnValue(throwError("error"));
        spyOn(router, 'navigate').and.stub();
        spyOn(component, 'submitMovieForm').and.callThrough();
        component.submitMovieForm();
        expect(component.submitMovieForm).toHaveBeenCalled();
    });

});