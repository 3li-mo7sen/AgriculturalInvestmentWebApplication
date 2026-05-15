import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDocCards } from './admin-doc-cards';

describe('AdminDocCards', () => {
  let component: AdminDocCards;
  let fixture: ComponentFixture<AdminDocCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDocCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDocCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
