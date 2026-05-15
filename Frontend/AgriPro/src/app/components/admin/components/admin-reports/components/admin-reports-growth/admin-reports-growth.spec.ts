import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReportsGrowth } from './admin-reports-growth';

describe('AdminReportsGrowth', () => {
  let component: AdminReportsGrowth;
  let fixture: ComponentFixture<AdminReportsGrowth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReportsGrowth]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReportsGrowth);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
