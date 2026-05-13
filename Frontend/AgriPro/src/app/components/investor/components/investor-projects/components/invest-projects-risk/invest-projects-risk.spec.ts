import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestProjectsRisk } from './invest-projects-risk';

describe('InvestProjectsRisk', () => {
  let component: InvestProjectsRisk;
  let fixture: ComponentFixture<InvestProjectsRisk>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestProjectsRisk]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestProjectsRisk);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
