import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UpdatesService {
  constructor(appRef: ApplicationRef, updates: SwUpdate) {
    // Allow the app to stabilize first, before starting polling for updates with `interval()`.
    if(environment.production){
    const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
    let time = 6 * 60 * 60 * 1000;
    time = 1000;
    const everySixHours$ = interval(time);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);
everySixHoursOnceAppIsStable$.subscribe((event) => {console.log("Checking Update",event);updates.checkForUpdate()});
    }
  }
}
