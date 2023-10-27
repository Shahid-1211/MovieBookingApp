import { ComponentFixture, TestBed } from "@angular/core/testing";
import { WelcomePageComponent } from "./welcome-page.component";

describe('WelcomePageComponent', () => {
    let component: WelcomePageComponent;
    let fixture: ComponentFixture<WelcomePageComponent>;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
          declarations: [WelcomePageComponent]
      });
  
      fixture = TestBed.createComponent(WelcomePageComponent);
      component = fixture.componentInstance;
    });
  
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should test ngOnInit call', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    })

});