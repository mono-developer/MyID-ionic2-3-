import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { PasscodePage } from '../passcode/passcode'
import { UpgradeAccountPage } from '../upgrade_account/upgrade_account';
import { BillingPage } from '../billing/billing';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  email:string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage
  ){
    this.storage.get('email').then(val=>{
      this.email = val;
    });

  }
  goPasscodePage(){
    console.log("Upgrade Account Page")
    this.navCtrl.push( PasscodePage,{});
  }
  goUpgradeAccountPage(){
    console.log("Upgrade Account Page")
    this.navCtrl.push( UpgradeAccountPage,{});
  }
  goBillingPage(){
    console.log("Billing Page")
    this.navCtrl.push( BillingPage,{});
  }
  logOut(){
    this.storage.set('data', null);
    this.storage.set('email', "");
    this.storage.set('auth_token', "");
    this.navCtrl.setRoot(HomePage);
  }
}
