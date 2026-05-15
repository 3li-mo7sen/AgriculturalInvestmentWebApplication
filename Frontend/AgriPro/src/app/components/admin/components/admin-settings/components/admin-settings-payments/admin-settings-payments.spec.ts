import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSettingsPayments } from './admin-settings-payments';

describe('AdminSettingsPayments', () => {
  let component: AdminSettingsPayments;
  let fixture: ComponentFixture<AdminSettingsPayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSettingsPayments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSettingsPayments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
