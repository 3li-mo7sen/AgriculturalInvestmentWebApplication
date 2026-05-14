import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertSettings } from './expert-settings';

describe('ExpertSettings', () => {
  let component: ExpertSettings;
  let fixture: ComponentFixture<ExpertSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
