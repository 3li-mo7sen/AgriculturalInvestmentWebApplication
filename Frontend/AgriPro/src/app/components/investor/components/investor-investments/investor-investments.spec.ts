import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorInvestments } from './investor-investments';

describe('InvestorInvestments', () => {
  let component: InvestorInvestments;
  let fixture: ComponentFixture<InvestorInvestments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestorInvestments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestorInvestments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
