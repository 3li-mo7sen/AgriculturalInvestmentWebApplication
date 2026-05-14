import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertVerified } from './expert-verified';

describe('ExpertVerified', () => {
  let component: ExpertVerified;
  let fixture: ComponentFixture<ExpertVerified>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertVerified]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertVerified);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
