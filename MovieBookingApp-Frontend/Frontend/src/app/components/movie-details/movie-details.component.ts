import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Movie } from 'src/app/models/movie.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MovieService } from 'src/app/services/movie.service';
import { BookTicketComponent } from '../book-ticket/book-ticket.component';
import { UpdateTicketComponent } from '../update.ticket/update.ticket.component';
import { AddShowsComponent } from '../add-shows/add-shows.component';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css'],
})
export class MovieDetailsComponent {
  isLoading: boolean = false;
  movieId: string | null = '';
  movie: Movie | null = null;
  userSubscription: Subscription = new Subscription();
  numShows = 0;
  isAdmin: boolean = false;
  movieName: string = '';
  theaterName: string = '';
  showTime: string = '';


  constructor(
    private authenticationService: AuthenticationService,
    private movieService: MovieService,
    private activeRoute: ActivatedRoute,
    private adminService: AdminService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authenticationService.user.subscribe(
      (user) => {
        this.isAdmin = user?.role === 'ADMIN';
      }
    );
    this.movieId = this.activeRoute.snapshot.paramMap.get('movieId');
    if (this.movieId) {
      this.isLoading = true;
      this.movieService.getMovieById(this.movieId).subscribe({
        next: (movie: Movie) => {
          this.isLoading = false;
          this.movie = movie;
          this.numShows = movie.shows.length;
          this.movieName = movie.title;
        },
        error: (errorMessage) => {
          this.isLoading = false;
          this.openSnackBar(errorMessage);
          this.router.navigate(['/home']);
        },
      });
    } else {
      this.openSnackBar('movie id is undefined');
      this.router.navigate(['/home']);
    }
  }

  bookTicket(id: string) {
    this.userSubscription = this.authenticationService.user.subscribe(
      (user) => {
        if(user?.role === 'CUSTOMER' || user?.role === 'ADMIN') this.openDialog(id);
        else this.router.navigate(['/login']);
      }
    );
  }

  updateTicket(theaterName:string, showTime:string){
    this.openDialogForTicketsUpdate(this.movieName, theaterName,showTime);
  }

  openDialogForTicketsUpdate(movieName:string,theatreName:string,showTime:string){
    const dialogRef = this.dialog.open(UpdateTicketComponent, {
      width: '300px',
      height: '290px',
      data: { movieName:  movieName,theatreName: theatreName,showTime:showTime}
    });

    dialogRef.afterClosed().subscribe(() => {
      this.reloadPage();
    });
  }

  addShowsDialog() {
    const dialogRef = this.dialog.open(AddShowsComponent, {
      width: '800px',
      height: '320px',
      data: { movieName: this.movieName },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.reloadPage();
    });
  }

  deleteShow(showId:string){
    console.info(showId);
    this.isLoading = true;
    this.adminService.deleteShowById(showId).subscribe({
      next: (value) => {
        this.isLoading = false;
        this.openSnackBar('Show deleted successfully!');
        this.ngOnInit();
      },
      error: (errorMessage) => {
        this.isLoading = false;
        this.openSnackBar(errorMessage);
      },
    });
  }

  openDialog(showId: string) {
    const dialogRef = this.dialog.open(BookTicketComponent, {
      width: '300px',
      height: '290px',
      data: { showId: showId },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.reloadPage();
    });
  }

  openSnackBar(msg: string) {
    this.snackBar.open(msg, 'Ok', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 2500,
    });
  }

  reloadPage(){
    window.location.reload();
  }
}
