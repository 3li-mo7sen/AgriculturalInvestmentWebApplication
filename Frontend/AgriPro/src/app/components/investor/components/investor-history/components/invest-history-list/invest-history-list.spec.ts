import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestHistoryList } from './invest-history-list';

describe('InvestHistoryList', () => {
  let component: InvestHistoryList;
  let fixture: ComponentFixture<InvestHistoryList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestHistoryList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestHistoryList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
