import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RefillReminderPage } from '../refill_reminder/refill_reminder';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html'
})
export class SchedulePage {

  scheduleData: any = {frequency:'', times:'', start_time:'', start_date:'', end_date:''};
  frequencies : any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
      this.frequencies = [{name:'As Needed', value:0}, {name:'Everyday', value:1}, {name:'Specific Days', value:2}, {name:'Days Interval', value:3}, {name:'Birth Control Cycle', value:4}];
  }

  gotoRefillReminder(){
    this.navCtrl.push(RefillReminderPage);
  }
}
