import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReportsVolume } from './admin-reports-volume';

describe('AdminReportsVolume', () => {
  let component: AdminReportsVolume;
  let fixture: ComponentFixture<AdminReportsVolume>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReportsVolume]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReportsVolume);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
