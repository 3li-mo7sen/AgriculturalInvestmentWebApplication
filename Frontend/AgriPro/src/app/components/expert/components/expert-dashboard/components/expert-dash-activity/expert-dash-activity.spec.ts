import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertDashActivity } from './expert-dash-activity';

describe('ExpertDashActivity', () => {
  let component: ExpertDashActivity;
  let fixture: ComponentFixture<ExpertDashActivity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertDashActivity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertDashActivity);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
