import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertSettingsProfile } from './expert-settings-profile';

describe('ExpertSettingsProfile', () => {
  let component: ExpertSettingsProfile;
  let fixture: ComponentFixture<ExpertSettingsProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertSettingsProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertSettingsProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
