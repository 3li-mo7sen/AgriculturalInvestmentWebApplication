import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertRejectedSearch } from './expert-rejected-search';

describe('ExpertRejectedSearch', () => {
  let component: ExpertRejectedSearch;
  let fixture: ComponentFixture<ExpertRejectedSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertRejectedSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertRejectedSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
