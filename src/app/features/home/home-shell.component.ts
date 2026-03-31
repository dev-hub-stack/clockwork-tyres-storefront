import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-shell',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-shell.component.html',
  styleUrl: './home-shell.component.scss'
})
export class HomeShellComponent {}
