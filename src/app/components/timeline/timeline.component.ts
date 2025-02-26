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

import {
  ApexAxisChartSeries,
  ApexDataLabels,
  ApexGrid,
  ApexTooltip,
} from "./../../../../node_modules/ng-apexcharts/lib/model/apex-types.d";
import {
  LogEventType,
  Logs,
  LogService,
} from "./../../services/log-service";
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";

import {
  ChartComponent,
  ApexChart,
  ApexPlotOptions,
  ApexXAxis,
  ApexYAxis,
  ApexMarkers,
  NgApexchartsModule,
  ApexFill,
  ApexLegend,
} from "ng-apexcharts";
import { EventSelectionService } from "../../services/event-select-service";
import { VideoPlayerService } from "../../services/video-player-service";

/**
 * ApexCharts Options
 */
export interface ChartOptions {
  series: ApexAxisChartSeries;
  colors: string[];
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  markers: ApexMarkers;
  legend: ApexLegend;
  tooltip: ApexTooltip;
}

/**
 * Component to chart all log events on a timeline
 */
@Component({
    selector: "app-timeline",
    imports: [NgApexchartsModule],
    templateUrl: "./timeline.component.html",
    styleUrl: "./timeline.component.scss"
})
export class TimelineComponent implements AfterViewInit {
  @ViewChild("timeline") timelineContainer: ElementRef = {} as ElementRef;

  @ViewChild("chart", { static: false }) chart: ChartComponent | undefined;
  chartOptions: Partial<ChartOptions> | undefined;
  private formattedSeries: ApexAxisChartSeries | undefined;
  private logs: Logs | undefined;

  constructor(
    private logService: LogService,
    private selectService: EventSelectionService,
    private videoPlayerService: VideoPlayerService
  ) {
    this.initChart();
    this.logService.getLogsObsersable().subscribe((logs) => {
      if (logs) {
        this.logs = logs;
        this.updateChart();
      }
    });
    this.videoPlayerService.getVideoPositionUpdateObservable().subscribe((time) => this.updatePlayHead(time));
  }

  ngAfterViewInit(): void { }

  reset() {
    const series: ApexAxisChartSeries = [];
    this.chart?.updateOptions({ series, xaxis: { min: 0, max: 10, tickAmount: 10 } });
  }

  updatePlayHead(time: number){
    const xValue = Number(time) * 1000;
    this.chart?.updateOptions({
      annotations: {
        xaxis: [
          {
            x: xValue,
            borderColor: 'red',
            label: {
              style: {
                color: 'red',
              },
              orientation: 'horizontal',
              text: '►',
              position: 'bottom',
            }
          }
        ]
      }
    });
  }

  formatData() {
    if (!this.logs) return;
    const series: ApexAxisChartSeries = [];
    let serieIndex = 0;
    for (const [logTypeValueKey, logTypeValue] of Object.entries(LogEventType)){
      const serieName = logTypeValueKey;
      const events = this.logs.events.filter((e) => e.type === logTypeValue);
      const data = events.map((e) => [e.timestamp, serieIndex]);
      series.push({ name: serieName, data });
      serieIndex++;
    }
    this.formattedSeries = series;
  }

  /**
   * Find the events with the highest timestamp, and round it to the nearest second,
   * and add a second to make sure the chart is readable.
   * Returns a value in milliseconds.
   */
  getMaxTimeStampInMilliseconds() {
    if (!this.logs) return 0;
    const maxTimestamp = Math.max(
      ...this.logs.events.map((item) => item.timestamp)
    );
    const roundedMaxTimestamp = Math.ceil(maxTimestamp / 1000) * 1000 + 1000;
    return roundedMaxTimestamp;
  }

  getEventFromChartContext(serieIndex: number, dataPointIndex: number) {
    const type = Object.entries(LogEventType)[serieIndex];
    const events = this.logs?.events.filter((e) => e.type === type[1]);
    if (!events) return;
    return events[dataPointIndex];
  }

  xAxisLabelFormatter(val: string): string {
    const timestampInSeconds = Math.round(Number(val) / 100) / 10;
    const label = `${timestampInSeconds}s`;
    return label;
  }

  initChart() {
    const series: ApexAxisChartSeries = [];
    this.chartOptions = {
      series,
      chart: {
        height: 350,
        type: "scatter",
        animations: {
          enabled: false,
        },
        events: {
          dataPointSelection: (_, __, config) => {
            const event = this.getEventFromChartContext(config.seriesIndex, config.dataPointIndex);
            if (!event) return;
            this.selectService.setTime(event.timestamp);
            this.selectService.selectEvent(event);
          },
        },
        zoom: {
          enabled: true,
        },
        toolbar: {
          show: true,
        },
      },
      yaxis: {
        tickAmount: Object.keys(LogEventType).filter(t=>t!==LogEventType.UNMANAGED).length,
        min: 0,
        max: 7,
        labels: {
          formatter: (val) => {
            return Object.keys(LogEventType)[val];
          },
        },
      },
      legend: { show: false },
      colors: ["#4D72AA", "#9DD6FF"],
      xaxis: {
        tickAmount: 10,
        min: 0,
        max: 1,
        labels: {
          formatter: this.xAxisLabelFormatter
        },
      },
      markers: {
        size: 15,
        shape: "circle",
      },
      fill: {
        type: "image",
        opacity: 1,
        image: {
          src: [
            "./logEventsIcons/unmanaged.png",
            "./logEventsIcons/click.png",
            "./logEventsIcons/viewable.png",
            "./logEventsIcons/impression.png",
            "./logEventsIcons/ad_response.png",
            "./logEventsIcons/ad_request.png",
            "./logEventsIcons/sdk_mad.png",
            "./logEventsIcons/sdk_init.png",
          ],
          width: 30,
          height: 30,
        },
      },
      tooltip: {
        custom: ({ series, seriesIndex, dataPointIndex }) => {
          const event = this.getEventFromChartContext(seriesIndex, dataPointIndex);
          if (!event) return;
          const timestamp = Math.round(Number(event.timestamp) / 100) / 10;
          return (
            '<div class="arrow_box">' +
            "<span>" +
            String(event.type) +
            " - " +
            timestamp +
            "s" +
            "</span>" +
            "</div>"
          );
        },
      },
    };
  }

  updateChart() {
    this.formatData();
    if (this.formattedSeries) {
      const maxTimestamp = this.getMaxTimeStampInMilliseconds();
      this.chart?.updateOptions({ series: this.formattedSeries, xaxis: { min: 0, max: maxTimestamp, tickAmount: 10, labels: { formatter: this.xAxisLabelFormatter } } });
    }
  }
}
