import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  private searchQuery = new Subject<string>();

  constructor() {
    this.searchQuery.pipe(debounceTime(300)).subscribe(query => {
      console.log('Search query:', query);
    });
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery.next(target.value);
  }

  onMenuClick(category: string) {
    console.log('Menu clicked:', category);
  }

  onActionClick(action: string) {
    console.log(action);
  }
}
