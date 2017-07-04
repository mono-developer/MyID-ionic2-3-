import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { Storage } from '@ionic/storage';
import { MainPage } from '../main/main';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public storage: Storage
  )
  {

  }

  ionViewWillEnter(){
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
