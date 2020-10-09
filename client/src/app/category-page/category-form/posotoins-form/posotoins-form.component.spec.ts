import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosotoinsFormComponent } from './posotoins-form.component';

describe('PosotoinsFormComponent', () => {
  let component: PosotoinsFormComponent;
  let fixture: ComponentFixture<PosotoinsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosotoinsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosotoinsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
