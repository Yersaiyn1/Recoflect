import {Component, signal} from '@angular/core';

@Component({
  selector: 'app-home-limit',
  imports: [],
  templateUrl: './home-limit.html',
  styleUrl: './home-limit.css',
})
export class HomeLimit {
  budgetLimit = signal<number>(25.5);
}
