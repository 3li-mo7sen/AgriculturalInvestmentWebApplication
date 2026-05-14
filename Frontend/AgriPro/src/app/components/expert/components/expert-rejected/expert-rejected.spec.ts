import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertRejected } from './expert-rejected';

describe('ExpertRejected', () => {
  let component: ExpertRejected;
  let fixture: ComponentFixture<ExpertRejected>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertRejected]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertRejected);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
