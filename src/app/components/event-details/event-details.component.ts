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

import { LogEvent, LogEventType } from "../../services/log-service";
import { EventSelectionService } from "./../../services/event-select-service";
import { ChangeDetectorRef, Component } from "@angular/core";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";

/**
 * A set of details related to a log events.
 */
export interface EventDetailsParamItem {
  title: string;
  content: string;
}

/**
 * Component responsible for showing all information about a log event, such as event type, timestamp and event specific details (e.g ad units, key values for an ad request)
 */
@Component({
    selector: "app-event-details",
    imports: [TableModule, TagModule],
    templateUrl: "./event-details.component.html",
    styleUrl: "./event-details.component.scss"
})
export class EventDetailsComponent {
  paramItems: EventDetailsParamItem[] = [];
  timestamp: string | undefined;
  type: string | undefined;

  constructor(
    private eventSelectionService: EventSelectionService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.eventSelectionService
      .getSelectedEventObservable()
      .subscribe((value) => this.onSelectedEventChange(value));
  }

  reset(){
    this.paramItems = [];
    this.timestamp = undefined;
    this.type = undefined;
    this.changeDetectorRef.detectChanges();
  }

  onSelectedEventChange(event: LogEvent | undefined) {
    this.paramItems = [];
    if (!event) {
      return;
    }
    const timestampInSeconds = Math.round(event.timestamp / 100) / 10;
    this.timestamp = `${timestampInSeconds}s`;
    this.type = event.type;
    switch (event.type) {
      case LogEventType.AD_REQUEST:
        if(event.gmaParams.iu) this.paramItems.push({ title: "Ad Unit", content: event.gmaParams.iu});
        if(event.gmaParams.slotname) this.paramItems.push({ title: "Slot name", content: event.gmaParams.slotname});
        if(event.gmaParams.sz) this.paramItems.push({ title: "Size(s)", content: event.gmaParams.sz});
        if(event.gmaParams.format) this.paramItems.push({ title: "Format", content: event.gmaParams.format});
        if(!event.gmaParams.cust_params) break;
        for (const kv of event.gmaParams.cust_params) {
          this.paramItems.push({ title: "Key-value", content: kv });
        }
        break;
      default:
        break;
    }
    this.changeDetectorRef.detectChanges();
  }
}
