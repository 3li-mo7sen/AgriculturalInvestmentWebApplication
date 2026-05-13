import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorProjects } from './investor-projects';

describe('InvestorProjects', () => {
  let component: InvestorProjects;
  let fixture: ComponentFixture<InvestorProjects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestorProjects]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestorProjects);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
