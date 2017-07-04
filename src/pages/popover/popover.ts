import { Component } from '@angular/core';
import { ViewController, AlertController, LoadingController, NavParams} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserService } from "../../providers/user-service";

@Component({
  selector: 'page-popover',
   templateUrl: 'popover.html'
})
export class PopoverContentPage {

  public folder_name:any;
  public email:any;
  public auth_token:any;
  public profile_id:any;
  public parent_id:any;

  static get parameters() {
    return [[ViewController],[AlertController],[LoadingController],[Storage], [UserService], [NavParams]];
  }

  constructor(public viewCtrl: ViewController, public alertCtrl:AlertController, public loadingCtrl:LoadingController, public storage:Storage,
    public userService:UserService, public params:NavParams){
      this.profile_id = this.params.get('profile_id');
      this.parent_id = this.params.get('parent_id');
  }


  close() {
    this.viewCtrl.dismiss();
  }

  createFolderName(){
    let prompt = this.alertCtrl.create({
      title: 'Create Folder',
      message: "",
      inputs: [
        {
          name: 'folder_name',
          placeholder: 'Enter the new folder name.'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            console.log('Saved clicked');
            this.folder_name = data.folder_name;
            this.createFolder();
          }
        }
      ]
    });
    prompt.present();
  }

  createFolder(){
      console.log('parent_id:' + this.parent_id + " name:" + this.folder_name);

      let loading = this.loadingCtrl.create();
      loading.present();

      this.storage.get('email').then(val=>{
        this.email = val;
        this.storage.get('auth_token').then(val=>{
          this.auth_token = val;
          this.userService.createFolder(this.email, this.auth_token, this.profile_id, this.folder_name, this.parent_id)
            .subscribe(
              (data) => {
                loading.dismiss();
                this.viewCtrl.dismiss();
                if(data.success == false){
                  console.log("get Documents:" + JSON.stringify(data));
               }else{
                 console.log("get Documents:" + JSON.stringify(data));
               }
              },
              (data) => {
                loading.dismiss();
                this.viewCtrl.dismiss();
              });
        });
      });

  }

  uploadFile(){
    
  }
}
