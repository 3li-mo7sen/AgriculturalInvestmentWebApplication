import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectLifecycle } from './project-lifecycle';

describe('ProjectLifecycle', () => {
  let component: ProjectLifecycle;
  let fixture: ComponentFixture<ProjectLifecycle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectLifecycle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectLifecycle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
