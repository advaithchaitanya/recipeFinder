import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealSlidePanelComponent } from './meal-slide-panel.component';

describe('MealSlidePanelComponent', () => {
  let component: MealSlidePanelComponent;
  let fixture: ComponentFixture<MealSlidePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealSlidePanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealSlidePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
