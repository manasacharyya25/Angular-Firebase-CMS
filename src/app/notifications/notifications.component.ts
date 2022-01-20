import { Component, OnInit } from '@angular/core';
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

  constructor(private utils: Utils) { }

  ngOnInit(): void {
    this.utils.getPostsByCategory("Notification").then((respone: Post[]) => {
      this.notifications = respone;
      this.showNotifications = true;
    });
  }
}
