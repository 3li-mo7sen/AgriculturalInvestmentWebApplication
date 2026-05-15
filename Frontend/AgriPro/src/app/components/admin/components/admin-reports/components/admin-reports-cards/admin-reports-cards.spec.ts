import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReportsCards } from './admin-reports-cards';

describe('AdminReportsCards', () => {
  let component: AdminReportsCards;
  let fixture: ComponentFixture<AdminReportsCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReportsCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReportsCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
