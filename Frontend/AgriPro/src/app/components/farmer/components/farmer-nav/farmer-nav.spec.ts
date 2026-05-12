import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerNav } from './farmer-nav';

describe('FarmerNav', () => {
  let component: FarmerNav;
  let fixture: ComponentFixture<FarmerNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmerNav]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarmerNav);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
