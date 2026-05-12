import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCards } from './wallet-cards';

describe('WalletCards', () => {
  let component: WalletCards;
  let fixture: ComponentFixture<WalletCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
