import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { PasscodeSettingPage } from '../passcode-setting/passcode-setting';
import { Flags } from "../../providers/flag";

import { TranslateService } from '@ngx-translate/core';
import { defaultLanguage, availableLanguages, sysOptions } from '../../app/app.constants';
@Component({
  selector: 'page-passcode',
  templateUrl: 'passcode.html'
})
export class PasscodePage {

  public passValue:string;
  public isDisable:boolean = false;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public storage: Storage,
    public userService: UserService,
    public loadingCtrl: LoadingController,

    public translate: TranslateService
  ) {
    this.translate.use(sysOptions.systemLanguage);

    // private flagService: Flags,

    console.log("ionViewDidEnter")
    this.storage.get('passcode').then(val=>{
      this.passValue = val;
      console.log(this.passValue);
      if(!this.passValue){
        this.isDisable = true;
      }else{
        this.isDisable = false;
      }
    });

  }

  setPasscode(val){
    let profileModal = this.modalCtrl.create(PasscodeSettingPage,{
      val: val
    });
    profileModal.onDidDismiss(data=>{
      this.storage.get('passcode').then(val=>{
        this.passValue = val;
        console.log(this.passValue);
        if(!this.passValue){
          this.isDisable = true;
        }else{
          this.isDisable = false;
        }
      });
    });
    profileModal.present();
  }
}
