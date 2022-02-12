import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { title } from 'process';
import { Utils } from '../common/utils';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  navbarListMap: Map<String, String[]>;
  aboutUsLinks: String[] = [];
  academicsLinks: String[] = [];
  administrationLinks: String[] = [];
  admissionLinks: String[] = [];
  miscellaneousLinks: String[] = [];
  showNavbar: boolean;

  constructor(private router: Router, private utils: Utils) { }

  ngOnInit(): void {
    // Always reload 
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.utils.getNavbarLinks().then((response: Map<String, String[]>) => {
      this.navbarListMap = response;
      this.aboutUsLinks = response.get('About Us') || [];
      this.academicsLinks = response.get('Academics') || [];
      this.administrationLinks = response.get('Administration') || [];
      this.admissionLinks = response.get('Admission') || [];
      this.miscellaneousLinks = response.get('Miscellaneous') || [];
      this.showNavbar =  true;
    });
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
  }

  navigateToPageWithTitle(link: string) {
    if(link=='Management Committee' || link=='Staff'){
      this.router.navigate(['members']);
    }
    else if(link=='Photo Gallery') {
      this.router.navigate(['images']);
    }
    else if(link=='Time Table') {
      this.router.navigate(['page'], {
        queryParams: {
          title: 'School Timings'
        }
      });
    }
    else {
      this.router.navigate(['page'], { queryParams: {title: link}});
    }
  }

}
