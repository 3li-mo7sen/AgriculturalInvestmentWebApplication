import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerProfile2 } from './farmer-profile2';

describe('FarmerProfile2', () => {
  let component: FarmerProfile2;
  let fixture: ComponentFixture<FarmerProfile2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmerProfile2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarmerProfile2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
