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

import { Injectable, isDevMode } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { LOGS } from "./sample";
import { MessageService } from "primeng/api";

enum Environment {
  IOS = "ios",
  ANDROID = "android",
}

/**
 * Parsed network trace from GMA SDK Network Tracing
 */
interface ParsedNetworkTrace {
  timestamp: number;
  event: NetworkEventType;
  components: string[];
  params: {
    firstline: {
      uri: string,
      verb: string,
    },
    body: string,
    headers: HTTPHeader[]
  };
}

interface HTTPHeader {
  name: string;
  value: string;
}

interface GMAParams {
  iu?: string;
  slotname?: string;
  sz?: string;
  cust_params?: string[];
  format?: string;
  request_url?: URL;
  impressionPingUrl?: URL;
  debugDialog?: string[];
}

enum NetworkEventType {
  request = "onNetworkRequest",
  response = "onNetworkResponse"
}

/**
 * Describes the type of log event (e.g ad request)
 */
export enum LogEventType {
  UNMANAGED = "UNMANAGED",
  CLICK = "click",
  VIEWABLE = "viewable",
  IMPRESSION = "impression",
  AD_RESPONSE = "ad_response",
  AD_REQUEST = "ad_request",
  SDK_MAD = "sdk_mad",
  SDK_INIT = "sdk_init",
}

/**
 * Represents a log event
 */
export interface LogEvent {
  id: number;
  eventId: string;
  type: LogEventType;
  timestamp: number;
  absoluteTime: Date;
  gmaParams: GMAParams;
}
/**
 * Represents a list of log event extracted from a user session
 */
export interface Logs {
  events: LogEvent[];
}

/**
 * Service that receives, parse and process logs from GMA SDK
 */
@Injectable({ providedIn: "root" })
export class LogService {
  private logs: Logs = {
    events: [],
  };

  constructor(private messageService: MessageService) {
    if (isDevMode()) {
      setTimeout(() => {
        this.logsObservable.next({ events: LOGS() });
      }, 500);
    }
  }

  logsObservable = new BehaviorSubject<Logs | undefined>(undefined);

  /**
   * Takes processed GMA SDK logs and compute high level sessions statistics
   * (e.g number of ad requests)
   */
  private getSessionStatistics() {
    const requests = this.logs.events.filter(
      (e) => e.type === LogEventType.AD_REQUEST
    ).length;
    const impressions = this.logs.events.filter(
      (e) => e.type === LogEventType.IMPRESSION
    ).length;
    const viewables = this.logs.events.filter(
      (e) => e.type === LogEventType.VIEWABLE
    ).length;
    return {
      requests,
      impressions,
      viewables,
    };
  }

  /**
   * Takes processed GMA SDK logs and generate a recommendation on the delay
   * between SDK initialisation and the first ad request
   */
  private getDelaySdkInitToFirstAdRequestRecommendation() {
    const sdkInit = this.logs.events.find((pl) => {
      return pl.type === LogEventType.SDK_INIT;
    });
    const firstAdRequest = this.logs.events.find((pl) => {
      return pl.type === LogEventType.AD_REQUEST;
    });
    if (sdkInit === undefined || firstAdRequest === undefined) return;
    const delaySdkInitToFirstAdRequest = Math.round(
      (firstAdRequest.timestamp - sdkInit.timestamp) / 1000
    );
    const title = `${delaySdkInitToFirstAdRequest}s delay between SDK initialisation and first ad request`;
    const recommendation = { title };
    return recommendation;
  }

  /**
   * Run existing recommendations on processed GMA SDK logs and returns an array
   * of recommendations object.
   */
  private getRecommendations() {
    const recommendations = [];
    const delaySdkInitToFirstAdRequestRecommendation =
      this.getDelaySdkInitToFirstAdRequestRecommendation();
    if (delaySdkInitToFirstAdRequestRecommendation) {
      recommendations.push(delaySdkInitToFirstAdRequestRecommendation);
    }
    return recommendations;
  }

  getLogsObsersable() {
    return this.logsObservable.asObservable();
  }

  private getLogTimestamp(gmaLogLine: string, ENVIRONMENT: string) {
    let logTimestamp: string | undefined = undefined;

    const timestampRegex = ENVIRONMENT === Environment.IOS ?
    /\d{2}:\d{2}:\d{2}\.\d{3}/ :
    /\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\.\d{3}/;

    const timestampRegexResult = gmaLogLine.match(timestampRegex);
    if (!timestampRegexResult) return undefined;
    logTimestamp = timestampRegexResult[0];
    let [date, time] = logTimestamp.split(" ").slice(0, 2);
    if (ENVIRONMENT === Environment.IOS) {
      time = logTimestamp;
      date = new Date().getMonth() + "-" + new Date().getDate();
    }
    const currentYear = new Date().getFullYear();
    logTimestamp = `${currentYear}-${date} ${time}`;
    return logTimestamp;
  }

  /**
   * Parses through the Network Trace
   * @param currentNetworkTrace
   * @param logTimestamp
   * @param ENVIRONMENT
   * @param referenceStartTime
   * @return false if UNMANAGED; otherwise true
   */
  private parseNetworkTrace(
    currentNetworkTrace: string,
    logTimestamp: string | undefined,
    id: number,
    ENVIRONMENT: string,
    referenceStartTime?: Date | undefined
  ){
    const decoded =
    ENVIRONMENT === Environment.IOS
      ? this.decodeNetworkTraceFromBase64(currentNetworkTrace)
      : currentNetworkTrace;
  const parsedNetworkTrace = this.parseJson(decoded);
  if (parsedNetworkTrace) {
    const eventId = parsedNetworkTrace.components[0];
    const tiedEvents = this.logs.events.filter(
      (event) => event.eventId === eventId
    );
    const networkEventType = parsedNetworkTrace.event;
    const uri = this.getNetworkRequestUri(parsedNetworkTrace);
    const logType = this.getGmaLogType(networkEventType, tiedEvents, uri);
    const gmaParams = this.getLogSpecificParams(logType, parsedNetworkTrace, uri);
    if (!logTimestamp) throw new Error("Log timestamp is undefined");
    if (referenceStartTime === undefined) { // For when no video is uploaded
      referenceStartTime = new Date(logTimestamp);
    }
    if (logType !== LogEventType.UNMANAGED) {
      this.logs.events.push({
        id,
        eventId,
        type: logType,
        timestamp:
            new Date(logTimestamp).getTime() -
            referenceStartTime.getTime(),
        absoluteTime: new Date(logTimestamp),
        gmaParams,
      });
      return true;
    }
  }
  return false;
}

  /**
   * Process and parse raw GMA SDK network traces. All events timestamp are
   * converted to a relative timestamp starting at the referenceStartTime.
   */
  processLogs(rawLogs: string, referenceStartTime?: Date) {
    this.messageService.add({
      id: "LogService.processLogs",
      severity: "secondary",
      summary: "Processing logs...",
    });
    this.logs.events = [];
    let id = 1;
    const lines = rawLogs.split("\n");
    let currentNetworkTrace = "";
    let logTimestamp: string | undefined = undefined;
    for (const gmaLogLine of lines) {
      const ENVIRONMENT = gmaLogLine.match(/^default/) == null ? Environment.ANDROID : Environment.IOS;
      const gmaLogStatus = /GMA Debug ([^(\s|:)]+)/.exec(gmaLogLine)?.[1];
      switch (gmaLogStatus) {
        case "BEGIN":
          currentNetworkTrace = "";
          logTimestamp = this.getLogTimestamp(gmaLogLine, ENVIRONMENT);
          break;
        case "CONTENT":
          const gmaLogContent = /GMA Debug ([^\s]+) (.+)/.exec(gmaLogLine);
          if (!gmaLogContent) throw new Error();
          currentNetworkTrace += gmaLogContent[2];
          break;
        case "FINISH":
          if (this.parseNetworkTrace(currentNetworkTrace, logTimestamp, id, ENVIRONMENT, referenceStartTime)) {
            id++;
          }
          currentNetworkTrace = "";
          break;
        default:
          break;
      }
    }
    this.logsObservable.next(this.logs);
    this.messageService.clear();
  }

  /**
   * Based on a stringify JSON key/value structure, returns the RegExp to
   * extract the value for a specific key.
   */
  private decodeBase64InQuotes(word: string): RegExp {
    return new RegExp(`(?<="${word}":")(?<=")[^"]+`, "gm");
  }

  /**
   * Base64 decodes a raw GMA SDK network trace.
   */
  private decodeNetworkTraceFromBase64(logLine: string): string {
    const decodedLogLine = logLine
      .replace(this.decodeBase64InQuotes("uri"), (m) => atob(m))
      .replace(this.decodeBase64InQuotes("verb"), (m) => atob(m))
      .replace(this.decodeBase64InQuotes("name"), (m) => atob(m))
      .replace(this.decodeBase64InQuotes("value"), (m) => atob(m));
    return decodedLogLine;
  }

  /**
   * Converts a JSON string into an object or returns false if it fails
   */
  private parseJson(logLine: string) {
    try {
      const json = JSON.parse(logLine);
      return json;
    } catch (err) {
      return false;
    }
  }

  /**
   * Takes a GMA SDK Network Request trace and return the URI called by the SDK
   */
  private getNetworkRequestUri(parsedNetworkTrace: ParsedNetworkTrace): URL | undefined {
    if (parsedNetworkTrace.event !== NetworkEventType.request) {
      return undefined;
    }

    const rawUrl = parsedNetworkTrace.params.firstline.uri;
    const uri = new URL(rawUrl);
    return uri;
  }

  /**
   * Takes a parsed network trace or URL and return query parameters.
   * When URL is too long, GMA SDK will POST the ad request with query parameters embedded in the body
   * @param {ParsedNetworkTrace} parsedNetworkTrace
   * @param {URL} uri
   * @return {Object}
   */
  private getRequestSearchParams(parsedNetworkTrace: ParsedNetworkTrace, uri: URL): URLSearchParams {
    if (uri.searchParams.size > 0) {
      return uri.searchParams;
    }
    if (parsedNetworkTrace.params.body !== "") {
      const decodedBody = atob(parsedNetworkTrace.params.body);
      return new URLSearchParams(decodedBody);
    }
    return new URLSearchParams();
  }

  /**
   * Takes a GMA SDK event and parse specific query parameters based on the
   * eventType (e.g ad unit for an ad request)
   * @param {LogEventType} gmaLogType
   * @param {ParsedNetworkTrace} parsedNetworkTrace
   * @param {URL} uri
   * @return {Object}
   */
  private getLogSpecificParams(gmaLogType: LogEventType, parsedNetworkTrace: ParsedNetworkTrace, uri: URL | undefined): GMAParams {
    let params: GMAParams = {};
    switch (gmaLogType) {
      case LogEventType.AD_REQUEST:
        if (!uri) break;
        const searchParams = this.getRequestSearchParams(parsedNetworkTrace, uri);
        params = {
          request_url: uri,
          iu: searchParams.get("iu") || undefined,
          sz: searchParams.get("sz") || undefined,
          format: searchParams.get("format") || undefined,
          slotname: searchParams.get("slotname") || undefined,
          cust_params: searchParams.get("cust_params")?.split("&"),
        };
        break;
      case LogEventType.AD_RESPONSE:
        const headers = parsedNetworkTrace.params.headers;
        const impressionPingBackUrlHeader = headers.find((element: HTTPHeader) => {
          return element.name === "X-Afma-Tracking-Urls";
        });
        if (impressionPingBackUrlHeader) {
          const impressionPingUri = new URL(impressionPingBackUrlHeader.value);
          params.impressionPingUrl = impressionPingUri;
        }
        const debugDialogHeader = headers.find((element: HTTPHeader) => {
          return element.name === "X-Afma-Debug-Dialog";
        });
        params.debugDialog = debugDialogHeader
          ? debugDialogHeader.value.split("&")
          : [];
        break;
      default:
        break;
    }
    return params;
  }

  /**
   * Takes a GMA SDK event and its tied events and return its type
   * @param {string} eventType
   * @param {Array<LogEvent>} tiedEvents
   * @param {URL | undefined} uri
   * @return {String}
   */
  private getGmaLogType(eventType: string, tiedEvents: LogEvent[], uri: URL | undefined): LogEventType {
    switch (eventType) {
      case "onNetworkRequest":
        if (!uri) return LogEventType.UNMANAGED;
        return this.getNetworkRequestType(uri);
      case "onNetworkResponse":
        return this.getNetworkResponseType(tiedEvents);
      default:
        return LogEventType.UNMANAGED;
    }
  }

  /**
   * Returns a GMA SDK response event type based on its tied events. For
   * example, if a response event is tied to an AD_REQUEST, then it is an
   * AD_RESPONSE.
   * @param {Array<LogEvent>} tiedEvents
   * @return {String}
   */
  private getNetworkResponseType(tiedEvents: LogEvent[]): LogEventType {
    if (tiedEvents.length !== 1) return LogEventType.UNMANAGED;
    return tiedEvents[0].type === LogEventType.AD_REQUEST
      ? LogEventType.AD_RESPONSE
      : LogEventType.UNMANAGED;
  }

  /**
   * Takes the URI of a network request and returns its type.
   * @param {URL} uri
   * @return {LogEventType}
   */
  private getNetworkRequestType(uri: URL): LogEventType {
    const startsWith = (prefix: string) => {
      return uri.pathname.startsWith(prefix);
    };

    switch (true) {
      case startsWith("/mads/static/mad/sdk"):
        return LogEventType.SDK_MAD;
      case startsWith("/getconfig/pubsetting"):
        return LogEventType.SDK_INIT;
      case startsWith("/gampad/ads"):
        return LogEventType.AD_REQUEST;
      case startsWith("/mads/gma"):
        return LogEventType.AD_REQUEST;
      case startsWith("/pcs/view"):
        return LogEventType.IMPRESSION;
      case startsWith("/pagead/adview"):
        return LogEventType.IMPRESSION;
      case startsWith("/pcs/activeview"):
        return LogEventType.VIEWABLE;
      default:
        return LogEventType.UNMANAGED;
    }
  }
}
