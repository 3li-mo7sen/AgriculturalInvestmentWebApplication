import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencesFarmer } from './preferences-farmer';

describe('PreferencesFarmer', () => {
  let component: PreferencesFarmer;
  let fixture: ComponentFixture<PreferencesFarmer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferencesFarmer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreferencesFarmer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
