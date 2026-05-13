import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsInvestor } from './notifications-investor';

describe('NotificationsInvestor', () => {
  let component: NotificationsInvestor;
  let fixture: ComponentFixture<NotificationsInvestor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsInvestor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsInvestor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
