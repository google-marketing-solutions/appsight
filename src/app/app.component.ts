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

import { Component, ViewChild} from '@angular/core';
import { UploadService } from './services/upload-service';
import { LogService } from './services/log-service';
import { MessageService } from 'primeng/api';
import { EventSelectionService } from './services/event-select-service';
import { TimelineModule } from 'primeng/timeline';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { SplitterModule } from 'primeng/splitter';
import { ToastModule } from 'primeng/toast';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { SessionMetricsComponent } from './components/session-metrics/session-metrics.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { PrimeNG } from 'primeng/config';

import Aura from '@primeng/themes/aura';

/** Root app component. */
@Component({
    selector: 'app-root',
    providers: [UploadService, LogService, MessageService, EventSelectionService],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [
        RouterOutlet,
        VideoPlayerComponent,
        EventDetailsComponent,
        SessionMetricsComponent,
        TimelineModule,
        ToastModule,
        ButtonModule,
        MessagesModule,
        TimelineComponent,
        PanelModule,
        SplitterModule
    ]
})
export class AppComponent {
  title = 'appsight';
  @ViewChild(EventDetailsComponent)
  private eventDetailsComponent!: EventDetailsComponent;

  @ViewChild(SessionMetricsComponent)
  private sessionMetricsComponent!: SessionMetricsComponent;

  @ViewChild(TimelineComponent)
  private timelineComponent!: TimelineComponent;

  constructor(private config: PrimeNG, private uploadService: UploadService) {
    this.config.theme.set({
      preset: Aura,
      options: {
        darkModeSelector: 'ad'
      }
    });
    this.uploadService.getUploadInitiated().subscribe( () => this.eventDetailsComponent.reset());
    this.uploadService.getUploadInitiated().subscribe( () => this.sessionMetricsComponent.reset());
    this.uploadService.getUploadInitiated().subscribe( () => this.timelineComponent.reset());
  }
}
