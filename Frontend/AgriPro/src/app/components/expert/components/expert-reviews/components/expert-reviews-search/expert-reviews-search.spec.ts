import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertReviewsSearch } from './expert-reviews-search';

describe('ExpertReviewsSearch', () => {
  let component: ExpertReviewsSearch;
  let fixture: ComponentFixture<ExpertReviewsSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertReviewsSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertReviewsSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
