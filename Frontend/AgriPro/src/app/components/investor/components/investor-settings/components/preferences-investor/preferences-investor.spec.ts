import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencesInvestor } from './preferences-investor';

describe('PreferencesInvestor', () => {
  let component: PreferencesInvestor;
  let fixture: ComponentFixture<PreferencesInvestor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferencesInvestor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreferencesInvestor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
