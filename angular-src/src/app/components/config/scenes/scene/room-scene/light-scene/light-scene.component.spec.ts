import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LightSceneComponent } from './light-scene.component';

describe('LightSceneComponent', () => {
  let component: LightSceneComponent;
  let fixture: ComponentFixture<LightSceneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LightSceneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LightSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
