import { Component ,Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TicketUpdate } from 'src/app/models/ticketUpdate.model';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-update.ticket',
  templateUrl: './update.ticket.component.html',
  styleUrls: ['./update.ticket.component.css']
})
export class UpdateTicketComponent {
  isSuccess = false;
  isError = false;
  errMessage = '';
  isLoading = false;
  seatsToAdd: number = 0;
  constructor(
    public dialogRef: MatDialogRef<UpdateTicketComponent>,
    private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: { movieName: string ,theatreName:string,showTime:string}
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateTickets(): void {
    if (this.seatsToAdd > 0 && this.seatsToAdd<=100) {
      this.isLoading = true;
      const updateRequest:TicketUpdate = {
        movieName: this.data.movieName,
        theatreName:this.data.theatreName,
        showTime:this.data.showTime,
        tickets:this.seatsToAdd
      }
      this.adminService
        .updateTickets(updateRequest)
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
}
