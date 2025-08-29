import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasklogsListComponent } from './tasklogs-list.component';

describe('TasklogsListComponent', () => {
  let component: TasklogsListComponent;
  let fixture: ComponentFixture<TasklogsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasklogsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasklogsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
