import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports:[ReactiveFormsModule],
  selector: 'app-forgot-password',
  templateUrl: 'test-component.component.html',
  styleUrls: ['test-component.component.css']
})
export class TestComponent {
  forgotPasswordForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;
      console.log('Submit forgot password for:', email);
      // Add your password reset logic here
    }
  }
}
