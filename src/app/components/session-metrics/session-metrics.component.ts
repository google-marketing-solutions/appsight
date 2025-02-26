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

import { Component } from "@angular/core";
import {
  LogEvent,
  LogEventType,
  Logs,
  LogService,
} from "../../services/log-service";
import { EventSelectionService } from "../../services/event-select-service";
import { TimelineModule } from "primeng/timeline";
import { TagModule } from "primeng/tag";


/**
 * A metric about the user session (e.g impression). It can be associated to a computed value (e.g render rate).
 */
export interface SessionMetric {
  title: string;
  value: number;
  computedValueTitle?: string;
  computedValue?: number;
  computedValueColor?: string;
}

/**
 * Component responsible for showing high level metrics about a user session (e.g render rate).
 */
@Component({
    selector: "app-session-metrics",
    imports: [TimelineModule, TagModule],
    templateUrl: "./session-metrics.component.html",
    styleUrl: "./session-metrics.component.scss"
})
export class SessionMetricsComponent {
  sessionMetrics: SessionMetric[] = [];

  constructor(
    private logService: LogService,
    private eventSelectionService: EventSelectionService
  ) {
    this.logService.getLogsObsersable().subscribe(this.onLogsChange.bind(this));
    this.eventSelectionService
      .getSelectedEventObservable()
      .subscribe(this.onSelectedEventChange.bind(this));
  }

  reset(){
    this.sessionMetrics = [];
  }

  private onLogsChange(logs: Logs | undefined) {
    const getCountOfType = (type: LogEventType) => {
      if (!logs?.events) return 0;
      return logs?.events.filter((item) => item.type === type).length;
    };
    const requests = getCountOfType(LogEventType.AD_REQUEST);
    const impressions = getCountOfType(LogEventType.IMPRESSION);
    const viewables = getCountOfType(LogEventType.VIEWABLE);

    const renderRate = Math.round((100 * impressions) / requests);
    const viewability = Math.round((100 * viewables) / impressions);

    const mutedColorForValue = (
      value: number,
    ): "success" | "info" | "warning" | "danger" | "secondary" | "contrast" => {
      if (value > 70) return "success";
      if (value < 30) return "danger";
      if (value < 55) return "warning";
      return "secondary";
    };

    this.sessionMetrics = [
      { title: "Requests", value: requests },
      {
        title: "Impressions",
        value: impressions,
        computedValueTitle: "Render rate",
        computedValue: renderRate,
        computedValueColor: mutedColorForValue(renderRate),
      },
      {
        title: "Viewable impressions",
        value: viewables,
        computedValueTitle: "Viewability",
        computedValue: viewability,
        computedValueColor: mutedColorForValue(viewability),
      },
    ];
  }

  private onSelectedEventChange(event: LogEvent | undefined) {}
}
