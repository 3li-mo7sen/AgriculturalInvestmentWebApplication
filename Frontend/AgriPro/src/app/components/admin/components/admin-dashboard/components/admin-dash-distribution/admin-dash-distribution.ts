import { Component, Input } from '@angular/core';
import { UserDistributionItem } from '../../../../../../models/admin-dashboard';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dash-distribution',
  imports:[CommonModule],
  templateUrl: './admin-dash-distribution.html',
  styleUrls: ['./admin-dash-distribution.css']
})
export class AdminDashDistribution {
  @Input() distribution: UserDistributionItem[] = [];

  getTotalUsers(): number {
    return this.distribution.reduce((acc, item) => acc + item.count, 0);
  }

  getPercentage(count: number): number {
    const total = this.getTotalUsers();
    return total > 0 ? Math.round((count / total) * 100) : 0;
  }

  getRoleColorClass(role: string): string {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bar-admin';
      case 'expert': return 'bar-expert';
      case 'farmer': return 'bar-farmer';
      default: return 'bar-default';
    }
  }
}
