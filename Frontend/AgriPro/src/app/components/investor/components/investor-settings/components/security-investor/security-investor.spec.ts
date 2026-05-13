import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityInvestor } from './security-investor';

describe('SecurityInvestor', () => {
  let component: SecurityInvestor;
  let fixture: ComponentFixture<SecurityInvestor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityInvestor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityInvestor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
