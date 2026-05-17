import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandForm } from './land-form';

describe('LandForm', () => {
  let component: LandForm;
  let fixture: ComponentFixture<LandForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
