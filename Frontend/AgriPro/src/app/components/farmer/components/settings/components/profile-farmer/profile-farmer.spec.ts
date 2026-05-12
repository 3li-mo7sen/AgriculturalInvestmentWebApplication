import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileFarmer } from './profile-farmer';

describe('ProfileFarmer', () => {
  let component: ProfileFarmer;
  let fixture: ComponentFixture<ProfileFarmer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileFarmer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileFarmer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
