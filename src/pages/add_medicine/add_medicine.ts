import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SchedulePage } from '../schedule/schedule';
@Component({
  selector: 'page-add-medicine',
  templateUrl: 'add_medicine.html'
})
export class AddMedicinePage {

  public medData:any = {name:'', dosage:'', unit:'', shape:'', color:''};
  public units:any;
  public shapes:any;
  public colors:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.units = [{name:'Pills'}, {name:'cc'}, {name:'ml'}, {name:'gr'}, {name:'mg'}, {name:'Drops'},{name:'Pieces'},{name:'Puffs'},{name:'Units'},{name:'teaspoon'},
        {name:'tablespoon'},{name:'patch'},{name:'mcg'},{name:'iu'},{name:'meq'},{name:'Carton'},{name:'Spray'}];
    this.shapes = [{name:'Circle'}, {name:'Square'}, {name:'Oval'}];
    this.colors = [{name:'Red'}, {name:'Pink'}, {name:'Blue'}, {name:'Purple'}, {name:'Gray'}];
  }

  gotoSchedule(){
    this.navCtrl.push(SchedulePage);
  }
}
