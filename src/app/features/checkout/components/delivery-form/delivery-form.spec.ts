import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryForm } from './delivery-form';

describe('DeliveryForm', () => {
  let component: DeliveryForm;
  let fixture: ComponentFixture<DeliveryForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
