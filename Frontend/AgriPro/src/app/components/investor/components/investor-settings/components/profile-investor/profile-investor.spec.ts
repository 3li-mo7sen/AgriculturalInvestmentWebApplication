import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileInvestor } from './profile-investor';

describe('ProfileInvestor', () => {
  let component: ProfileInvestor;
  let fixture: ComponentFixture<ProfileInvestor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileInvestor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileInvestor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
