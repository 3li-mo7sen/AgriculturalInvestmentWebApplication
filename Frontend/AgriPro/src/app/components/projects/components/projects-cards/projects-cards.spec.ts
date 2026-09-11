import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsCards } from './projects-cards';

describe('ProjectsCards', () => {
  let component: ProjectsCards;
  let fixture: ComponentFixture<ProjectsCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
