import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestDashProjects } from './invest-dash-projects';

describe('InvestDashProjects', () => {
  let component: InvestDashProjects;
  let fixture: ComponentFixture<InvestDashProjects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestDashProjects]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestDashProjects);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
