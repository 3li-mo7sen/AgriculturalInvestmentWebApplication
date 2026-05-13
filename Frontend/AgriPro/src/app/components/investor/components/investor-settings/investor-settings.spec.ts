import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorSettings } from './investor-settings';

describe('InvestorSettings', () => {
  let component: InvestorSettings;
  let fixture: ComponentFixture<InvestorSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestorSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestorSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
