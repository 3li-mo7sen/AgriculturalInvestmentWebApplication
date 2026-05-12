import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityFarmer } from './security-farmer';

describe('SecurityFarmer', () => {
  let component: SecurityFarmer;
  let fixture: ComponentFixture<SecurityFarmer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityFarmer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityFarmer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
