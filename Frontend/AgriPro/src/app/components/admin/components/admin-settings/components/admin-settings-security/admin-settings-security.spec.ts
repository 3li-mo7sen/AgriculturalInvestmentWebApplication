import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSettingsSecurity } from './admin-settings-security';

describe('AdminSettingsSecurity', () => {
  let component: AdminSettingsSecurity;
  let fixture: ComponentFixture<AdminSettingsSecurity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSettingsSecurity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSettingsSecurity);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
