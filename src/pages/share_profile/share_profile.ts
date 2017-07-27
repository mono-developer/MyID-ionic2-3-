import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserService } from "../../providers/user-service";
import { BaseService } from "../../providers/base-service";
import * as moment from 'moment';
import * as momentTz from 'moment-timezone';

import { TranslateService } from '@ngx-translate/core';
import { defaultLanguage, availableLanguages, sysOptions } from '../../app/app.constants';
@Component({
  selector: 'page-share-profile',
  templateUrl: 'share_profile.html'
})
export class ShareProfilePage {

  public shareInfo:any = {email:'', message:'', password:'', expired_date:''};
  public email: any;
  public auth_token: any;
  public profile_id: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public storage: Storage,
      public userService: UserService, public alertCtrl:AlertController, public translate: TranslateService) {
      this.profile_id = navParams.get('profile_id');
      this.translate.use(sysOptions.systemLanguage);
  }

  ngOnInit(){

  }

  send(){

    let d = new Date(this.shareInfo.expired_date);
    let dd = d.getTime();

    let loading = this.loadingCtrl.create();
    loading.present();

    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;

        let body = {
          profile_id: this.profile_id.toString(),
          identity:{
            share_profile:"true"
          },
          share:{
            expired_at:dd.toString(),
            in_timezone:"America/New_York",
            message: this.shareInfo.message,
            password: this.shareInfo.password,
            shared_email: [this.shareInfo.email]
          }
        };

        console.log(JSON.stringify(body));

        this.userService.ShareProfile(this.email, this.auth_token, body)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log(data);
              if(data.success == false){
                if (data.message == "Expiration date must be greater than today's date"){
                  let alert = this.alertCtrl.create({
                   title: "Warning", subTitle: data.message, buttons: ['OK'] });
                   alert.present();
                }
             }else{
               this.navCtrl.pop();
               console.log("Success:" + JSON.stringify(data));
             }
            },
            (data) => {
              loading.dismiss();
              console.log("get Profiles:" + JSON.stringify(data));
            });
        });
      });
  }
}
