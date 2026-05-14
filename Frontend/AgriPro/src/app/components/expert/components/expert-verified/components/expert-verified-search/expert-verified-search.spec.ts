import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertVerifiedSearch } from './expert-verified-search';

describe('ExpertVerifiedSearch', () => {
  let component: ExpertVerifiedSearch;
  let fixture: ComponentFixture<ExpertVerifiedSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertVerifiedSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertVerifiedSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
