import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Testimonals } from './testimonals';

describe('Testimonals', () => {
  let component: Testimonals;
  let fixture: ComponentFixture<Testimonals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Testimonals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Testimonals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
