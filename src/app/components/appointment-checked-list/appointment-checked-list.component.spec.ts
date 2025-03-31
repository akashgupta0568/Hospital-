import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentCheckedListComponent } from './appointment-checked-list.component';

describe('AppointmentCheckedListComponent', () => {
  let component: AppointmentCheckedListComponent;
  let fixture: ComponentFixture<AppointmentCheckedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentCheckedListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppointmentCheckedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
