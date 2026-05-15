import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccountsCards } from './admin-accounts-cards';

describe('AdminAccountsCards', () => {
  let component: AdminAccountsCards;
  let fixture: ComponentFixture<AdminAccountsCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAccountsCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAccountsCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
