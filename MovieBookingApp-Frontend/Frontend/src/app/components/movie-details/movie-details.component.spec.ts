import { HttpClient, HttpHandler } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "src/app/services/authentication.service";
import { MovieDetailsComponent } from "./movie-details.component";
import { MatDialog } from "@angular/material/dialog";
import { MovieService } from "src/app/services/movie.service";
import { BehaviorSubject, of, throwError } from "rxjs";
import { Movie } from "src/app/models/movie.model";
import { User } from "src/app/models/user.model";
import { AppComponent } from "src/app/app.component";
import { AdminService } from "src/app/services/admin.service";

describe('MovieDetailsComponent', () => {
    let component: MovieDetailsComponent;
    let fixture: ComponentFixture<MovieDetailsComponent>;
    let router: Router;
    let authService: AuthenticationService;
    let adminService: AdminService;
    let snackBar: MatSnackBar;
    let movieService: MovieService;
    const mockDialog = {
        open: jasmine.createSpy('open')
    };
    const mockActivatedRoute = {
        snapshot: {
          paramMap: {
            get: (param: string) => {
              return 'mockMovieId';
            },
          },
        },
    };

    const mockWindow = {location:{reload:jasmine.createSpy()}} as any;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
          imports:[BrowserAnimationsModule],
          declarations: [MovieDetailsComponent],
          providers: [ { provide: ActivatedRoute, useValue: mockActivatedRoute },
            { provide: MatDialog, useValue: mockDialog },
            HttpClient, HttpHandler, MatSnackBar
            ],
      });
  
      fixture = TestBed.createComponent(MovieDetailsComponent);
      component = fixture.componentInstance;
      router = TestBed.inject(Router);
      authService = TestBed.inject(AuthenticationService);
      snackBar = TestBed.inject(MatSnackBar);
      movieService = TestBed.inject(MovieService);
      adminService = TestBed.inject(AdminService);
      spyOn(router, 'navigate').and.stub();
      mockDialog.open.and.returnValue({
        afterClosed: () => of('Dialog closed')
      });
    });
  
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should test ngOnInit call', () => {
        mockActivatedRoute.snapshot.paramMap.get = (param: string) => {
            return 'movieId';
        };
        authService.user = new BehaviorSubject<User | null>({email:"email", role:"ADMIN"} as User);
        spyOn(movieService, 'getMovieById').and.returnValue(of({ title: '', shows: [] } as unknown as Movie));
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test ngOnInit call with service throwing error', () => {
        authService.user = new BehaviorSubject<User | null>({email:"email", role:"ADMIN"} as User);
        spyOn(movieService, 'getMovieById').and.returnValue(throwError("error"));
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test ngOnInit call else condition', () => {
        mockActivatedRoute.snapshot.paramMap.get = (param: string) => {
            return '';
        };
        authService.user = new BehaviorSubject<User | null>({email:"email", role:"ADMIN"} as User);
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test bookTicket call', () => {
        authService.user = new BehaviorSubject<User | null>({email:"email", role:"ADMIN"} as User);
        spyOn(component, 'bookTicket').and.callThrough();
        spyOn(component, 'reloadPage').and.stub();
        component.bookTicket("id");
        expect(component.bookTicket).toHaveBeenCalled();
    });

    it('should test bookTicket call else condition', () => {
        authService.user = new BehaviorSubject<User | null>({email:"email", role:""} as User);
        spyOn(component, 'bookTicket').and.callThrough();
        spyOn(component, 'reloadPage').and.stub();
        component.bookTicket("id");
        expect(component.bookTicket).toHaveBeenCalled();
    });

    it('should test updateTicket call', () => {
        spyOn(component, 'updateTicket').and.callThrough();
        spyOn(component, 'reloadPage').and.stub();
        component.updateTicket("name","7:00pm");
        expect(component.updateTicket).toHaveBeenCalled();
    });

    it('should test addShowsDialog call', () => {
        spyOn(component, 'addShowsDialog').and.callThrough();
        spyOn(component, 'reloadPage').and.stub();
        component.addShowsDialog();
        expect(component.addShowsDialog).toHaveBeenCalled();
    });

    it('should test deleteShow call', () => {
        spyOn(component, 'deleteShow').and.callThrough();
        spyOn(adminService, 'deleteShowById').and.returnValue(of({}));
        component.deleteShow("id");
        expect(component.deleteShow).toHaveBeenCalled();
    });

    it('should test deleteShow call with service throwing error', () => {
        spyOn(component, 'deleteShow').and.callThrough();
        spyOn(adminService, 'deleteShowById').and.returnValue(throwError("error"));
        component.deleteShow("id");
        expect(component.deleteShow).toHaveBeenCalled();
    });

});