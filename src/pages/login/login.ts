import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { MainPage } from '../main/main';
import { ForgotPage } from '../forgot/forgot';
import { UserService } from "../../providers/user-service";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public user: any = {email:'dev1plus@fliptechdev.com', password: 'Fl1pT3chD3v'};

  constructor(
    public navCtrl: NavController,
    public userService: UserService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public storage: Storage
  ) {
  }

  presentAlert(title, subTitle) {
    let alert = this.alertCtrl.create({
     title: title, subTitle: subTitle, buttons: ['OK'] });
     alert.present();
   }
   ValidationEmail (email)
   {
     var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     return re.test(email);
   }
   showConfirm(title, subtilte) {
    let confirm = this.alertCtrl.create({
      title: title,
      message: subtilte,
      buttons: [
        {
          text: 'Forgot?',
          handler: () => {
            console.log('Disagree clicked');
            this.navCtrl.push(ForgotPage);
          }
        },
        {
          text: 'Try Again',
          handler: () => {
            console.log('Try Again');
          }
        }
      ]
    });
    confirm.present();
  }

  gotoForgotPage(){
    console.log("go ForgotPage");
    this.navCtrl.push(ForgotPage);
  }

  doLogin(){
    let loading = this.loadingCtrl.create();
    var val_email = this.ValidationEmail(this.user.email);
    var title =  "Error";
    var title1 = "Email Validation Failed"
    var subtitle0 = "Email is invalid";
    var subtitle1:string = "Please fill out all information and then contune";
    var subtitle2:string = "Incorrect Username or Password"

    if(this.user.email == '' || this.user.password == '' || !this.user.email || !this.user.password)
    {
      this.presentAlert( title, subtitle1);
    }else if(val_email == false)
    {
      this.presentAlert( title1, subtitle0);
    }else
    {
      loading.present();
      this.userService.login(this.user.email, this.user.password)
        .subscribe(
          (data) => {
            loading.dismiss();
            if(data.success == false){
              console.log(data);
              this.showConfirm(title, subtitle2)
           }else{
             console.log("login result", data);
             this.storage.set('data', data);
             this.storage.set('email', data.user.email);
             this.storage.set('auth_token', data.user.authentication_token);
             this.navCtrl.setRoot(MainPage);
           }
          },
          (data) => {
            loading.dismiss();
            console.log("Login error");

            this.showConfirm( title, subtitle2);
          });
      }
    }

  backHome(){
    console.log("backHome");
    this.navCtrl.pop();
  }
}
