import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { Storage } from '@ionic/storage';
import { MainPage } from '../main/main';
import { PasscodeSettingPage } from '../passcode-setting/passcode-setting';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public storage: Storage
  )
  {

  }

  ionViewWillEnter(){


      console.log("ResumeSubscription");
      let profileModal = this.modalCtrl.create(PasscodeSettingPage, {
        val: 'background'
      });
      this.storage.get('passcode').then(val=>{
        if(val == null){
          console.log("go on");
        } else {
          console.log("run passcode page")
          profileModal.present();
        }
      });
  
    this.storage.get('data').then(val=>{
      console.log(val);
      if (val != null && val.success== true){
        console.log("main page");
        this.navCtrl.setRoot(MainPage);
      }
    });
  }

  gotoLoginPage(){
    console.log("go LoginPage");
    this.navCtrl.push(LoginPage);

  }
  gotoSignupPage(){
    console.log("go SignupPage");
    this.navCtrl.push(SignupPage);
  }
}
