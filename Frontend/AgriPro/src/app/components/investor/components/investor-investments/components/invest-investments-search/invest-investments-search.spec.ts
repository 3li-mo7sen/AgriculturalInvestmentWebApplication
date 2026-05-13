import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestInvestmentsSearch } from './invest-investments-search';

describe('InvestInvestmentsSearch', () => {
  let component: InvestInvestmentsSearch;
  let fixture: ComponentFixture<InvestInvestmentsSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestInvestmentsSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestInvestmentsSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
