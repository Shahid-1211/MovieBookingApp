import { ViewportScroller } from '@angular/common';
import { Component, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { ScrollService } from 'src/app/services/scroll.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  aboutUs: String = '';
  userSubscription: Subscription = new Subscription();

  constructor(
    private authenticationService: AuthenticationService,
    private scroller: ViewportScroller, private elementRef: ElementRef,
    private router: Router,
    private scrollService: ScrollService

  ) {}

  ngOnInit() {
    this.userSubscription = this.authenticationService.user.subscribe(
      (user) => {
        this.isLoggedIn = user ? true : false;
        this.isAdmin = user?.role === 'ADMIN';
      }
    );
  }

  scrollTo(sectionId: string) {
    this.scrollService.scrollTo(sectionId);
  }

  navigateToMyBookings() {
    this.router.navigate(['bookings']);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  onLogout() {
    this.authenticationService.logout();
  }
}
