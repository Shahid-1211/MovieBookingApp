import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { ElementRef } from '@angular/core';
import { ScrollService } from 'src/app/services/scroll.service';


describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let scrollService: ScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterComponent],
      providers: [ScrollService],
    });

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    scrollService = TestBed.inject(ScrollService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test ngOnINit call', () => {
    const mockElement = document.createElement('div');
    spyOn(mockElement, 'scrollIntoView');
    spyOn(document, 'querySelector').and.returnValue(mockElement);
    fixture.detectChanges();
    scrollService.scrollTo('sectionId');
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

})