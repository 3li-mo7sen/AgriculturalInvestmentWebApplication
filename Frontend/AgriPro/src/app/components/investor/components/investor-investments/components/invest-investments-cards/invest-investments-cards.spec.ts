import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestInvestmentsCards } from './invest-investments-cards';

describe('InvestInvestmentsCards', () => {
  let component: InvestInvestmentsCards;
  let fixture: ComponentFixture<InvestInvestmentsCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestInvestmentsCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestInvestmentsCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
