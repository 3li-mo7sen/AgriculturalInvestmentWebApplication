import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertRejectedList } from './expert-rejected-list';

describe('ExpertRejectedList', () => {
  let component: ExpertRejectedList;
  let fixture: ComponentFixture<ExpertRejectedList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertRejectedList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertRejectedList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
