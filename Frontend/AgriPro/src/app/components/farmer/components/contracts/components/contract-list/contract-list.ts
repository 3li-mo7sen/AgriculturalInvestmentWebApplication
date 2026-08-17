import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-contract-list',
  imports: [CommonModule],
  templateUrl: './contract-list.html',
  styleUrls: ['./contract-list.css'],
})
export class ContractList {
  @Input() contracts: any[] = [];
  printContract(contract: any) {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <title>Contract - ${contract.contractNumber}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; }
          .contract-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f5132; padding-bottom: 20px; margin-bottom: 30px; }
          .brand { font-size: 24px; font-weight: bold; color: #0f5132; }
          .contract-title { font-size: 20px; font-weight: 600; margin-bottom: 20px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; background: #f8fafc; padding: 20px; border-radius: 8px; }
          .info-item { display: flex; flex-direction: column; gap: 5px; }
          .label { font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; }
          .value { font-size: 16px; font-weight: 600; color: #0f172a; }
          .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="contract-header">
          <div class="brand">Agri-Pro Platform</div>
          <div>Contract #${contract.contractNumber}</div>
        </div>

        <div class="contract-title">Agricultural Investment Agreement</div>

        <div class="info-grid">
          <div class="info-item">
            <span class="label">Project Name</span>
            <span class="value">${contract.projectName || 'N/A'}</span>
          </div>
          <div class="info-item">
            <span class="label">Total Amount</span>
            <span class="value">EGP ${(contract.totalAmount || 0).toLocaleString()}</span>
          </div>
          <div class="info-item">
            <span class="label">Status</span>
            <span class="value">${contract.status}</span>
          </div>
          <div class="info-item">
            <span class="label">Investors Count</span>
            <span class="value">${contract.investorCount || 0} Investors</span>
          </div>
          <div class="info-item">
            <span class="label">Created Date</span>
            <span class="value">${contract.createdAt ? new Date(contract.createdAt).toLocaleDateString() : 'N/A'}</span>
          </div>
          <div class="info-item">
            <span class="label">Expiry Date</span>
            <span class="value">${contract.expiresAt ? new Date(contract.expiresAt).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>

        <p>This is an official document generated from Agri-Pro system certifying the agreement details above.</p>

        <div class="footer">
          Generated on ${new Date().toLocaleDateString()} - Agri-Pro Platform
        </div>

        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() { window.close(); };
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}
