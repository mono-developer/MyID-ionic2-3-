import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PillReminderPage } from '../pill_reminder/pill_reminder';
@Component({
  selector: 'page-refill-reminder',
  templateUrl: 'refill_reminder.html'
})
export class RefillReminderPage {

  refillData:any = {left:'', reminder:true}
  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  save(){
    this.navCtrl.setRoot(PillReminderPage);
  }
}
