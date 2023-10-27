import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManageMoviesComponent } from './manage-movies.component';
import { MovieService } from 'src/app/services/movie.service';
import { AdminService } from 'src/app/services/admin.service';
import { of, throwError } from 'rxjs';
import { Movie } from 'src/app/models/movie.model';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ManageMoviesComponent', () => {
  let component: ManageMoviesComponent;
  let fixture: ComponentFixture<ManageMoviesComponent>;
  let movieService: MovieService;
  let adminService: AdminService;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      declarations: [ManageMoviesComponent],
      providers: [MovieService, AdminService, MatSnackBar, HttpClient, HttpHandler],
    });

    fixture = TestBed.createComponent(ManageMoviesComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService);
    adminService = TestBed.inject(AdminService);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should test deleteMovie call', () => {
    spyOn(movieService, 'getAllMovies').and.returnValue(of({movies:[]}));
    spyOn(adminService, 'deleteMovieById').and.returnValue(of('delete'));
    spyOn(component, 'deleteMovie').and.callThrough();
    component.deleteMovie("movieId");
    expect(component.deleteMovie).toHaveBeenCalled();
  });

  it('should test deleteMovie call with delete service throwing error', () => {
    spyOn(movieService, 'getAllMovies').and.returnValue(of({movies:[]}));
    spyOn(adminService, 'deleteMovieById').and.returnValue(throwError("Unable to delete the movie"));
    spyOn(component, 'deleteMovie').and.callThrough();
    component.deleteMovie("movieId");
    expect(component.deleteMovie).toHaveBeenCalled();
  });

  it('should test ngOnInit call with movie service throwing error', () => {
    spyOn(movieService, 'getAllMovies').and.returnValue(throwError("unable to retrive movies"));
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

})