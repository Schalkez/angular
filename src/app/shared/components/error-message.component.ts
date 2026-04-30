import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (message) {
      <div class="error-alert">
        {{ message }}
      </div>
    }
  `,
  styles: [`
    .error-alert {
      padding: 10px;
      background-color: #ffebee;
      color: #c62828;
      border-radius: 4px;
      margin-bottom: 15px;
      border: 1px solid #ef9a9a;
      text-align: center;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorMessageComponent {
  @Input() message: string | null = null;
}
