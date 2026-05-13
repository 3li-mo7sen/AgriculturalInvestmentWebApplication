import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestProjectsProjects } from './invest-projects-projects';

describe('InvestProjectsProjects', () => {
  let component: InvestProjectsProjects;
  let fixture: ComponentFixture<InvestProjectsProjects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestProjectsProjects]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestProjectsProjects);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
