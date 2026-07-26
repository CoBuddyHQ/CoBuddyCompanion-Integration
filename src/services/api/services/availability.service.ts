/**
 * CoBuddy Companion — Availability API Service
 * Wraps all /companion/availability/* endpoints.
 */

import { apiGet, apiPost, apiPut, apiDelete } from '../client';
import { Endpoints, buildPath } from '../endpoints';
export interface AvailabilitySchedule {
  isAvailable: boolean;
  vacationMode: { enabled: boolean; awayFrom: string; returnOn: string };
  defaultHours: any[];
  dateOverrides: any[];
  slots: any[];
}
export interface SetLiveDto {
  isAvailable: boolean;
}

export interface SetVacationDto {
  enabled: boolean;
  awayFrom?: string;
  returnOn?: string;
}

export interface DayTimesDto {
  startTime: string;
  endTime: string;
}

export interface OverrideDto {
  date: string;
  isBlocked: boolean;
  note?: string;
}

export const AvailabilityService = {
  getAvailability: (): Promise<AvailabilitySchedule> =>
    apiGet<AvailabilitySchedule>(Endpoints.AVAILABILITY.GET),

  setLive: (isAvailable: boolean): Promise<AvailabilitySchedule> =>
    apiPut<AvailabilitySchedule>(Endpoints.AVAILABILITY.SET_LIVE, { isAvailable }),

  setVacation: (dto: SetVacationDto): Promise<AvailabilitySchedule> =>
    apiPut<AvailabilitySchedule>(Endpoints.AVAILABILITY.VACATION, dto),

  toggleDay: (day: string): Promise<AvailabilitySchedule> =>
    apiPut<AvailabilitySchedule>(buildPath(Endpoints.AVAILABILITY.WEEKLY_DAY_TOGGLE, { day }), {}),

  setDayTimes: (day: string, dto: DayTimesDto): Promise<AvailabilitySchedule> =>
    apiPut<AvailabilitySchedule>(buildPath(Endpoints.AVAILABILITY.WEEKLY_DAY_TIMES, { day }), dto),

  addOverride: (dto: OverrideDto): Promise<AvailabilitySchedule> =>
    apiPost<AvailabilitySchedule>(Endpoints.AVAILABILITY.OVERRIDE_ADD, dto),

  removeOverride: (id: string): Promise<AvailabilitySchedule> =>
    apiDelete<AvailabilitySchedule>(buildPath(Endpoints.AVAILABILITY.OVERRIDE_DELETE, { id })),

  addSlot: (dto: { startTime: string; endTime: string; days?: string[] }): Promise<AvailabilitySchedule> =>
    apiPost<AvailabilitySchedule>(Endpoints.AVAILABILITY.SLOT_ADD, dto),

  updateSlot: (id: string, dto: { startTime?: string; endTime?: string }): Promise<AvailabilitySchedule> =>
    apiPut<AvailabilitySchedule>(buildPath(Endpoints.AVAILABILITY.SLOT_UPDATE, { id }), dto),

  removeSlot: (id: string): Promise<AvailabilitySchedule> =>
    apiDelete<AvailabilitySchedule>(buildPath(Endpoints.AVAILABILITY.SLOT_DELETE, { id })),
};
