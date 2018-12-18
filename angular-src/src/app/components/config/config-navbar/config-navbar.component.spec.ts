import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigNavbarComponent } from './config-navbar.component';

describe('ConfigNavbarComponent', () => {
  let component: ConfigNavbarComponent;
  let fixture: ComponentFixture<ConfigNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
