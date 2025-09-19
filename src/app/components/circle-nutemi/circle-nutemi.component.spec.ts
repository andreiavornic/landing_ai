import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleNutemiComponent } from './circle-nutemi.component';

describe('CircleNutemiComponent', () => {
  let component: CircleNutemiComponent;
  let fixture: ComponentFixture<CircleNutemiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircleNutemiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircleNutemiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
