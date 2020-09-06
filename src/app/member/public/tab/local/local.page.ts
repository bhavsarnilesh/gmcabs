import { Component, OnInit, NgZone, ViewChild, ElementRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from "@angular/forms";
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalenquiryService } from 'src/app/services/localenquiry.service';
import { EnquiryModel } from 'src/app/models/enquiry.model';
import { City } from 'src/app/models/city.model';
import { IonSearchbar } from '@ionic/angular';



@Component({
  selector: 'app-local',
  templateUrl: './local.page.html',
  styleUrls: ['./local.page.scss'],
})
export class LocalPage implements OnInit {


 @ViewChild('search', { static: false }) search: IonSearchbar;
   /*  @ViewChild('')
     ionViewDidEnter() {
    setTimeout(() => {
      this.search.setFocus();
    });
  }*/

  msg:string;
  name:string;
  cityid:number;
  picup_location:string;
  dropoff_location:string;
  location=false;
  vehicle=false;
  spinner=false;
  citySelect=true;
  localPSelect=false;
  localDSelect=false;
  submit=false;
  Locals: any = [];
  city:City[];
  VehicleTypes: any = [];
  Vehicles: any = [];
  searchedItem: any;
  searchedPItem: any;
  searchedDItem: any;

  customYearValues = [2020, 2016, 2008, 2004, 2000, 1996];
  customDayShortNames = ['s\u00f8n', 'man', 'tir', 'ons', 'tor', 'fre', 'l\u00f8r'];
  customPickerOptions: any;
  enqiry:EnquiryModel={picup_time:"",dropoff_location:"",email:"",fullname:"",mobile:"",picup_date:"",picup_location:"",vehicle_id:"",added_by:0,enq_status:"1"};
  localForm: FormGroup;
  userData;
  isItemAvailable = false;
  constructor(
    private localenquiryService: LocalenquiryService, 
    private http: HttpClient, 
    private fb: FormBuilder,
    private localenquiryAPI: LocalenquiryService,
    private zone: NgZone,
    private router: Router,
    
    ) {
    
     /* this.localForm = this.fb.group({
        picup_location: [''],
        dropoff_location: [''],
        picup_date: [''],
        picup_time: [''],
        vehicle_id: [''],
    })*/
    this.customPickerOptions = {
      buttons: [{
        text: 'Save',
        handler: () => console.log('Clicked Save!')
      }, {
        text: 'Log',
        handler: () => {
          console.log('Clicked Log. Do not Dismiss.');
          return false;
        }
      }]
    }


    //this.searchedItem = this.city;
  }
  ngOnInit() {


    this.userData=JSON.parse(localStorage.getItem('user'))
    console.log(this.userData);
    this.enqiry.fullname=this.userData.fullname;
    this.enqiry.email=this.userData.email;
    this.enqiry.mobile=this.userData.mobile;
    this.enqiry.added_by=this.userData.user_id;
    /*this.localenquiryService.getCity().subscribe((res) => {
      console.log(res)
      this.city = res;
      console.log("City Response",this.city);
      
    })*/

    this.localenquiryService.getVehicleType().subscribe((res) => {
      console.log(res)
      this.VehicleTypes = res;
      console.log("VehicleTypes Response",this.VehicleTypes);
      
    })
    this.localForm = new FormGroup({
      city_name: new FormControl(''),
      picup_location: new FormControl(''),
      dropoff_location: new FormControl(''),
      picup_date: new FormControl(''),
      picup_time: new FormControl(''),
      vehicle_type : new FormControl(''),
      vehicle_name : new FormControl('')    
    });
    
  }



  async filterList(evt) {
    const val = evt.target.value;

      console.log(val)
      if (val && val.trim() !== '') {
        console.log("in");
        
        this.isItemAvailable = true;
        this.city = this.city.filter((item) => {
            return (item.city_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
    } else {
        this.isItemAvailable = false;
    }


  }


  /*onAsyncChangeCity() {
    console.log('Async Selected',this.name);
  }

  onChangeCity(city_id) {

    console.log('Selected', city_id);
    if (city_id) {
      this.localenquiryService.getLocal(city_id).subscribe(
        data => {
          this.Locals = data;
        }
      );
    } else {
      this.Locals = null;
    }
  }*/
  onChangeVehicleType(vehicle_type_id) {

    console.log('Selected', vehicle_type_id);
    if (vehicle_type_id) {
      this.localenquiryService.getVehicle(vehicle_type_id).subscribe(
        data => {
          this.Vehicles = data;
        }
      );
    } else {
      this.Vehicles = null;
    }
  }

  onFormSubmit() {
    this.spinner=true;
    this.location=false;
    this.vehicle=false;
    this.spinner=false;
    this.citySelect=true;
    this.localPSelect=false;
    this.localDSelect=false;
    this.submit=false;
    this.Locals= [];
    this.city=[];
    if (!this.localForm.valid) {
      return false;
    } else {
      
      this.localenquiryAPI.newEnquiry(this.enqiry).subscribe(
        result=>{
          console.log(result);
          this.localForm.reset();
          if(result)
          {
            this.spinner=false;
          }
          
        },err=>
        {
          console.log(err);
          
        }
      )
    }
   console.log(this.enqiry);
   
  }

 
 

  _ionChange(event) {

    this.citySelect=true;
    
    const val = event.target.value;
    console.log(val);

    this.localenquiryService.getAsyncCity(val).subscribe((res) => {
      console.log(res)
      this.city = res;
      console.log("City Response",this.city);
      
    })


    this.searchedItem = this.city;

    if (val && val.trim() != '') {
      if (!this.searchedItem) return [];
      this.searchedItem = this.searchedItem.filter((item: any) => {
        return (item.city_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    // this.search.getInputElement().then(item => console.log(item))
  }


  searchItem(item,num) {
   
    console.log('searchItem',this.name=item.city_id);
    this.cityid=item.city_id;
    this.name=item.city_name;
    //this.location=true;
    //this.citySelect=false;

    
      this.localenquiryService.getLocal(item.city_id).subscribe(
        data => {
          this.Locals = data;
          this.location=true;
          this.citySelect=false;
          this.localPSelect=false;

        }
      );
  
    
  }





  _ionPChange($event) {
    this.Locals = [];
    this.localPSelect=true;
    let pVal = (<HTMLInputElement>event.target).value
    console.log("Location:",pVal);

    this.localenquiryService.getAsyncLocal(this.cityid,pVal).subscribe((res) => {
      console.log("Before Local Response",res)
      this.Locals = res;
      console.log("After Local Response",this.Locals);
      
    })


    this.searchedPItem = this.Locals;

    if (pVal && pVal.trim() != '') {
      if (!this.searchedPItem) return [];
      this.searchedPItem = this.searchedPItem.filter((item: any) => {
        return (item.local_name.toLowerCase().indexOf(pVal.toLowerCase()) > -1);
      })
    }
  }
  

  _ionDChange($event) {
    this.localPSelect=false;
    this.localDSelect=true;
    
    let dVal = (<HTMLInputElement>event.target).value
    console.log("Destination:",dVal);

    this.localenquiryService.getAsyncLocal(this.cityid,dVal).subscribe((res) => {
      console.log("Before Local Response",res)
      this.Locals = res;
      console.log("After Local Response",this.Locals);
      
    })


    this.searchedDItem = this.Locals;

    if (dVal && dVal.trim() != '') {
      if (!this.searchedDItem) return [];
      this.searchedDItem = this.searchedDItem.filter((item: any) => {
        return (item.local_name.toLowerCase().indexOf(dVal.toLowerCase()) > -1);
      })
    }
  }


  


  searchPItem(item,num) {
    //this.Locals = [];
    console.log('searchPItem',item.local_id);
    this.picup_location=item.local_name;
    this.localPSelect=false;
    this.localDSelect=false;  
    
  }

  searchDItem(item,num) {
    //this.Locals = [];
    console.log('searchPItem',item.local_id);
    this.dropoff_location=item.local_name;
    this.localPSelect=false;
    this.localDSelect=false;
    this.vehicle=true;
    this.submit=true;
    
  }

}
