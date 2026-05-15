import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccountsList } from './admin-accounts-list';

describe('AdminAccountsList', () => {
  let component: AdminAccountsList;
  let fixture: ComponentFixture<AdminAccountsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAccountsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAccountsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
