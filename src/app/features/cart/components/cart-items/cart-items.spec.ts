import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartItems } from './cart-items';

describe('CartItems', () => {
  let component: CartItems;
  let fixture: ComponentFixture<CartItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartItems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
