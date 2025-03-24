import { Component } from '@angular/core';
import { CommonserviceService } from '../../commonservice.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

  constructor(private service: CommonserviceService){
    this.service.showHeader();
  }

}
