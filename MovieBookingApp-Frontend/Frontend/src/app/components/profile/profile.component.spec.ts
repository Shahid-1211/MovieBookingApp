import { HttpClient, HttpHandler } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/services/authentication.service";
import { ProfileComponent } from "./profile.component";
import { BehaviorSubject } from "rxjs";
import { User } from "src/app/models/user.model";

describe('ProfileComponent', () => {
    let component: ProfileComponent;
    let fixture: ComponentFixture<ProfileComponent>;
    let router: Router;
    let authService: AuthenticationService;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
          imports:[BrowserAnimationsModule],
          declarations: [ProfileComponent],
          providers: [ HttpClient, HttpHandler],
      });
  
      fixture = TestBed.createComponent(ProfileComponent);
      component = fixture.componentInstance;
      authService = TestBed.inject(AuthenticationService);
    });
  
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should test ngOnInit call', () => {
        const mockUser:User = { firstName: "firstName", lastName: "lastName", email: "email", userId: "id", role: "ADMIN", jwtToken: ""}
        authService.user = new BehaviorSubject<User | null>(mockUser);
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
        expect(component.userId).toBe("id");
    })

});