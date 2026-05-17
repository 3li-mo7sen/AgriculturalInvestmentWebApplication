import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerDocuments } from './farmer-documents';

describe('FarmerDocuments', () => {
  let component: FarmerDocuments;
  let fixture: ComponentFixture<FarmerDocuments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmerDocuments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarmerDocuments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
