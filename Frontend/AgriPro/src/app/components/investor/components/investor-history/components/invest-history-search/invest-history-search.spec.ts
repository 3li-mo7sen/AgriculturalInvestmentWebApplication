import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestHistorySearch } from './invest-history-search';

describe('InvestHistorySearch', () => {
  let component: InvestHistorySearch;
  let fixture: ComponentFixture<InvestHistorySearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestHistorySearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestHistorySearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
