import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReportsAlerts } from './admin-reports-alerts';

describe('AdminReportsAlerts', () => {
  let component: AdminReportsAlerts;
  let fixture: ComponentFixture<AdminReportsAlerts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReportsAlerts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReportsAlerts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
