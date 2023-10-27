import { Component, ElementRef, OnInit } from '@angular/core';
import { ScrollService } from 'src/app/services/scroll.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
    constructor(private el: ElementRef, private scrollService: ScrollService) {}
  
    ngOnInit() {
      this.scrollService.scroll$.subscribe((sectionId) => {
        const element = this.el.nativeElement.querySelector(`#${sectionId}`);
        console.info("shahid", element);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
}
