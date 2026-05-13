import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestHistoryCards } from './invest-history-cards';

describe('InvestHistoryCards', () => {
  let component: InvestHistoryCards;
  let fixture: ComponentFixture<InvestHistoryCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestHistoryCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestHistoryCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
