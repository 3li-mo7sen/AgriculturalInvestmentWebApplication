import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertRejectedCards } from './expert-rejected-cards';

describe('ExpertRejectedCards', () => {
  let component: ExpertRejectedCards;
  let fixture: ComponentFixture<ExpertRejectedCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertRejectedCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertRejectedCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
