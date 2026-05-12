import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConSearch } from './con-search';

describe('ConSearch', () => {
  let component: ConSearch;
  let fixture: ComponentFixture<ConSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
