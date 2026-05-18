import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorProfile2 } from './investor-profile2';

describe('InvestorProfile2', () => {
  let component: InvestorProfile2;
  let fixture: ComponentFixture<InvestorProfile2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestorProfile2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestorProfile2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
