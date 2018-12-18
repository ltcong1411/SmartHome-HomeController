import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LightingcontrolComponent } from './lightingcontrol.component';

describe('LightingcontrolComponent', () => {
  let component: LightingcontrolComponent;
  let fixture: ComponentFixture<LightingcontrolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LightingcontrolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LightingcontrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
