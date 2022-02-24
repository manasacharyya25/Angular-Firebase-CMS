import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Utils } from '../common/utils';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  notifications: Post[];
  showNotifications: boolean;

  constructor(private utils: Utils, private router: Router) { }

  ngOnInit(): void {
    this.utils.getPostsByCategory("Notification").then((respone: Post[]) => {
      this.notifications = respone;
      this.showNotifications = true;
    });
  }

  openNotification(notification: Post) {
    this.router.navigate(['page'], {
      queryParams: {
        title: notification.title
      }
    })
  }
}
