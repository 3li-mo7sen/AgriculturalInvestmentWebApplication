import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifiedProject } from '../../../../../../models/expert-verified';
import Swal from 'sweetalert2';
import { environment } from '../../../../../../../environment/environment';
@Component({
  standalone: true,
  selector: 'app-expert-verified-projects',
  imports: [CommonModule],
  templateUrl: './expert-verified-projects.html',
  styleUrls: ['./expert-verified-projects.css'],
})
export class ExpertVerifiedProjects {
  @Input() projects: VerifiedProject[] = [];

  openProjectDetails(project: VerifiedProject): void {
    const baseUrl = environment.baseUrl;

    
    const docs = [
      { name: 'Land Ownership Document', url: project.landOwnershipDocUrl },
      { name: 'National ID Document', url: project.nationalIdDocUrl },
      { name: 'Agricultural Permit', url: project.agriculturalPermitDocUrl },
      { name: 'Water Rights Document', url: project.waterRightsDocUrl },
    ].filter(doc => doc.url); 

  
    const docsHtml = docs.length > 0
      ? docs.map(doc => `
          <a href="${baseUrl}${doc.url}" target="_blank" class="btn btn-sm btn-outline-success me-2 mb-2 text-decoration-none">
            <i class="fa-solid fa-file-pdf me-1"></i> ${doc.name}
          </a>
        `).join('')
      : '<span class="text-muted">No documents uploaded.</span>';

    Swal.fire({
      title: `<strong>${project.name}</strong>`,
      icon: 'info',
      width: '600px',
      html: `
        <div class="text-start fs-6 lh-base p-2">
          <p><strong>Farmer:</strong> ${project.farmerName}</p>
          <p><strong>Location:</strong> ${project.governorate || 'N/A'} ${project.district ? '- ' + project.district : ''}</p>
          <p><strong>Crop Type:</strong> ${project.cropType || 'N/A'}</p>
          <p><strong>Total Cost:</strong> EGP ${project.cost?.toLocaleString() || 0}</p>
          <p><strong>Expected Profit:</strong> ${project.expectedProfit}%</p>
          <p><strong>Duration:</strong> ${project.duration} Months</p>
          <p><strong>Land Size:</strong> ${project.landSize || 'N/A'} Feddans</p>
          <p><strong>Soil / Water:</strong> ${project.soilType || 'N/A'} / ${project.waterSource || 'N/A'}</p>
          
          <hr/>
          <p><strong>Description:</strong> ${project.fullDescription || project.shortDescription || 'No description provided.'}</p>
          
          <hr/>
          <h6 class="fw-bold mb-2"><i class="fa-solid fa-folder-open me-1"></i> Attached Documents:</h6>
          <div class="d-flex flex-wrap gap-1 mt-2">
            ${docsHtml}
          </div>
        </div>
      `,
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: '<i class="fa fa-check"></i> Close',
      confirmButtonColor: '#10b981'
    });
  }
}
