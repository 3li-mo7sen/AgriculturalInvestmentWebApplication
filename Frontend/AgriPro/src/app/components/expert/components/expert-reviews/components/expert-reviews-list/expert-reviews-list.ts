import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpertService } from '../../../../../../services/expertService/expert.service';
import { PendingProject } from '../../../../../../models/expert-pending';
import { environment } from '../../../../../../../environment/environment';



@Component({
  selector: 'app-expert-reviews-list',
  imports: [CommonModule,FormsModule],
  templateUrl: './expert-reviews-list.html',
  styleUrls: ['./expert-reviews-list.css'],
})
export class ExpertReviewsList {
  @Input() reviews: PendingProject[] = [];
  @Output() actionSuccess = new EventEmitter<void>();

  selectedReview: PendingProject | null = null;
  showVerifyModal = false;
  showRejectModal = false;

  verificationNotes = '';
  rejectionReason = '';
  isSubmitting = false;

  

  constructor(private expertService: ExpertService) { }

  getDocUrl(path: string | null | undefined): string {
    if (!path) return '#';

    
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

   
    const baseUrl = environment.baseUrl.endsWith('/')
      ? environment.baseUrl.slice(0, -1)
      : environment.baseUrl;

    
    const formattedPath = path.startsWith('/') ? path : `/${path}`;

    
    return `${baseUrl}${formattedPath}`;
  }

  openReview(review: PendingProject) {
    this.selectedReview = review;
  }

  closeReview() {
    this.selectedReview = null;
    this.showVerifyModal = false;
    this.showRejectModal = false;
  }

  openVerifyModal() {
    this.verificationNotes = 'All documentation verified.';
    this.showVerifyModal = true;
  }

  closeVerifyModal() {
    this.showVerifyModal = false;
  }

  confirmVerify() {
    if (!this.selectedReview) return;

    this.isSubmitting = true;
    this.expertService.verifyProject(this.selectedReview.id, { notes: this.verificationNotes }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeReview();
        this.actionSuccess.emit();
      },
      error: (err) => {
        console.error('Error verifying project:', err);
        this.isSubmitting = false;
      }
    });
  }

  openRejectModal() {
    this.rejectionReason = '';
    this.showRejectModal = true;
  }

  closeRejectModal() {
    this.showRejectModal = false;
  }

  confirmReject() {
    if (!this.selectedReview || !this.rejectionReason.trim()) return;

    this.isSubmitting = true;
    this.expertService.rejectProject(this.selectedReview.id, { reason: this.rejectionReason }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeReview();
        this.actionSuccess.emit();
      },
      error: (err) => {
        console.error('Error rejecting project:', err);
        this.isSubmitting = false;
      }
    });
  }
}
