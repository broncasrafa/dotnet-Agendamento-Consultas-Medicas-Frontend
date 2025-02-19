import { Component } from '@angular/core';
import { RouterLinkActive, RouterModule, RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-header',
  standalone: true,
  imports: [RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './menu-header.component.html',
  styleUrl: './menu-header.component.css'
})
export class MenuHeaderComponent {
  emailContact = "rsfrancisco.applications@gmail.com";
}
