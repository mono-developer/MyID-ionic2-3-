import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {IonicStorageModule} from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { EditPhysiciansAddPage } from '../edit_physicians_add/edit_physicians_add';
import { Flags } from "../../providers/flag";

@Component({
  selector: 'page-edit-physicians',
  templateUrl: 'edit_physicians.html'
})
export class EditPhysiciansPage {

  physicianDatas: any;
  updated:string;
  email:string;
  auth_token:string;
  public profile_id;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public userService: UserService,
    public storage: Storage,
    private flagService: Flags
  ) {

      this.profile_id = navParams.get("profile_id");
      this.email = "";
      this.auth_token = "";
  }

  ngOnInit(){
    this.flagService.setChangedFlag(false);
    this.gettingdata();
  }

  ionViewDidEnter(){
    if(this.flagService.getChangedFlag()){
      this.gettingdata();
    }
  }
  gettingdata(){

    let loading = this.loadingCtrl.create();
    var endValue = "/physicians"
    loading.present();
    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.dataGet(this.email, this.auth_token, this.profile_id, endValue)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log("Physician Data: ", data);
              if(data.success == false){
                let alert = this.alertCtrl.create({
                  title: "Error", subTitle: "Get Data Error", buttons: ['OK']
                });
                alert.present();
                this.navCtrl.pop();
              } else{
                this.physicianDatas = data.physicians;
                console.log(data);
                this.updated = data.last_updated_at;
              }
          });
      });
    });
  }

  gotoEditPhysiciansAddPage(event, physicianData){
    console.log("EditPhysiciansAddPage");
      if (physicianData === undefined){
        this.navCtrl.push(EditPhysiciansAddPage,{
          physicianData: null,
          profile_id: this.profile_id
        });
      }else{
        this.navCtrl.push(EditPhysiciansAddPage,{
        physicianData:physicianData,
        profile_id: this.profile_id
      });
    }
  }

}
