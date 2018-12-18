import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationalOperationComponent } from './relational-operation.component';

describe('RelationalOperationComponent', () => {
  let component: RelationalOperationComponent;
  let fixture: ComponentFixture<RelationalOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationalOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationalOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
