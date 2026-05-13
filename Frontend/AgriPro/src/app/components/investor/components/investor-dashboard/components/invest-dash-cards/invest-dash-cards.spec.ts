import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestDashCards } from './invest-dash-cards';

describe('InvestDashCards', () => {
  let component: InvestDashCards;
  let fixture: ComponentFixture<InvestDashCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestDashCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestDashCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
