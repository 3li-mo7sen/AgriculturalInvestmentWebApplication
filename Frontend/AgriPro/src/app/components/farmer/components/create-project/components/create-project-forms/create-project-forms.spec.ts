import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectForms } from './create-project-forms';

describe('CreateProjectForms', () => {
  let component: CreateProjectForms;
  let fixture: ComponentFixture<CreateProjectForms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProjectForms]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProjectForms);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
