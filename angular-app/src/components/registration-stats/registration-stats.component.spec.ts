import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationStatsComponent } from './registration-stats.component';

describe('RegistrationStatsComponent', () => {
  let component: RegistrationStatsComponent;
  let fixture: ComponentFixture<RegistrationStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
