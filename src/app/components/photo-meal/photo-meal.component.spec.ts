import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoMealComponent } from './photo-meal.component';

describe('PhotoMealComponent', () => {
  let component: PhotoMealComponent;
  let fixture: ComponentFixture<PhotoMealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoMealComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoMealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
