import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertNav } from './expert-nav';

describe('ExpertNav', () => {
  let component: ExpertNav;
  let fixture: ComponentFixture<ExpertNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertNav]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertNav);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
