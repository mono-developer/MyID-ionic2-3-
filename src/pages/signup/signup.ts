import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { AgreePage } from '../agree/agree';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

public user: any = {email:'', password: '', pw_confirm:''};

  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController
  ) {}

  ValidationEmail (email)
  {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  gotoAgree(){
    var val_email = this.ValidationEmail(this.user.email);
    if(this.user.email == '' || !this.user.email)
    {
      let alert = this.alertCtrl.create({
       title: "Alert", subTitle: "Please enter Email", buttons: ['OK'] });
       alert.present();
    }else if(val_email == false){
      let alert = this.alertCtrl.create({
       title: "Email Validation Failed", subTitle: "Email is invalid", buttons: ['OK'] });
       alert.present();
    }else if( this.user.password == '' || !this.user.password || this.user.pw_confirm == '' || !this.user.pw_confirm)
    {
      let alert = this.alertCtrl.create({
       title: "Alert", subTitle: "Please enter Password", buttons: ['OK'] });
       alert.present();
    } else if(this.user.password != this.user.pw_confirm)
    {
      let alert = this.alertCtrl.create({
       title: "Alert", subTitle: "Password doesn't match confirmation", buttons: ['OK'] });
       alert.present();
    } else if(this.user.password.length < 6)
    {
      let alert = this.alertCtrl.create({
       title: "Alert", subTitle: "Password is to short (minimum of 6 characters)", buttons: ['OK'] });
       alert.present();
    } else{
      console.log("go AgreePage;")
      this.navCtrl.push(AgreePage ,{
        email: this.user.email,
        password: this.user.password,
        pw_confirm: this.user.pw_confirm
      });
    }
  }
  backHome(){
    console.log("backHome");
      this.navCtrl.pop();
  }
}
