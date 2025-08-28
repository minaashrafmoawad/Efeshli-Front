import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ هذا مهم جداً!
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent {
  // Profile Data
  profileData = {
    firstName: 'Omnya',
    lastName: 'Ahmed',
    email: 'omnyaahmed959@gmail.com',
    phone: '20106811435',
    countryCode: '+20'
  };

  // Modal state
  showPasswordModal = false;
  
  // Password change form data
  passwordData = {
    newPassword: '',
    confirmPassword: ''
  };

  // -------------------------------
  // Profile Save Method
  // -------------------------------
  onSaveChanges(): void {
    // Validation
    if (!this.profileData.firstName || !this.profileData.lastName) {
      alert('Please fill in your first and last name!');
      return;
    }

    if (!this.profileData.email) {
      alert('Please enter your email!');
      return;
    }

    if (!this.profileData.phone) {
      alert('Please enter your phone number!');
      return;
    }

    console.log('Profile data saved:', this.profileData);
    alert('Profile changes saved successfully!');
  }

  // -------------------------------
  // Password Modal Controls
  // -------------------------------
  onChangePassword(): void {
    console.log('🔧 Change password button clicked!'); // Debug log
    alert('Change password clicked ✅'); // Debug alert
    
    this.showPasswordModal = true;
    this.resetPasswordData();
  }

  closePasswordModal(): void {
    console.log('Password modal closed');
    this.showPasswordModal = false;
    this.resetPasswordData();
  }

  private resetPasswordData(): void {
    this.passwordData = {
      newPassword: '',
      confirmPassword: ''
    };
  }

  // -------------------------------
  // Save Password Method
  // -------------------------------
  savePasswordChanges(): void {
    // Validation
    if (!this.passwordData.newPassword || !this.passwordData.confirmPassword) {
      alert('Please fill in both password fields!');
      return;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (this.passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    // Additional password strength validation
    if (this.passwordData.newPassword.length < 8) {
      const confirm = window.confirm('Password is less than 8 characters. It\'s recommended to use at least 8 characters. Continue anyway?');
      if (!confirm) {
        return;
      }
    }

    console.log('Password changed successfully');
    alert('Password changed successfully!');
    this.closePasswordModal();
  }

  // -------------------------------
  // Sign Out Method
  // -------------------------------
  onSignOut(): void {
    console.log('Sign out clicked');
    const confirmSignOut = window.confirm('Are you sure you want to sign out?');
    
    if (confirmSignOut) {
      // Here you would typically call a logout service
      console.log('User signed out');
      alert('Signed out successfully!');
      // Redirect to login page or perform logout logic
      // this.router.navigate(['/login']);
    }
  }

  // -------------------------------
  // Additional Helper Methods
  // -------------------------------

  // Method to format phone number display
  getFormattedPhone(): string {
    return `${this.profileData.countryCode} ${this.profileData.phone}`;
  }

  // Method to validate email format
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Method to validate phone number
  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\d{10,15}$/; // 10-15 digits
    return phoneRegex.test(phone);
  }

  // Enhanced validation for save changes
  private validateProfileData(): boolean {
    if (!this.profileData.firstName.trim()) {
      alert('First name is required!');
      return false;
    }

    if (!this.profileData.lastName.trim()) {
      alert('Last name is required!');
      return false;
    }

    if (!this.isValidEmail(this.profileData.email)) {
      alert('Please enter a valid email address!');
      return false;
    }

    if (!this.isValidPhone(this.profileData.phone)) {
      alert('Please enter a valid phone number (10-15 digits)!');
      return false;
    }

    return true;
  }

  // Method to handle form input changes
  onInputChange(field: string, value: string): void {
    console.log(`Field ${field} changed to: ${value}`);
    // You can add real-time validation here if needed
  }

  // Method to handle country code change
  onCountryCodeChange(countryCode: string): void {
    this.profileData.countryCode = countryCode;
    console.log('Country code changed to:', countryCode);
  }
}