import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertVerifiedCards } from './expert-verified-cards';

describe('ExpertVerifiedCards', () => {
  let component: ExpertVerifiedCards;
  let fixture: ComponentFixture<ExpertVerifiedCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertVerifiedCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertVerifiedCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
