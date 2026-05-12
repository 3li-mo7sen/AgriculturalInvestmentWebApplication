import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Expert } from './expert';

describe('Expert', () => {
  let component: Expert;
  let fixture: ComponentFixture<Expert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Expert]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Expert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
