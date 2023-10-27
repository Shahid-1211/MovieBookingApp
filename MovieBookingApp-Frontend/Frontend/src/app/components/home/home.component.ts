import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Movie } from 'src/app/models/movie.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  isLoading: boolean = false;
  searchQuery: string = '';
  movies: Movie[] = [];
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  userSubscription: Subscription = new Subscription();


  constructor(
    private movieService: MovieService,
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.userSubscription = this.authenticationService.user.subscribe(
      (user) => {
        this.isLoggedIn = user ? true : false;
        this.isAdmin = user?.role === 'ADMIN';
      }
    );
    this.movieService.getAllMovies().subscribe({
      next: (value) => {
        this.movies = value.movies;
        this.isLoading = false;
      },
      error: (errorMessage) => {
        this.isLoading = false;
        this.openSnackBar(errorMessage);
      },
    });
  }

  get filteredMovies() {
    return this.movies.filter(movie =>
      movie.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  openSnackBar(msg: string) {
    this.snackBar.open(msg, 'Ok', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 2500,
    });
  }
}
