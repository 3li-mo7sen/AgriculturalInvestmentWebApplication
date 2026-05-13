import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestWalletBank } from './invest-wallet-bank';

describe('InvestWalletBank', () => {
  let component: InvestWalletBank;
  let fixture: ComponentFixture<InvestWalletBank>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestWalletBank]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestWalletBank);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
