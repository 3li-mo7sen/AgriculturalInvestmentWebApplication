import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestProjectsSearch } from './invest-projects-search';

describe('InvestProjectsSearch', () => {
  let component: InvestProjectsSearch;
  let fixture: ComponentFixture<InvestProjectsSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestProjectsSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestProjectsSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
