import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandImages } from './land-images';

describe('LandImages', () => {
  let component: LandImages;
  let fixture: ComponentFixture<LandImages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandImages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandImages);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
