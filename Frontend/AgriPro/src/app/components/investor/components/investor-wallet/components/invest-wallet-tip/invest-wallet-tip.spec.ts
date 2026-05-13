import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestWalletTip } from './invest-wallet-tip';

describe('InvestWalletTip', () => {
  let component: InvestWalletTip;
  let fixture: ComponentFixture<InvestWalletTip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestWalletTip]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestWalletTip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
