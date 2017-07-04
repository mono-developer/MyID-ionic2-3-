import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-edit-linked-myid-add',
  templateUrl: 'edit_linked_myid_add.html'
})
export class EditLinkedMyIDAddPage {

  public link:any;
  public profile_id:any;
  public email:any;
  public auth_token:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public userService: UserService,
      public storage: Storage, public flagService:Flags, public alertCtrl:AlertController) {
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

  save(){
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
             this.flagService.setChangedFlag(true);
             this.navCtrl.pop();
           }

        },
        (data) => {
          console.log("Link To Profile:" + JSON.stringify(data));
          loading.dismiss();
          this.navCtrl.pop();
        });
  }

  linkDataDelete(){
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      subTitle: 'Do you really want to delete this item?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            console.log('Buy clicked');
            this.linkDataDelete1();
            }
          }
        ]
      });
      alert.present();
  }
  linkDataDelete1(){
    let loading = this.loadingCtrl.create();
    loading.present();

    this.userService.deleteIdBands(this.email, this.auth_token, this.profile_id, this.link.id)
      .subscribe(
        (data) => {
          loading.dismiss();
          if(data.success == false){
              this.navCtrl.pop();
           }else{
             console.log("Link To Profile:" + JSON.stringify(data));
             this.flagService.setChangedFlag(true);
             this.navCtrl.pop();
           }

        },
        (data) => {
          console.log("Link To Profile:" + JSON.stringify(data));
          loading.dismiss();
          this.navCtrl.pop();
        });
  }
}
