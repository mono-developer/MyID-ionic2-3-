import { Component } from '@angular/core';
import { NavController,  AlertController, LoadingController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";
import { HomePage } from '../home/home';

@Component({
  selector: 'page-upgrade-account',
  templateUrl: 'upgrade_account.html'
})
export class UpgradeAccountPage {

  email:string;
  new_email:string;
  auth_token:string;
  current_pass:string;
  new_pass:string;
  confirm_pass:string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public userService: UserService,
    public storage: Storage,
    private flagService: Flags
  ) {

    this.storage.get('email').then(val=>{
      this.new_email = val;
      this.email = val;
    });
    this.auth_token = "";
    this.current_pass = '';
    this.new_pass = '';
    this.confirm_pass = '';
  }

  updateAccount(){
    let loading = this.loadingCtrl.create();
    loading.present();
    var body;
    if(this.new_email == this.email){
       body = {"current_password":this.current_pass, "user":{"password":this.new_pass, "password_confirmation":this.confirm_pass}};
    }else{
       body = {"current_password":this.current_pass, "user":{"email": this.new_email}};
    }
    console.log(body);
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.updateInfo(this.email, this.auth_token, body)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log("Profile Data: ", data);
              if(data.success == false && data.error_code == "0102" ){
                let alert = this.alertCtrl.create({
                  title: "Error", subTitle: "Email has already been taken", buttons: ['OK']
                });
                alert.present();
              }else if(data.success == false){
                let alert = this.alertCtrl.create({
                  title: "Error", subTitle: "Updated Error ", buttons: ['OK']
                });
                alert.present();
              }else{
                // this.flagService.setChangedFlag(true);
                let alert = this.alertCtrl.create({
                  title: "Updated", subTitle: "Update Success", buttons: ['OK']
                });
                alert.present();

                this.navCtrl.pop();
                console.log(data);
              }
            });
      });
  };

  deleteAccount(){
    this.confirmAlert();
  }

  confirmAlert(){
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      subTitle: 'This is will permanently delete all profile s and data related to this account.',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            console.log('Buy clicked');
            this.deleteProfile();
            }
          }
        ]
      });
      alert.present();
    }

  deleteProfile(){
    let loading = this.loadingCtrl.create();
    loading.present();
    this.storage.get('auth_token').then(val=>{
      this.auth_token = val;
      this.userService.cancelAccount(this.email, this.auth_token)
        .subscribe(
          (data) => {
            loading.dismiss();
            console.log("Delete Account: ", data);
            if(data.success == false){
              let alert = this.alertCtrl.create({
                title: "Error", subTitle: "Delect Error", buttons: ['OK']
              });
              alert.present();
            }else{
              console.log(data);
              let alert = this.alertCtrl.create({
                title: "Updated", subTitle: "Update Success", buttons: ['OK']
              });
              alert.present();
              this.logout();
            }
          });
      });
  };

  logout(){
    this.storage.set('data', null);
    this.storage.set('email', "");
    this.storage.set('auth_token', "");
    this.navCtrl.setRoot(HomePage);
  }

}
