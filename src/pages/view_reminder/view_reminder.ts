import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AddMedicinePage } from '../add_medicine/add_medicine';

@Component({
  selector: 'page-view-reminder',
  templateUrl: 'view_reminder.html'
})
export class ViewReminderPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  editReminder(){
    this.navCtrl.push(AddMedicinePage);
  }
}
