import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorHistory } from './investor-history';

describe('InvestorHistory', () => {
  let component: InvestorHistory;
  let fixture: ComponentFixture<InvestorHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestorHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestorHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
