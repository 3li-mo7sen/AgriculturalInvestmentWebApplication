import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashApprovals } from './admin-dash-approvals';

describe('AdminDashApprovals', () => {
  let component: AdminDashApprovals;
  let fixture: ComponentFixture<AdminDashApprovals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashApprovals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashApprovals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
