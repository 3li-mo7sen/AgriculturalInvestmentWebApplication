import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertReviewsList } from './expert-reviews-list';

describe('ExpertReviewsList', () => {
  let component: ExpertReviewsList;
  let fixture: ComponentFixture<ExpertReviewsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertReviewsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertReviewsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
