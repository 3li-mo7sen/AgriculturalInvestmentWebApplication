import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSettingsNotification } from './admin-settings-notification';

describe('AdminSettingsNotification', () => {
  let component: AdminSettingsNotification;
  let fixture: ComponentFixture<AdminSettingsNotification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSettingsNotification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSettingsNotification);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
