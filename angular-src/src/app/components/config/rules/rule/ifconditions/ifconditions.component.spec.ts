import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IfconditionsComponent } from './ifconditions.component';

describe('IfconditionsComponent', () => {
  let component: IfconditionsComponent;
  let fixture: ComponentFixture<IfconditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IfconditionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IfconditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
