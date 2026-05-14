import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertSettingsSecurity } from './expert-settings-security';

describe('ExpertSettingsSecurity', () => {
  let component: ExpertSettingsSecurity;
  let fixture: ComponentFixture<ExpertSettingsSecurity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertSettingsSecurity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertSettingsSecurity);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
