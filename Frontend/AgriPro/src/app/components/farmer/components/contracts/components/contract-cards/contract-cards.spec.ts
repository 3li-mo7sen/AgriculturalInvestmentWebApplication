import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractCards } from './contract-cards';

describe('ContractCards', () => {
  let component: ContractCards;
  let fixture: ComponentFixture<ContractCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
