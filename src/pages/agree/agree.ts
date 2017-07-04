import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MainPage } from '../main/main';
import { UserService } from "../../providers/user-service";

@Component({
  selector: 'page-agree',
  templateUrl: 'agree.html'
})
export class AgreePage {

  public email;
  public password;
  public pw_confirm;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public storage: Storage
  ) {
    this.email = navParams.get("email");
    this.password = navParams.get("password");
    this.pw_confirm = navParams.get("pw_confirm");
  }

  
  goMainPage(){
    console.log("go MainPage");
    let loading = this.loadingCtrl.create();
    loading.present();
    this.userService.signup(this.email, this.password, this.pw_confirm )
      .subscribe(
        (data) => {
          loading.dismiss();
          console.log("Signup Data:", data);

          if(data.success == false && data.error_code == "0102" ){
            let alert = this.alertCtrl.create({
              title: "Error", subTitle: "Email has already been taken", buttons: ['OK']
            });
            alert.present();
          }else if(data.success == false){
            let alert = this.alertCtrl.create({
              title: "Error", subTitle: "Signup Error", buttons: ['OK']
            });
            alert.present();
            this.navCtrl.pop();
          } else{
            this.storage.set('data', data);
            this.storage.set('email', data.user.email);
            this.storage.set('auth_token', data.use.authentication_token);
            this.navCtrl.setRoot(MainPage);
          }
        },
        (data) => {
          loading.dismiss();
          console.log("SignupError");
          let alert = this.alertCtrl.create({
            title: "Error", subTitle: "Signup Error", buttons: ['OK']
          });
          alert.present();
          this.navCtrl.pop();
        });
  }

  backHome(){
    console.log("back SignupPage");
    this.navCtrl.pop();
  }

}
