import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSettingsGeneral } from './admin-settings-general';

describe('AdminSettingsGeneral', () => {
  let component: AdminSettingsGeneral;
  let fixture: ComponentFixture<AdminSettingsGeneral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSettingsGeneral]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSettingsGeneral);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
