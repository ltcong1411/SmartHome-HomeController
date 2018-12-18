import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccctrlComponent } from './user-accctrl.component';

describe('UserAccctrlComponent', () => {
  let component: UserAccctrlComponent;
  let fixture: ComponentFixture<UserAccctrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAccctrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccctrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
