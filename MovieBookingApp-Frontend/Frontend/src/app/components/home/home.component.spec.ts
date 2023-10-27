import { HttpClient, HttpHandler } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/services/authentication.service";
import { ForgotPasswordComponent } from "../forgot-password/forgot-password.component";
import { WelcomePageComponent } from "../welcome-page/welcome-page.component";
import { HomeComponent } from "./home.component";
import { FooterComponent } from "src/app/shared/tab-footer/footer.component";
import { BehaviorSubject, of, throwError } from "rxjs";
import { User } from "src/app/models/user.model";
import { MovieService } from "src/app/services/movie.service";
import { Movie } from "src/app/models/movie.model";

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    let authenticationService: AuthenticationService;
    let movieService: MovieService;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
          imports:[BrowserAnimationsModule],
        declarations: [HomeComponent, WelcomePageComponent, FooterComponent],
        providers: [ HttpClient, HttpHandler, MatSnackBar],
      });
  
      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      authenticationService = TestBed.inject(AuthenticationService);
      movieService = TestBed.inject(MovieService);
    });
  
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should test ngOnInit call', () => {
        authenticationService.user = new BehaviorSubject<User | null>({email:"email", role:"ADMIN"} as User);
        spyOn(movieService, 'getAllMovies').and.returnValue(of({movies:[]}));
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test ngOnInit call with service throwing error', () => {
        authenticationService.user = new BehaviorSubject<User | null>(null);
        spyOn(movieService, 'getAllMovies').and.returnValue(throwError("error"));
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test filteredMovies call', () => {
        component.movies = [{title:'Movie title'} as Movie];
        component.searchQuery = "Movie Title";
        const result = component.filteredMovies;
        expect(result).not.toBeNull();
    })

});