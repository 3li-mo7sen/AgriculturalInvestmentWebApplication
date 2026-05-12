import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconsRaw } from './icons-raw';

describe('IconsRaw', () => {
  let component: IconsRaw;
  let fixture: ComponentFixture<IconsRaw>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconsRaw]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconsRaw);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
