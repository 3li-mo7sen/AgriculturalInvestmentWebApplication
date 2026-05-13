import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorWallet } from './investor-wallet';

describe('InvestorWallet', () => {
  let component: InvestorWallet;
  let fixture: ComponentFixture<InvestorWallet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestorWallet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestorWallet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
