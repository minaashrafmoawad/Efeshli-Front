/* import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartItems} from './features/cart/components/cart-items'; // غيرت الـ import

describe('CartItems', () => {
  let component: CartItems; // غيرت من CartItems
  let fixture: ComponentFixture<CartItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartItems] // غيرت من CartItems
    }).compileComponents();

    fixture = TestBed.createComponent(CartItems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call startShopping', () => {
    spyOn(console, 'log');
    component.startShopping();
    expect(console.log).toHaveBeenCalledWith('Redirecting to shop...');
  });
}); */