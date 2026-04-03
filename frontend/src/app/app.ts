import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Home} from './components/home/home';
import {Navigation} from './components/navigation/navigation';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Home, Navigation],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
