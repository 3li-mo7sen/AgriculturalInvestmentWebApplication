import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestDashInvestments } from './invest-dash-investments';

describe('InvestDashInvestments', () => {
  let component: InvestDashInvestments;
  let fixture: ComponentFixture<InvestDashInvestments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestDashInvestments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestDashInvestments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
