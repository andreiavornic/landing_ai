import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideDataComponent } from './slide-data.component';

describe('SlideDataComponent', () => {
  let component: SlideDataComponent;
  let fixture: ComponentFixture<SlideDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlideDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
