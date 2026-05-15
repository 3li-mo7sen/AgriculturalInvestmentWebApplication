import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashCards } from './admin-dash-cards';

describe('AdminDashCards', () => {
  let component: AdminDashCards;
  let fixture: ComponentFixture<AdminDashCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
