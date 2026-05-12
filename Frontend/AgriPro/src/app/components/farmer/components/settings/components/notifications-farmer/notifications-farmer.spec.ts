import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsFarmer } from './notifications-farmer';

describe('NotificationsFarmer', () => {
  let component: NotificationsFarmer;
  let fixture: ComponentFixture<NotificationsFarmer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsFarmer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsFarmer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
