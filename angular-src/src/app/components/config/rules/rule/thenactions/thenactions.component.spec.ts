import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThenactionsComponent } from './thenactions.component';

describe('ThenactionsComponent', () => {
  let component: ThenactionsComponent;
  let fixture: ComponentFixture<ThenactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThenactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThenactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
