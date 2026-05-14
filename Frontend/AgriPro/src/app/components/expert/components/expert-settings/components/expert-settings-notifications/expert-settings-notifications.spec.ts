import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertSettingsNotifications } from './expert-settings-notifications';

describe('ExpertSettingsNotifications', () => {
  let component: ExpertSettingsNotifications;
  let fixture: ComponentFixture<ExpertSettingsNotifications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertSettingsNotifications]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertSettingsNotifications);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
