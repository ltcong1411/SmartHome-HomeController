import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileActionComponent } from './mobile-action.component';

describe('MobileActionComponent', () => {
  let component: MobileActionComponent;
  let fixture: ComponentFixture<MobileActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
