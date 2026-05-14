import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertSettingsPreferences } from './expert-settings-preferences';

describe('ExpertSettingsPreferences', () => {
  let component: ExpertSettingsPreferences;
  let fixture: ComponentFixture<ExpertSettingsPreferences>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertSettingsPreferences]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertSettingsPreferences);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
