import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorProjectDetails } from './investor-project-details';

describe('InvestorProjectDetails', () => {
  let component: InvestorProjectDetails;
  let fixture: ComponentFixture<InvestorProjectDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestorProjectDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestorProjectDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
