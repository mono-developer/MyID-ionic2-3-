import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";

@Component({
  selector: 'page-billing',
  templateUrl: 'billing.html'
})
export class BillingPage {

  profiles: any;
  email: string;
  auth_token: string;
  premium_type: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public userService: UserService,
    public loadingCtrl: LoadingController
  ) {
    this.profiles = '';
    this.premium_type = false;
    this.email = "";
    this.auth_token = "";
  }

  ngOnInit(){
    this.getDate();
  }

  getDate(){
    let loading = this.loadingCtrl.create();
    loading.present();

    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.getProfiles(this.email, this.auth_token)
          .subscribe(
            (data) => {
              loading.dismiss();
              if(data.success == false){
             }else{
               console.log("get Profiles:" + JSON.stringify(data));
               this.profiles = data.profiles;
              //  this.premium_type = data.profiles.subscription_type;
              //  if(data.profiles.subscription_type == "Premium"){
              //    this.premium_type = true;
              //  }else{
              //    this.premium_type = false;
              //  }
             }
            },
            (data) => {
              loading.dismiss();
            });
      });
    });
  }

}
