import { Component, Inject, OnInit, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { isPlatformBrowser } from '@angular/common';

declare const google: any;

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  ngOnInit(): void {
    // Nothing here
  }

}