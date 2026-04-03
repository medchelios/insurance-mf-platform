import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button 
      (click)="onClick.emit($event)"
      [disabled]="disabled"
      class="angular-btn">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .angular-btn {
      padding: 8px 16px;
      background-color: #dd0031;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .angular-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class ButtonComponent {
  @Input() disabled = false;
  @Input() onClick: any = () => {};
}