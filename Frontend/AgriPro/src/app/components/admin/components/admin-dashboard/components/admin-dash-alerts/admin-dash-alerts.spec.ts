import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashAlerts } from './admin-dash-alerts';

describe('AdminDashAlerts', () => {
  let component: AdminDashAlerts;
  let fixture: ComponentFixture<AdminDashAlerts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashAlerts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashAlerts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
