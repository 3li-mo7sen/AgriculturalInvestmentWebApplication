import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertDashPerformance } from './expert-dash-performance';

describe('ExpertDashPerformance', () => {
  let component: ExpertDashPerformance;
  let fixture: ComponentFixture<ExpertDashPerformance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertDashPerformance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertDashPerformance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
