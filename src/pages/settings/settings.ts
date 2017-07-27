import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { PasscodePage } from '../passcode/passcode'
import { UpgradeAccountPage } from '../upgrade_account/upgrade_account';
import { BillingPage } from '../billing/billing';
import { PasscodeSettingPage } from '../passcode-setting/passcode-setting';
import { Storage } from '@ionic/storage';

import { TranslateService } from '@ngx-translate/core';
import { defaultLanguage, availableLanguages, sysOptions } from '../../app/app.constants';
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  email:string;
  passValue:string;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public storage: Storage,
    public translate: TranslateService
  ){
    this.storage.get('email').then(val=>{
      this.email = val;
    });

    this.translate.use(sysOptions.systemLanguage);

    this.storage.get('passcode').then(val=>{
      this.passValue = val;
    });
  }

  ionViewDidEnter(){
    console.log("ViewDidEnter")
    this.storage.get('passcode').then(val=>{
      this.passValue = val;
    });

  }

  goPasscodePage(){

    this.storage.get('passcode').then(val=>{
      console.log("ResumeSubscription");
      let profileModal = this.modalCtrl.create(PasscodeSettingPage, {
        val: 'background'
      });
      this.storage.get('passcode').then(val=>{
        if(val == null){
          console.log("go Passcode");
          this.navCtrl.push(PasscodePage);
        } else {
          console.log("run passcode page")
          profileModal.present();
          this.navCtrl.push(PasscodePage);
        }
      });
    })
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
