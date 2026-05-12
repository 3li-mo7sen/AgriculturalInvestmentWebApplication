import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedBank } from './linked-bank';

describe('LinkedBank', () => {
  let component: LinkedBank;
  let fixture: ComponentFixture<LinkedBank>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkedBank]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkedBank);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
