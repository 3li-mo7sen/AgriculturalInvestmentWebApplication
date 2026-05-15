import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReportsReports } from './admin-reports-reports';

describe('AdminReportsReports', () => {
  let component: AdminReportsReports;
  let fixture: ComponentFixture<AdminReportsReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReportsReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReportsReports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
