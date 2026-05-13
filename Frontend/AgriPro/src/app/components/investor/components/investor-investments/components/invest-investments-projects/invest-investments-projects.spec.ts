import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestInvestmentsProjects } from './invest-investments-projects';

describe('InvestInvestmentsProjects', () => {
  let component: InvestInvestmentsProjects;
  let fixture: ComponentFixture<InvestInvestmentsProjects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestInvestmentsProjects]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestInvestmentsProjects);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
