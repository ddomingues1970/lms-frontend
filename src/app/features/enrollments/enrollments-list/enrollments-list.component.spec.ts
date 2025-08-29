import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentsListComponent } from './enrollments-list.component';

describe('EnrollmentsListComponent', () => {
  let component: EnrollmentsListComponent;
  let fixture: ComponentFixture<EnrollmentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
