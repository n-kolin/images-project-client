import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogData } from '../../models/error-dialog.model';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [
    MatDialogContent,MatDialogActions,MatIcon,NgClass
  ],
  templateUrl: './error-dialog.component.html',
  styleUrl: './error-dialog.component.css'
})
export class ErrorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ErrorDialogData
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  get dialogTitle(): string {
    return this.data.title || this.getDefaultTitle();
  }

  get dialogIcon(): string {
    switch (this.data.type) {
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'error':
      default:
        return 'error';
    }
  }

  get iconClass(): string {
    switch (this.data.type) {
      case 'warning':
        return 'warning-icon';
      case 'info':
        return 'info-icon';
      case 'error':
      default:
        return 'error-icon';
    }
  }

  private getDefaultTitle(): string {
    switch (this.data.type) {
      case 'warning':
        return 'Warning';
      case 'info':
        return 'Information';
      case 'error':
      default:
        return 'Error';
    }
  }
}