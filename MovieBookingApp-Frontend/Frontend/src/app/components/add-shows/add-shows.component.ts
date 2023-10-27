import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TicketUpdate } from 'src/app/models/ticketUpdate.model';
import { AdminService } from 'src/app/services/admin.service';
import { constants } from 'src/app/shared/constants';

@Component({
  selector: 'app-add-shows',
  templateUrl: './add-shows.component.html',
  styleUrls: ['./add-shows.component.css']
})
export class AddShowsComponent {
  isSuccess = false;
  isError = false;
  errMessage = '';
  isLoading = false;
  theaterName: string = '';
  showtime: string = '';
  seats: number = 0;
  availableTheaters = constants.AVAILABLE_THEATERS;
  constructor(
    public dialogRef: MatDialogRef<AddShowsComponent>,
    private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: {movieName: string}
  ) {}


  onNoClick(): void {
    this.dialogRef.close();
  }

  addShows(theatreName:string,showTime:string, seats:number): void {
    const request: TicketUpdate= {
      movieName: this.data.movieName,
      theatreName: theatreName,
      showTime: showTime,
      tickets: seats
    }
    this.isLoading = true;
    this.adminService
      .addShows(request)
      .subscribe({
        complete: () => {
          this.isLoading = false;
          this.isSuccess = true;
        },
        error: (errorMsg) => {
          this.isLoading = false;
          this.errMessage = errorMsg;
          this.isError = true;
        },
      });
  }
}
