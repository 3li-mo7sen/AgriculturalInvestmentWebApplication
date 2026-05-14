import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertVerifiedProjects } from './expert-verified-projects';

describe('ExpertVerifiedProjects', () => {
  let component: ExpertVerifiedProjects;
  let fixture: ComponentFixture<ExpertVerifiedProjects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertVerifiedProjects]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertVerifiedProjects);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
