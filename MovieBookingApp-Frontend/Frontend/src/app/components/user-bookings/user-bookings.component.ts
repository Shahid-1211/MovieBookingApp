import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-user-bookings',
  templateUrl: './user-bookings.component.html',
  styleUrls: ['./user-bookings.component.css']
})
export class UserBookingsComponent implements OnInit {
  userId: string = '';
  firstName: string = '';
  lastName: string = '';
  role: string = '';
  email: string = '';
  totalTickets = 0;
  isLoading: boolean = false;
  userBookings: any[] = [];

  userSubscription: Subscription = new Subscription();

  constructor(private http: HttpClient, private ticketBookService: BookingService,private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.userSubscription = this.authenticationService.user.subscribe(
      (user) => {
        if (user) {
          this.userId = user.userId;
          this.firstName = user.firstName;
          this.lastName = user.lastName;
          this.role = user.role;
          this.email = user.email;
        }
      }
    );
    this.ticketBookService
        .getUserBookings(this.userId)
        .subscribe((response: any) => {
          this.userBookings = response;
          this.totalTickets = this.userBookings.length;
          this.isLoading = true;
        });
  }

  getStatusClass(status: string): string {
    return (status === 'SUCCESS') ? 'success' : (status === 'ON HOLD'? 'hold' : 'rejected');
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}