import { Component } from '@angular/core';
import { ReclamationFormComponent } from './reclamation/reclamation-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReclamationFormComponent],
  template: `
    <div>
      <h1>MFE 1 - Angular</h1>
      <p>Module de réclamation dommages assurance</p>
      <app-reclamation-form (submitClaim)="onClaimSubmit($event)"></app-reclamation-form>
    </div>
  `
})
export class AppComponent {
  onClaimSubmit(data: any) {
    console.log('Réclamation soumise:', data);
  }
}