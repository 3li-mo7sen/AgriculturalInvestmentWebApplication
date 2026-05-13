import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestWalletQuick } from './invest-wallet-quick';

describe('InvestWalletQuick', () => {
  let component: InvestWalletQuick;
  let fixture: ComponentFixture<InvestWalletQuick>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestWalletQuick]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestWalletQuick);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
