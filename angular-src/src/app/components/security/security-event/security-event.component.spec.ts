import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityEventComponent } from './security-event.component';

describe('SecurityEventComponent', () => {
  let component: SecurityEventComponent;
  let fixture: ComponentFixture<SecurityEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
