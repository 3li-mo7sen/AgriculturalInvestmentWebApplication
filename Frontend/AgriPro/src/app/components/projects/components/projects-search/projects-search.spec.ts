import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsSearch } from './projects-search';

describe('ProjectsSearch', () => {
  let component: ProjectsSearch;
  let fixture: ComponentFixture<ProjectsSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
