import { Component } from '@angular/core';
import { NavController, NavParams, Nav, LoadingController, Tabs } from 'ionic-angular';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-success-link',
  templateUrl: 'success_link.html'
})
export class SuccessLinkPage {

  public link:any;
  public profile_id:any;
  public email:any;
  public auth_token:any;
  tab:Tabs;

  constructor(public navCtrl: NavController, public navParams: NavParams, public nav: Nav, public loadingCtrl: LoadingController, public userService: UserService,
      public storage: Storage, public flagService:Flags) {
    this.tab = this.navCtrl.parent;
    this.link = this.navParams.get('link');
    this.profile_id = this.navParams.get('profile_id');
    console.log(JSON.stringify(this.link));
  }

  ngOnInit(){
    this.storage.get('email').then(val=>{
      this.email = val;
    });

    this.storage.get('auth_token').then(val=>{
      this.auth_token = val;
    });
  }

  goBack(){
    console.log("goBack");
    this.nav.popToRoot()
  }

  updateLabel(){
    let loading = this.loadingCtrl.create();
    loading.present();

    this.userService.updateIdBands(this.email, this.auth_token, this.profile_id, this.link.name, this.link.id)
      .subscribe(
        (data) => {
          loading.dismiss();
          if(data.success == false){
              this.navCtrl.pop();
           }else{
             console.log("Link To Profile:" + JSON.stringify(data));
             this.tab.select(0);
           }

        },
        (data) => {
          console.log("Link To Profile:" + JSON.stringify(data));
          loading.dismiss();
          this.tab.select(0);
        });
  }
}
