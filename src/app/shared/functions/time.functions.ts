import { Injectable } from "@angular/core";

@Injectable()
export class TimeFunctions {
  formatTime(time: number) {
    let days: any = Math.floor(time / 86400);
    let remainder = time - days * 86400;
    let hours: any = Math.floor(remainder / 3600);
    remainder = remainder - hours * 3600;
    let minutes: any = Math.floor(remainder / 60);
    remainder = remainder - minutes * 60;
    let seconds: any = Math.floor(remainder);

    // console.log(time);

    let visualDays = days > 0 ? `${days}d` : null;
    let visualHours = hours > 0 ? `${hours}h` : null;
    let visualMinutes = minutes > 0 ? `${minutes}m` : null;
    let visualSeconds = minutes == 0 && hours == 0 ? `< 1m` : null;

    return [visualDays, visualHours, visualMinutes, visualSeconds].filter(Boolean).join(" ");
  }
}
