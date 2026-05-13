import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestWalletTransactions } from './invest-wallet-transactions';

describe('InvestWalletTransactions', () => {
  let component: InvestWalletTransactions;
  let fixture: ComponentFixture<InvestWalletTransactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestWalletTransactions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestWalletTransactions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
