import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogicalOperation2ndLayerComponent } from './logical-operation-2nd-layer.component';

describe('LogicalOperation2ndLayerComponent', () => {
  let component: LogicalOperation2ndLayerComponent;
  let fixture: ComponentFixture<LogicalOperation2ndLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogicalOperation2ndLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogicalOperation2ndLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
