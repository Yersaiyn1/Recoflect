import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLimit } from './home-limit';

describe('HomeLimit', () => {
  let component: HomeLimit;
  let fixture: ComponentFixture<HomeLimit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeLimit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeLimit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
