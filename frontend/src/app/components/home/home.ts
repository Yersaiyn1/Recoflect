import {Component, signal} from '@angular/core';
import {Navigation} from '../navigation/navigation';
import {HomeLimit} from '../home-limit/home-limit';
import {HomeRecords} from '../home-records/home-records';

@Component({
  selector: 'app-home',
  imports: [
    Navigation,
    HomeLimit,
    HomeRecords
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  userName: string = "Darkhan";
  isLoggedIn = signal<boolean>(true);

}
