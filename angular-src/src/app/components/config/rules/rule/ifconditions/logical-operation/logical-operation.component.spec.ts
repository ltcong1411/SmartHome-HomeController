import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogicalOperationComponent } from './logical-operation.component';

describe('LogicalOperationComponent', () => {
  let component: LogicalOperationComponent;
  let fixture: ComponentFixture<LogicalOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogicalOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogicalOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
