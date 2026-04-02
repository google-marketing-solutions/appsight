/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {CommonModule} from '@angular/common';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import Aura from '@primeng/themes/aura';
import {MenuItem} from 'primeng/api';
import {AvatarModule} from 'primeng/avatar';
import {ButtonModule} from 'primeng/button';
import {PrimeNG} from 'primeng/config';
import {MenuModule} from 'primeng/menu';
import {MessagesModule} from 'primeng/messages';
import {PanelModule} from 'primeng/panel';
import {ProgressBarModule} from 'primeng/progressbar';
import {SplitterModule} from 'primeng/splitter';
import {TimelineModule} from 'primeng/timeline';
import {ToastModule} from 'primeng/toast';
import {Observable} from 'rxjs';

import {EventDetailsComponent} from './components/event-details/event-details.component';
import {SessionMetricsComponent} from './components/session-metrics/session-metrics.component';
import {TimelineComponent} from './components/timeline/timeline.component';
import {VideoPlayerComponent} from './components/video-player/video-player.component';
import {UploadService, UserProfile} from './services/upload-service';

/** Root app component. */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    CommonModule, VideoPlayerComponent, EventDetailsComponent,
    SessionMetricsComponent, TimelineModule, ToastModule, ButtonModule,
    MessagesModule, TimelineComponent, PanelModule, SplitterModule,
    ProgressBarModule, AvatarModule, MenuModule
  ]
})
export class AppComponent implements AfterViewInit {
  title = 'appsight';
  isLoading$: Observable<boolean>;
  userProfile$: Observable<UserProfile|null>;
  downloadProgress$: Observable<number>;
  downloadFileName$: Observable<string>;
  userMenuItems: MenuItem[] = [];

  @ViewChild(EventDetailsComponent)
  private eventDetailsComponent!: EventDetailsComponent;

  @ViewChild(SessionMetricsComponent)
  private sessionMetricsComponent!: SessionMetricsComponent;

  @ViewChild(TimelineComponent) private timelineComponent!: TimelineComponent;

  constructor(
      private config: PrimeNG, private uploadService: UploadService,
      private route: ActivatedRoute) {
    this.isLoading$ = this.uploadService.getLoading();
    this.userProfile$ = this.uploadService.getUserProfile();
    this.downloadProgress$ = this.uploadService.getDownloadProgress();
    this.downloadFileName$ = this.uploadService.getDownloadFileName();
    this.config.theme.set({preset: Aura, options: {darkModeSelector: 'ad'}});
    this.uploadService.getUploadInitiated().subscribe(
        () => this.eventDetailsComponent?.reset());
    this.uploadService.getUploadInitiated().subscribe(
        () => this.sessionMetricsComponent?.reset());
    this.uploadService.getUploadInitiated().subscribe(
        () => this.timelineComponent?.reset());

    this.userProfile$.subscribe(profile => {
      if (profile) {
        this.userMenuItems = [
          {label: `Signed in as ${profile.name}`, disabled: true}, {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => this.logout()
          }
        ];
      } else {
        this.userMenuItems = [{
          label: 'Login with Google',
          icon: 'pi pi-google',
          command: () => this.login()
        }];
      }
    });
  }

  login() {
    this.uploadService.login();
  }

  logout() {
    this.uploadService.logout();
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      const gcsPath = params['gcs_path'];
      if (gcsPath && gcsPath.trim().startsWith('gs://')) {
        this.uploadService.loadFromGcs(gcsPath.trim());
      }
    });
  }
}
