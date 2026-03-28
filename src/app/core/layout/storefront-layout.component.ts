import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClockworkHeaderComponent } from '../../shared/ui/clockwork-header/clockwork-header.component';

@Component({
  selector: 'app-storefront-layout',
  standalone: true,
  imports: [RouterOutlet, ClockworkHeaderComponent],
  templateUrl: './storefront-layout.component.html',
  styleUrl: './storefront-layout.component.scss'
})
export class StorefrontLayoutComponent {}
