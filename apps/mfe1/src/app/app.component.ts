import { Component } from '@angular/core';
import { ButtonComponent } from './button/button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div>
      <h1>MFE 1 - Angular</h1>
      <p>Ce module expose un bouton via Federation</p>
      <app-button> Bouton Angular </app-button>
    </div>
  `
})
export class AppComponent {}