import { Component } from '@angular/core';
import { ReclamationFormComponent } from './reclamation/reclamation-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReclamationFormComponent],
  template: `
    <div class="mfe-container">
      <app-reclamation-form></app-reclamation-form>
    </div>
  `,
  styles: [`
    .mfe-container {
      padding: 20px;
    }
  `]
})
export class AppComponent {}