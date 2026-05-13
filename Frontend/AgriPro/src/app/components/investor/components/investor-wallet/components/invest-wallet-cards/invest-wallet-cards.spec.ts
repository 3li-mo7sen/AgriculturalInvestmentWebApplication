import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestWalletCards } from './invest-wallet-cards';

describe('InvestWalletCards', () => {
  let component: InvestWalletCards;
  let fixture: ComponentFixture<InvestWalletCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestWalletCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestWalletCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
