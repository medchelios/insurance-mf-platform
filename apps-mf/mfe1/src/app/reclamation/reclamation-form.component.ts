import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reclamation-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reclamation-form">
      <h3>Formulaire de réclamation dommages assurance</h3>
      
      <div class="form-group">
        <label for="typeSinistre">Type de sinistre</label>
        <select id="typeSinistre" [(ngModel)]="form.typeSinistre" name="typeSinistre">
          <option value="">Sélectionner...</option>
          <option value="degats-eaux">Dégôts des eaux</option>
          <option value="incendie">Incendie</option>
          <option value="vol">Vol</option>
          <option value="accident">Accident de circulation</option>
          <option value="autre">Autre</option>
        </select>
      </div>

      <div class="form-group">
        <label for="dateSinistre">Date du sinistre</label>
        <input 
          type="date" 
          id="dateSinistre" 
          [(ngModel)]="form.dateSinistre" 
          name="dateSinistre"
        />
      </div>

      <div class="form-group">
        <label for="description">Description détaillée</label>
        <textarea 
          id="description" 
          [(ngModel)]="form.description" 
          name="description"
          rows="4"
          placeholder="Décrivez les circonstances du sinistre..."
        ></textarea>
      </div>

      <div class="form-group">
        <label for="montantEstime">Montant estimé des dommages (€)</label>
        <input 
          type="number" 
          id="montantEstime" 
          [(ngModel)]="form.montantEstime" 
          name="montantEstime"
          placeholder="0.00"
        />
      </div>

      <div class="form-group">
        <label>
          <input type="checkbox" [(ngModel)]="form.dejaDeclare" name="dejaDeclare" />
          Déclaration déjà effectuée auprès de l'assureur
        </label>
      </div>

      <div class="form-group">
        <label for="numeroContrat">Numéro de contrat</label>
        <input 
          type="text" 
          id="numeroContrat" 
          [(ngModel)]="form.numeroContrat" 
          name="numeroContrat"
          placeholder="Ex: POL-2024-XXXXX"
        />
      </div>

      <button 
        type="button" 
        class="submit-btn"
        (click)="onSubmit()"
        [disabled]="!isValid()">
        Soumettre la réclamation
      </button>
    </div>
  `,
  styles: [`
    .reclamation-form {
      background: #fff;
      padding: 24px;
      border-radius: 8px;
      border: 1px solid #ddd;
      max-width: 500px;
    }
    .reclamation-form h3 {
      margin: 0 0 20px 0;
      color: #333;
    }
    .form-group {
      margin-bottom: 16px;
    }
    .form-group label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
      color: #555;
    }
    .form-group input[type="text"],
    .form-group input[type="date"],
    .form-group input[type="number"],
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }
    .form-group textarea {
      resize: vertical;
    }
    .submit-btn {
      background-color: #dd0031;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      width: 100%;
    }
    .submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .submit-btn:hover:not(:disabled) {
      background-color: #b00228;
    }
  `]
})
export class ReclamationFormComponent {
  @Output() submitClaim = new EventEmitter<any>();

  form = {
    typeSinistre: '',
    dateSinistre: '',
    description: '',
    montantEstime: null as number | null,
    dejaDeclare: false,
    numeroContrat: ''
  };

  isValid(): boolean {
    return !!(
      this.form.typeSinistre &&
      this.form.dateSinistre &&
      this.form.description &&
      this.form.numeroContrat
    );
  }

  onSubmit() {
    if (this.isValid()) {
      this.submitClaim.emit(this.form);
      alert('Réclamation soumise avec succès!');
      this.reset();
    }
  }

  reset() {
    this.form = {
      typeSinistre: '',
      dateSinistre: '',
      description: '',
      montantEstime: null,
      dejaDeclare: false,
      numeroContrat: ''
    };
  }
}