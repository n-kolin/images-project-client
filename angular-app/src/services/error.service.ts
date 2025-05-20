import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogData } from '../models/error-dialog.model';
import { ErrorDialogComponent } from '../components/error-dialog/error-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor(private dialog: MatDialog) {}

  /**
   * Show an error dialog with the provided message
   */
  showError(message: string, title?: string): void {
    this.openDialog({
      message,
      title: title || 'Error',
      type: 'error'
    });
  }

  /**
   * Show a warning dialog with the provided message
   */
  showWarning(message: string, title?: string): void {
    this.openDialog({
      message,
      title: title || 'Warning',
      type: 'warning'
    });
  }

  /**
   * Show an info dialog with the provided message
   */
  showInfo(message: string, title?: string): void {
    this.openDialog({
      message,
      title: title || 'Information',
      type: 'info'
    });
  }

  /**
   * Handle HTTP errors and show appropriate dialog
   */
  
  handleHttpError(error: any): void {
    let errorTitle = 'Error';
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorTitle = 'Client Error';
      errorMessage = `${error.error.message}`;
    } else if (error.status) {
      switch (error.status) {
        case 400:
          errorTitle = 'Bad Request';
          errorMessage = 'The request was invalid or cannot be processed';
          break;
        case 401:
          errorTitle = 'Unauthorized';
          errorMessage = 'You need to be authenticated to perform this action';
          break;
        case 403:
          errorTitle = 'Forbidden';
          errorMessage = 'You do not have permission to access this resource';
          break;
        case 404:
          errorTitle = 'Not Found';
          errorMessage = 'The requested resource could not be found';
          break;
        case 408:
          errorTitle = 'Request Timeout';
          errorMessage = 'The server timed out waiting for the request';
          break;
        case 409:
          errorTitle = 'Conflict';
          errorMessage = 'The request could not be completed due to a conflict';
          break;
        case 422:
          errorTitle = 'Validation Error';
          errorMessage = 'The submitted data failed validation';
          break;
        case 429:
          errorTitle = 'Too Many Requests';
          errorMessage = 'You have sent too many requests in a given amount of time';
          break;
        case 500:
          errorTitle = 'Server Error';
          errorMessage = 'The server encountered an unexpected condition';
          break;
        case 502:
          errorTitle = 'Bad Gateway';
          errorMessage = 'The server received an invalid response from the upstream server';
          break;
        case 503:
          errorTitle = 'Service Unavailable';
          errorMessage = 'The server is currently unavailable';
          break;
        case 504:
          errorTitle = 'Gateway Timeout';
          errorMessage = 'The server did not receive a timely response from the upstream server';
          break;
        default:
          errorTitle = `Error ${error.status}`;
          errorMessage = error.statusText || 'An error occurred with the server';
      }
      
      if (error.error && typeof error.error === 'object' && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    
    this.showError(errorMessage, errorTitle);
  }

  private openDialog(data: ErrorDialogData): void {
    this.dialog.open(ErrorDialogComponent, {
      width: '400px',
      data,
      panelClass: 'error-dialog-panel',
      disableClose: true
    });
  }
}