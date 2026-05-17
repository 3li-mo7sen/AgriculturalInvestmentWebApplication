import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerInvestment } from './farmer-investment';

describe('FarmerInvestment', () => {
  let component: FarmerInvestment;
  let fixture: ComponentFixture<FarmerInvestment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmerInvestment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarmerInvestment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
