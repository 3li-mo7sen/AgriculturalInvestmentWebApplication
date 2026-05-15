import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashDistribution } from './admin-dash-distribution';

describe('AdminDashDistribution', () => {
  let component: AdminDashDistribution;
  let fixture: ComponentFixture<AdminDashDistribution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashDistribution]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashDistribution);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
