import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeAccessComponent } from './qrcode-access.component';

describe('QrcodeAccessComponent', () => {
  let component: QrcodeAccessComponent;
  let fixture: ComponentFixture<QrcodeAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrcodeAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodeAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
