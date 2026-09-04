import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProjectDetails } from './home-project-details';

describe('HomeProjectDetails', () => {
  let component: HomeProjectDetails;
  let fixture: ComponentFixture<HomeProjectDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProjectDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeProjectDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
