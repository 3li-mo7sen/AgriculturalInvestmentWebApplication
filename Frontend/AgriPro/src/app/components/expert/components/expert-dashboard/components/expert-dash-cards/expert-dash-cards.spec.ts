import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertDashCards } from './expert-dash-cards';

describe('ExpertDashCards', () => {
  let component: ExpertDashCards;
  let fixture: ComponentFixture<ExpertDashCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertDashCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertDashCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
