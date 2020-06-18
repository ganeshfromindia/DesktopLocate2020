import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgnitionComponent } from './ignition.component';

describe('IgnitionComponent', () => {
  let component: IgnitionComponent;
  let fixture: ComponentFixture<IgnitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IgnitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgnitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
