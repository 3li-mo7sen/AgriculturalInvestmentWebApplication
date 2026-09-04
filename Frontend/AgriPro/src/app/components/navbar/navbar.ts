import { AfterViewInit, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar implements AfterViewInit {
  ngAfterViewInit() {
    const navbarNav = document.getElementById('navbarNav');
    if (!navbarNav) {
      return;
    }

    const links = navbarNav.querySelectorAll<HTMLAnchorElement>('.nav-link, .btn-start');
    links.forEach((link) => {
      link.addEventListener('click', () => {
        if (!navbarNav.classList.contains('show')) {
          return;
        }

        const bootstrapCollapse = (window as any).bootstrap?.Collapse;
        if (bootstrapCollapse) {
          const collapseInstance = new bootstrapCollapse(navbarNav, { toggle: false });
          collapseInstance.hide();
        } else {
          navbarNav.classList.remove('show');
        }
      });
    });
  }
}



