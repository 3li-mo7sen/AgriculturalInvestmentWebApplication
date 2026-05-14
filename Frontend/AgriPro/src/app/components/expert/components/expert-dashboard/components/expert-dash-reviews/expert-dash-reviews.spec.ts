import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertDashReviews } from './expert-dash-reviews';

describe('ExpertDashReviews', () => {
  let component: ExpertDashReviews;
  let fixture: ComponentFixture<ExpertDashReviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertDashReviews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertDashReviews);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
