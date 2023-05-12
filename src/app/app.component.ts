import { Component, OnInit } from '@angular/core';
import { Word } from './word';
import { WordService } from './word.service';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [WordService]
})
export class AppComponent implements OnInit {

  root: Word

  constructor(private service: WordService){}

  ngOnInit(){
    this.root = this.service.getWord()
  }

}