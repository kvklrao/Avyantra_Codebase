import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgbModalConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "../../shared/service/common/common.service";
import { Subscription } from 'rxjs'; 
import * as _ from "underscore";
import { AppConstant } from "src/app/shared/constant/app-constant";
import { Common } from "../../shared/service/common/common";
import { DataService } from '../../shared/service/data.service';
import { ReadingDataService } from '../../shared/service/reading-data.service';
import { AppHelper } from 'src/app/shared/helper/app.helper';
@Component({
  selector: "app-maternal",
  templateUrl: "./maternal.component.html",
  styleUrls: ["./maternal.component.css"],
  providers: [NgbModalConfig, NgbModal]
})
export class MaternalComponent implements OnInit, OnChanges {
  maternalForm: FormGroup;
  formRef: any;
  submitted = false;
  already_exist_status = 422;
  success_status = 200;
  page: number = 1;
  is_api_call = true;

  getMedicalRecordNumber: string;

  chkMotherAge: boolean = true;
  chkMotherWeight: boolean = true;
  chkMotherHeight: boolean = true;
  chkFeverUnit: boolean = true;
  chkThyroidUnit : boolean = true;
  chkMotherBmi: boolean = true;
  chkMotherHaemoglobin: boolean = true;
  chkMaternalBPSys: boolean = true;
  chkMaternalBPDias: boolean = true;
  chkRuptureIfProm: boolean = true;
  chkAminoticFluidCultureIfPos: boolean = true;
  chkVagSwabCulture: boolean = true;
  isBoolMotherHeight: boolean = true;
  updateFlag: boolean = false;
  hasBmi=true;
  feverDuration=true;
  isMotherEdit: boolean = false;
  localObj:any;
  isEditable=true;
  loggedInUserId:number;
  phcUser=false;
  @Input() id;
  @Input() hospital_id;

  subscription: Subscription;

  temp_study_id = 0;
  login_hospital: any = {};
  responseArray = [];
  public dataServiceObj;
  public babyReadingData;
  ashaUser=false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private common_api: CommonService,
    private modalService: NgbModal,
    private commonAsyn: Common,
    private dataService:DataService,
    public readingDataService:ReadingDataService,
    private constant:AppConstant,private helper:AppHelper
  ) { 
    this.dataServiceObj = dataService.getOption();
  }

  ngOnInit() {
    const vim = this;
    vim.dataServiceObj = vim.dataService.getOption(); 
    vim.babyReadingData=JSON.parse(localStorage.getItem('staffMedicalRecord'));
    if (!( _.isEmpty(vim.babyReadingData)) && ( _.isEmpty(vim.dataServiceObj))) {
      vim.id=vim.babyReadingData['study_id'];
      vim.hospital_id=vim.babyReadingData['hospital_id']
      vim.dataServiceObj=vim.babyReadingData;
    }
    vim.is_api_call = true;
    vim.login_hospital = JSON.parse(localStorage.getItem("login_hospital"));
    vim.loggedInUserId=vim.login_hospital['user_id'];
    vim.createForm(vim.dataServiceObj.study_id);
    if(vim.login_hospital['user_type'] == vim.constant.asha_worker){
      vim.login_hospital['id']=vim.login_hospital['hospital_id'];
      this.ashaUser=true;
    }
    if(vim.login_hospital['user_type'] == vim.constant.phc_worker){
      vim.login_hospital['id']=vim.login_hospital['hospital_id'];
      this.phcUser=true;
    }
    vim.id = vim.dataServiceObj.study_id;
    if (vim.dataServiceObj != undefined || vim.dataServiceObj.study_id != undefined) {
      vim.getMedicalRecordNumber=vim.dataServiceObj.baby_medical_record_number;
      vim.get_maternal(vim.dataServiceObj.study_id, vim.login_hospital['id'], vim.page);
    }
    vim.temp_study_id = vim.id;
  }

  createForm(id) {
    const vim = this;

    vim.chkMotherAge = true;
    vim.chkMotherBmi = true;
    vim.chkMotherHaemoglobin = true;
    vim.chkMaternalBPSys = true;
    vim.chkMaternalBPDias = true;
    vim.chkRuptureIfProm = true;
    vim.chkAminoticFluidCultureIfPos = true;
    vim.chkVagSwabCulture = true;
    vim.hasBmi=true;
    vim.maternalForm = vim.formBuilder.group({
      study_id: [vim.id],
      mother_age: ["", [Validators.required]],
      mother_weight_unit: ["Kgs", Validators.required],
      mother_weight: ["", Validators.required],
      mother_height: ["", Validators.required],
      mother_height_unit: ["ft", Validators.required],
      mother_haemoglobin: ["", Validators.required],
      mother_bmi: ["",Validators.required],
      maternal_blood_pressure: ["", Validators.required],
      maternal_blood_pressure_diastolic: ["", Validators.required],
      maternal_diabetes: ["", Validators.required],
      maternal_fever: ["", Validators.required],
      maternal_fever_unit: ["Centigrade", Validators.required],
      maternal_fever_basic: ["", Validators.required],
      maternal_thyroid_function: ["", Validators.required],
      maternal_thyroid_function_basic: ["", Validators.required],
      maternal_thyroid_function_unit_basic: ["", Validators.required],
      maternal_thyroid_function_unit_basic_unit: ["mU/L", Validators.required],
      more_than_3_vaginal_examinations_during_labor: ["", Validators.required],
      rupture_of_membranes_rom_two: ["", Validators.required],
      rupture_of_membranes_rom_one: ["", Validators.required],
      rupture_of_membranes_rom: ["", Validators.required],
      leaking_pv: ["", Validators.required],
      smelly_amniotic_fluid: ["", Validators.required],
      chorioamnionitis: ["", Validators.required],
      gbs_infection: ["", Validators.required],
      colonisation_or_urinary_tract_infection: ["", Validators.required],
      torch_infections: ["", Validators.required],
      type_of_delivery: ["", Validators.required],
      delayed_cord_clamping: ["", Validators.required],
      vaginal_swab_culture: ["", Validators.required],
      vaginal_swab_culture_two: ["", Validators.required],
      vaginal_swab_culture_three: ["", Validators.required],
      amniotic_fluid_culture: ["", Validators.required],
      amniotic_fluid_culture_three: ["", Validators.required],
      amniotic_fluid_culture_two: ["", Validators.required],
      pih: ["", Validators.required],
      maternal_fever_duration:["",Validators.required]
    });
  }

  calculateBMI() {
    const vim = this;
    
    var total = this.maternalForm.value["mother_height"];
    var beforeTotal = total.toString().split(".")[0];
    var afterTotal = total.toString().split(".")[1];
    if(afterTotal) {
      var conver_in_inch = (((beforeTotal*12) + parseInt(afterTotal))*2.54)/100;
    } else {
      var conver_in_inch = ((beforeTotal*12)*2.54)/100;
    }
    var calculatedBMI = this.maternalForm.value["mother_weight"]/(conver_in_inch*conver_in_inch)
    
    if(this.maternalForm.value["mother_height"].length >0 && this.maternalForm.value["mother_weight"].length >0) {
      this.maternalForm.patchValue({
        mother_bmi: calculatedBMI})
    } else {
      this.maternalForm.patchValue({
        mother_bmi: 0})
    }
  }

  ngOnChanges() {
    this.page = 1;
    this.is_api_call = true;
    this.createForm(this.id);
  }
  reset() {
    this.createForm(null);
  }

  petchUpdate(val, key) {
    const vim = this;
    const number = /^[0-9]+$/;
    if (!number.test(val)) {
      const updateObj = {};
      updateObj[key] = "";
      vim.maternalForm.patchValue(updateObj);
    } else {
      if (
        vim.maternalForm.value["mother_height"] != "" &&
        vim.maternalForm.value["mother_weight"] != ""
      ) {
        const squareOfHieght =
          vim.maternalForm.value["mother_height"] *
          vim.maternalForm.value["mother_height"];
        const result = vim.maternalForm.value["mother_weight"] / squareOfHieght;
      }
    }
  }
  open(content, obj) {
    const vim = this;
    vim.submitted = false;
    if (!_.isEmpty(obj)) {
      vim.isMotherEdit = true;
      vim.updateFlag = true;
      vim.updateForm(obj);
    } else {
      vim.isMotherEdit = true;
      this.maternalForm.reset();
      vim.createForm(this.id);
    }
  }

  updateForm(obj) {
    const vim = this;

    if (obj["mother_age"] == 'NA') {
      vim.chkMotherAge = false;
      vim.maternalForm.controls["mother_age"].clearValidators();
      vim.maternalForm.controls["mother_age"].updateValueAndValidity();
    } else {
      vim.chkMotherAge = true;
      vim.maternalForm.controls["mother_age"].setValidators([Validators.required]);
      vim.maternalForm.controls["mother_age"].updateValueAndValidity();
    }

    if (obj["mother_haemoglobin"] == 'NA') {
      vim.chkMotherHaemoglobin = false;
      vim.maternalForm.controls["mother_haemoglobin"].clearValidators();
      vim.maternalForm.controls["mother_haemoglobin"].updateValueAndValidity();
    } else {
      vim.chkMotherHaemoglobin = true;
      vim.maternalForm.controls["mother_haemoglobin"].setValidators([Validators.required]);
      vim.maternalForm.controls["mother_haemoglobin"].updateValueAndValidity();
    }

    if (obj["maternal_blood_pressure"] == 'NA') {
      vim.chkMaternalBPSys = false;
      vim.maternalForm.controls["maternal_blood_pressure"].clearValidators();
      vim.maternalForm.controls["maternal_blood_pressure"].updateValueAndValidity();
    } else {
      vim.chkMaternalBPSys = true;
      vim.maternalForm.controls["maternal_blood_pressure"].setValidators([Validators.required]);
      vim.maternalForm.controls["maternal_blood_pressure"].updateValueAndValidity();
    }

    if (obj["maternal_blood_pressure_diastolic"] == 'NA') {
      vim.chkMaternalBPDias = false;
      vim.maternalForm.controls["maternal_blood_pressure_diastolic"].clearValidators();
      vim.maternalForm.controls["maternal_blood_pressure_diastolic"].updateValueAndValidity();
    } else {
      vim.chkMaternalBPDias = true;
      vim.maternalForm.controls["maternal_blood_pressure_diastolic"].setValidators([Validators.required]);
      vim.maternalForm.controls["maternal_blood_pressure_diastolic"].updateValueAndValidity();
    }

    if (obj["rupture_of_membranes_rom_two"] == 'NA') {
      vim.chkRuptureIfProm = false;
      vim.maternalForm.controls["rupture_of_membranes_rom_two"].clearValidators();
      vim.maternalForm.controls["rupture_of_membranes_rom_two"].updateValueAndValidity();
    } else {
      vim.chkRuptureIfProm = true;
      vim.maternalForm.controls["rupture_of_membranes_rom_two"].setValidators([Validators.required]);
      vim.maternalForm.controls["rupture_of_membranes_rom_two"].updateValueAndValidity();
    }

    if (obj["amniotic_fluid_culture_three"] == 'NA') {
      vim.chkAminoticFluidCultureIfPos = false;
      vim.maternalForm.controls["amniotic_fluid_culture_three"].clearValidators();
      vim.maternalForm.controls["amniotic_fluid_culture_three"].updateValueAndValidity();
    } else {
      vim.chkAminoticFluidCultureIfPos = true;
      vim.maternalForm.controls["amniotic_fluid_culture_three"].setValidators([Validators.required]);
      vim.maternalForm.controls["amniotic_fluid_culture_three"].updateValueAndValidity();
    }

    if (obj["vaginal_swab_culture_three"] == 'NA') {
      vim.chkVagSwabCulture = false;
      vim.maternalForm.controls["vaginal_swab_culture_three"].clearValidators();
      vim.maternalForm.controls["vaginal_swab_culture_three"].updateValueAndValidity();
    } else {
      vim.chkVagSwabCulture = true;
      vim.maternalForm.controls["vaginal_swab_culture_three"].setValidators([Validators.required]);
      vim.maternalForm.controls["vaginal_swab_culture_three"].updateValueAndValidity();
    }
    if (obj["mother_height"] == 'NA') {
      vim.maternalForm.value["mother_height"] = 'NA';
      vim.chkMotherHeight = false;
      vim.maternalForm.controls["mother_height"].clearValidators();
        vim.maternalForm.controls["mother_height"].updateValueAndValidity();
      vim.maternalForm.patchValue({
        mother_height: 'NA'
      });
    } else {
      vim.maternalForm.controls["mother_height"].setValidators([Validators.required]);
        vim.maternalForm.controls["mother_height"].updateValueAndValidity();
        vim.maternalForm.patchValue({
          mother_height: ''})

      vim.chkMotherHeight = true;

      vim.maternalForm.patchValue({
        mother_height: obj["mother_height"]
      })
    }

    if (obj["mother_weight"] == 'NA') {
      vim.maternalForm.value["mother_weight"] = 'NA';
      vim.chkMotherWeight = false;
      vim.maternalForm.controls["mother_weight"].clearValidators();
        vim.maternalForm.controls["mother_weight"].updateValueAndValidity();
      vim.maternalForm.patchValue({
        mother_weight: 'NA'
      });

    } else {
      vim.maternalForm.controls["mother_weight"].setValidators([Validators.required]);
        vim.maternalForm.controls["mother_weight"].updateValueAndValidity();
        vim.maternalForm.patchValue({
          mother_weight: ''})
          vim.chkMotherWeight = true;
      vim.maternalForm.patchValue({
        mother_weight: obj["mother_weight"]
      })
    }

    if (obj["maternal_thyroid_function_unit_basic"] == 'NA') {
      vim.maternalForm.value["maternal_thyroid_function_unit_basic"] = 'NA';
      vim.chkThyroidUnit = false;
      vim.maternalForm.controls["maternal_thyroid_function_unit_basic"].clearValidators();
        vim.maternalForm.controls["maternal_thyroid_function_unit_basic"].updateValueAndValidity();
      vim.maternalForm.patchValue({
        maternal_thyroid_function_unit_basic: 'NA'
      });
    } else {
      vim.maternalForm.controls["maternal_thyroid_function_unit_basic"].setValidators([Validators.required]);
        vim.maternalForm.controls["maternal_thyroid_function_unit_basic"].updateValueAndValidity();
        vim.maternalForm.patchValue({
          maternal_thyroid_function_unit_basic: ''})
          vim.chkThyroidUnit = true;

      vim.maternalForm.patchValue({
        maternal_thyroid_function_unit_basic: obj["maternal_thyroid_function_unit_basic"]
      })
    }

    if (obj["maternal_fever"] == 'NA') {
      vim.maternalForm.value["maternal_fever"] = 'NA';
      vim.chkFeverUnit = false;
      vim.maternalForm.controls["maternal_fever"].clearValidators();
        vim.maternalForm.controls["maternal_fever"].updateValueAndValidity();
      vim.maternalForm.patchValue({
        maternal_fever: 'NA'
      });
    } else {
      vim.maternalForm.controls["maternal_fever"].setValidators([Validators.required]);
        vim.maternalForm.controls["maternal_fever"].updateValueAndValidity();
        vim.maternalForm.patchValue({
          maternal_fever: ''})
          vim.chkFeverUnit = true;

      vim.maternalForm.patchValue({
        maternal_fever: obj["maternal_fever"]
      })
    }

    if (obj["mother_bmi"] == 'NA') {
      vim.maternalForm.value["mother_bmi"] = 'NA';
      vim.hasBmi = false;
      vim.maternalForm.controls["mother_bmi"].clearValidators();
        vim.maternalForm.controls["mother_bmi"].updateValueAndValidity();
      vim.maternalForm.patchValue({
        maternal_fever: 'NA'
      });
    } else {
      vim.maternalForm.controls["mother_bmi"].setValidators([Validators.required]);
        vim.maternalForm.controls["mother_bmi"].updateValueAndValidity();
        vim.maternalForm.patchValue({
          maternal_fever: ''})
          vim.hasBmi = true;

      vim.maternalForm.patchValue({
        maternal_fever: obj["mother_bmi"]
      })
    }

    if (obj["maternal_fever_duration"] == 'NA') {
      vim.maternalForm.value["maternal_fever_duration"] = 'NA';
      vim.feverDuration = false;
      vim.maternalForm.controls["maternal_fever_duration"].clearValidators();
        vim.maternalForm.controls["maternal_fever_duration"].updateValueAndValidity();
      vim.maternalForm.patchValue({
        maternal_fever_duration: 'NA'
      });
    } else {
      vim.maternalForm.controls["maternal_fever_duration"].setValidators([Validators.required]);
        vim.maternalForm.controls["maternal_fever_duration"].updateValueAndValidity();
        vim.maternalForm.patchValue({
          maternal_fever_duration: ''})
          vim.feverDuration = true;

      vim.maternalForm.patchValue({
        maternal_fever_duration: obj["maternal_fever_duration"]
      })
    }



    if(obj["mother_height_unit"] == 'NA' &&  obj["mother_weight_unit"] == 'NA'){
      this.isEditable=false;
    } 

    vim.maternalForm.patchValue({
      study_id: obj["study_id"],
      mother_age: obj["mother_age"],
      mother_weight_unit: obj["mother_weight_unit"],
      mother_weight: obj["mother_weight"],
      mother_height: obj["mother_height"],
      mother_height_unit: obj["mother_height_unit"],
      mother_haemoglobin: obj["mother_haemoglobin"],
      mother_bmi: obj["mother_bmi"],
      maternal_blood_pressure: obj["maternal_blood_pressure"],
      maternal_blood_pressure_diastolic:
        obj["maternal_blood_pressure_diastolic"],
      maternal_diabetes: obj["maternal_diabetes"],
      maternal_fever: obj["maternal_fever"],
      maternal_fever_unit: obj["maternal_fever_unit"],
      maternal_fever_basic: obj["maternal_fever_basic"],
      maternal_thyroid_function: obj["maternal_thyroid_function"],
      maternal_thyroid_function_basic: obj["maternal_thyroid_function_basic"],
      maternal_thyroid_function_unit_basic:
        obj["maternal_thyroid_function_unit_basic"],
      maternal_thyroid_function_unit_basic_unit:
        obj["maternal_thyroid_function_unit_basic_unit"],
      more_than_3_vaginal_examinations_during_labor:
        obj["more_than_3_vaginal_examinations_during_labor"],
      rupture_of_membranes_rom_two: obj["rupture_of_membranes_rom_two"],
      rupture_of_membranes_rom_one: obj["rupture_of_membranes_rom_one"],
      leaking_pv: obj["leaking_pv"],
      rupture_of_membranes_rom: obj["rupture_of_membranes_rom"],
      smelly_amniotic_fluid: obj["smelly_amniotic_fluid"],
      chorioamnionitis: obj["chorioamnionitis"],
      gbs_infection: obj["gbs_infection"],
      colonisation_or_urinary_tract_infection:
        obj["colonisation_or_urinary_tract_infection"],
      torch_infections: obj["torch_infections"],
      type_of_delivery: obj["type_of_delivery"],
      delayed_cord_clamping: obj["delayed_cord_clamping"],
      vaginal_swab_culture: obj["vaginal_swab_culture"],
      vaginal_swab_culture_two: obj["vaginal_swab_culture_two"],
      vaginal_swab_culture_three: obj["vaginal_swab_culture_three"],
      amniotic_fluid_culture: obj["amniotic_fluid_culture"],
      amniotic_fluid_culture_three: obj["amniotic_fluid_culture_three"],
      amniotic_fluid_culture_two: obj["amniotic_fluid_culture_two"],
      pih: obj["pih"],
      maternal_fever_duration: obj["maternal_fever_duration"]
    });
  }

  onInputChange(event) {
    var vim = this;
    var target = event.target || event.srcElement || event.currentTarget;

    if (target.name == 'mother_age') {
      if (target.value == '2') {
        vim.chkMotherAge = false;
        vim.maternalForm.patchValue({
          mother_age: 'NA'
        })
        vim.maternalForm.value["heart_rate"] = 'NA';

        vim.maternalForm.controls["mother_age"].clearValidators();
        vim.maternalForm.controls["mother_age"].updateValueAndValidity();
      } else {
        vim.chkMotherAge = true;
        vim.maternalForm.patchValue({
          mother_age: ''
        })
        vim.maternalForm.controls["mother_age"].setValidators([Validators.required]);
        vim.maternalForm.controls["mother_age"].updateValueAndValidity();
      }
    }

    if (target.name == 'motherHaemoglobin') {

      if (target.value == '2') {
        vim.chkMotherHaemoglobin = false;
        vim.maternalForm.patchValue({
          mother_haemoglobin: 'NA'
        });
        vim.maternalForm.value["mother_haemoglobin"] = 'NA';

        vim.maternalForm.controls["mother_haemoglobin"].clearValidators();
        vim.maternalForm.controls["mother_haemoglobin"].updateValueAndValidity();
      } else {
        vim.chkMotherHaemoglobin = true;
        vim.maternalForm.patchValue({
          mother_haemoglobin: ''
        });
        vim.maternalForm.controls["mother_haemoglobin"].setValidators([Validators.required]);
        vim.maternalForm.controls["mother_haemoglobin"].updateValueAndValidity();
      }
    }

    if (target.name == 'maternalBpSys') {

      if (target.value == '2') {
        vim.chkMaternalBPSys = false;
        vim.maternalForm.patchValue({
          maternal_blood_pressure: 'NA'
        });
        vim.maternalForm.value["maternal_blood_pressure"] = 'NA';

        vim.maternalForm.controls["maternal_blood_pressure"].clearValidators();
        vim.maternalForm.controls["maternal_blood_pressure"].updateValueAndValidity();
      } else {
        vim.chkMaternalBPSys = true;
        vim.maternalForm.patchValue({
          maternal_blood_pressure: ''
        });
        vim.maternalForm.controls["maternal_blood_pressure"].setValidators([Validators.required]);
        vim.maternalForm.controls["maternal_blood_pressure"].updateValueAndValidity();
      }
    }

    if (target.name == 'maternalBpDias') {

      if (target.value == '2') {
        vim.chkMaternalBPDias = false;
        vim.maternalForm.patchValue({
          maternal_blood_pressure_diastolic: 'NA'
        });
        vim.maternalForm.value["maternal_blood_pressure_diastolic"] = 'NA';

        vim.maternalForm.controls["maternal_blood_pressure_diastolic"].clearValidators();
        vim.maternalForm.controls["maternal_blood_pressure_diastolic"].updateValueAndValidity();
      } else {
        vim.chkMaternalBPDias = true;
        vim.maternalForm.patchValue({
          maternal_blood_pressure_diastolic: ''
        });
        vim.maternalForm.controls["maternal_blood_pressure_diastolic"].setValidators([Validators.required]);
        vim.maternalForm.controls["maternal_blood_pressure_diastolic"].updateValueAndValidity();
      }
    }

    if (target.name == 'ruptureIfProm') {

      if (target.value == '2') {
        vim.chkRuptureIfProm = false;
        vim.maternalForm.patchValue({
          rupture_of_membranes_rom_two: 'NA'
        });
        vim.maternalForm.value["rupture_of_membranes_rom_two"] = 'NA';

        vim.maternalForm.controls["rupture_of_membranes_rom_two"].clearValidators();
        vim.maternalForm.controls["rupture_of_membranes_rom_two"].updateValueAndValidity();
      } else {
        vim.chkRuptureIfProm = true;
        vim.maternalForm.patchValue({
          rupture_of_membranes_rom_two: ''
        });
        vim.maternalForm.controls["rupture_of_membranes_rom_two"].setValidators([Validators.required]);
        vim.maternalForm.controls["rupture_of_membranes_rom_two"].updateValueAndValidity();
      }
    }

    if (target.name == 'amnioticFluidCultureIfPos') {

      if (target.value == '2') {
        vim.chkAminoticFluidCultureIfPos = false;
        vim.maternalForm.patchValue({
          amniotic_fluid_culture_three: 'NA'
        });
        vim.maternalForm.value["amniotic_fluid_culture_three"] = 'NA';

        vim.maternalForm.controls["amniotic_fluid_culture_three"].clearValidators();
        vim.maternalForm.controls["amniotic_fluid_culture_three"].updateValueAndValidity();
      } else {
        vim.chkAminoticFluidCultureIfPos = true;
        vim.maternalForm.patchValue({
          amniotic_fluid_culture_three: ''
        });
        vim.maternalForm.controls["amniotic_fluid_culture_three"].setValidators([Validators.required]);
        vim.maternalForm.controls["amniotic_fluid_culture_three"].updateValueAndValidity();
      }
    }

    if (target.name == 'vagSwabCulture') {

      if (target.value == '2') {
        vim.chkVagSwabCulture = false;
        vim.maternalForm.patchValue({
          vaginal_swab_culture_three: 'NA'
        });
        vim.maternalForm.value["vaginal_swab_culture_three"] = 'NA';

        vim.maternalForm.controls["vaginal_swab_culture_three"].clearValidators();
        vim.maternalForm.controls["vaginal_swab_culture_three"].updateValueAndValidity();
      } else {
        vim.chkVagSwabCulture = true;
        vim.maternalForm.patchValue({
          vaginal_swab_culture_three: ''
        });
        vim.maternalForm.controls["vaginal_swab_culture_three"].setValidators([Validators.required]);
        vim.maternalForm.controls["vaginal_swab_culture_three"].updateValueAndValidity();
      }
    }
    if (target.name == 'motherBMI') {

      if (target.value == '2') {
        vim.hasBmi = false;
        vim.maternalForm.patchValue({
          mother_bmi: 'NA'
        });
        vim.maternalForm.value["mother_bmi"] = 'NA';

        vim.maternalForm.controls["mother_bmi"].clearValidators();
        vim.maternalForm.controls["mother_bmi"].updateValueAndValidity();
      } else {
        vim.hasBmi = true;
        vim.maternalForm.patchValue({
          mother_bmi: ''
        });
        vim.maternalForm.controls["mother_bmi"].setValidators([Validators.required]);
        vim.maternalForm.controls["mother_bmi"].updateValueAndValidity();
      }
    }
    if (target.name == 'motherFeverDuration') {

      if (target.value == '2') {
        vim.feverDuration = false;
        vim.maternalForm.patchValue({
          maternal_fever_duration: 'NA'
        });
        vim.maternalForm.value["maternal_fever_duration"] = 'NA';

        vim.maternalForm.controls["maternal_fever_duration"].clearValidators();
        vim.maternalForm.controls["maternal_fever_duration"].updateValueAndValidity();
      } else {
        vim.feverDuration = true;
        vim.maternalForm.patchValue({
          maternal_fever_duration: ''
        });
        vim.maternalForm.controls["maternal_fever_duration"].setValidators([Validators.required]);
        vim.maternalForm.controls["maternal_fever_duration"].updateValueAndValidity();
      }
    }

  }

  maternalFormSubmit() {

    const vim = this;
    vim.submitted = true;
    if(this.ashaUser){
      this.setDefaultValuesForAshaWorker();
    }
    console.log(this.maternalForm)
    if (vim.maternalForm.invalid) {
      return;
    }

    if (this.maternalForm.value["mother_age"] == '') {
      this.maternalForm.value["mother_age"] = 'NA';
    }

    if (this.maternalForm.value["mother_haemoglobin"] == '') {
      this.maternalForm.value["mother_haemoglobin"] = 'NA';
    }

    if (this.maternalForm.value["maternal_blood_pressure"] == '') {
      this.maternalForm.value["maternal_blood_pressure"] = 'NA';
    }

    if (this.maternalForm.value["maternal_blood_pressure_diastolic"] == '') {
      this.maternalForm.value["maternal_blood_pressure_diastolic"] = 'NA';
    }

    if (this.maternalForm.value["rupture_of_membranes_rom_two"] == '') {
      this.maternalForm.value["rupture_of_membranes_rom_two"] = 'NA';
    }

    if (this.maternalForm.value["vaginal_swab_culture_three"] == '') {
      this.maternalForm.value["vaginal_swab_culture_three"] = 'NA';
    }

    if (this.maternalForm.value["amniotic_fluid_culture_three"] == '') {
      this.maternalForm.value["amniotic_fluid_culture_three"] = 'NA';
    }

    if (this.maternalForm.value["mother_height"] == '') {
      this.maternalForm.value["mother_height"] = 'NA';
    }

    if (this.maternalForm.value["mother_weight"] == '') {
      this.maternalForm.value["mother_weight"] = 'NA';
    }

    if (this.maternalForm.value["maternal_thyroid_function_unit_basic"] == '') {
      this.maternalForm.value["maternal_thyroid_function_unit_basic"] = 'NA';
    }

    if (this.maternalForm.value["maternal_fever"] == '') {
      this.maternalForm.value["maternal_fever"] = 'NA';
    }
    if (this.maternalForm.value["mother_bmi"] == '') {
      this.maternalForm.value["mother_bmi"] = 'NA';
    }
    if (this.maternalForm.value["maternal_fever_duration"] == '') {
      this.maternalForm.value["maternal_fever_duration"] = 'NA';
    }
    

    if(this.dataServiceObj.study_id) {
      this.maternalForm.value['study_id'] = this.dataServiceObj.study_id;
    }

    vim.commonAsyn.showLoader();
    vim.maternalForm.value["tab_name"] = "maternal";
    // vim.maternalForm.value["study_id"] = vim.id;
    const newUser = vim.common_api.maternal_add(vim.maternalForm.value,vim.loggedInUserId);
    newUser.subscribe(
      response => {
        if(this.helper.success(response)){
        vim.reset();
        vim.success(response, "MaternalFormSubmit");
        if(vim.login_hospital['user_type']==vim.constant.asha_worker){
          vim.readingDataService.setComponentFlag('health-parameters')
          vim.readingDataService.setActiveTab("health-parameters")
          vim.readingDataService.setAshaWorkerActiveStatus('motherProfile')
          this.router.navigate(['/dashboard/health-parameters']);
        }
        if(vim.login_hospital['user_type']==vim.constant.phc_worker){
          vim.readingDataService.setComponentFlag('baby-appear')
          vim.readingDataService.setActiveTab("baby-appearence")
          //vim.readingDataService.setAshaWorkerActiveStatus('motherProfile')
          this.router.navigate(['/dashboard/baby-appearence']);
        }
      }else{
        this.commonAsyn.isHide();
        this.showErrorMessage(response);
      }
      },
      error => {
        console.error("errro", error);
      }
    );
  }

  setDefaultValuesForAshaWorker(){
    this.maternalForm.get('maternal_fever').setValue('NA');
    this.maternalForm.get('maternal_fever_unit').setValue('NA');
    this.maternalForm.get('maternal_fever_basic').setValue('NA');
    this.maternalForm.get('maternal_thyroid_function').setValue('NA');
    this.maternalForm.get('maternal_thyroid_function_basic').setValue('NA');

    this.maternalForm.get('maternal_thyroid_function_unit_basic').setValue('NA');
    this.maternalForm.get('maternal_thyroid_function_unit_basic_unit').setValue('NA');
    this.maternalForm.get('more_than_3_vaginal_examinations_during_labor').setValue('NA');
    this.maternalForm.get('leaking_pv').setValue('NA');
    this.maternalForm.get('smelly_amniotic_fluid').setValue('NA');
    this.maternalForm.get('chorioamnionitis').setValue('NA');

    this.maternalForm.get('gbs_infection').setValue('NA');
    this.maternalForm.get('colonisation_or_urinary_tract_infection').setValue('NA');
    this.maternalForm.get('torch_infections').setValue('NA');
    this.maternalForm.get('vaginal_swab_culture').setValue('NA');
    this.maternalForm.get('vaginal_swab_culture_two').setValue('NA');

    this.maternalForm.get('vaginal_swab_culture_three').setValue('NA');
    this.maternalForm.get('amniotic_fluid_culture').setValue('NA');
    this.maternalForm.get('amniotic_fluid_culture_three').setValue('NA');
    this.maternalForm.get('amniotic_fluid_culture_two').setValue('NA');
    this.maternalForm.get('mother_haemoglobin').setValue('NA');
    this.maternalForm.get('pih').setValue('NA');
    this.maternalForm.get('maternal_fever_duration').setValue('NA');

    

  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.maternalForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  /**
   *
   * @param response
   * @param api_type
   * @method: success
   * @purpose :-  it is a common helper
   */
  success(response, api_type) {
    const vim = this;
    if (api_type == "MaternalFormSubmit") {
      if (vim.isSuccess(response)) {
        vim.responseArray = [];
        this.page = 1;
        if(response["status"] != 200 ) {
          vim.toastr.error("Please provide all valid field");
          vim.commonAsyn.isHide();
        } 
        if(response["status"] == 200){
          vim.toastr.success(
            "",
            "Data Inserted Succesfully"
          );
          vim.is_api_call = true;
         vim.dataServiceObj = vim.dataService.getOption();
         vim.get_maternal(vim.dataServiceObj.study_id, vim.login_hospital['id'], vim.page);
        }
        
      } else {
        if (vim.isAlreadyExist(response)) {
          vim.toastr.warning("Already Exist!!", response["message"]);
        } else {
          vim.errorToasty(response);
        }
      }
    } else if (api_type == "get_all") {
      if (vim.isSuccess(response)) {
        if (this.page == 1) {
          vim.responseArray = [];
          vim.responseArray = response["response"];
        } else {
          if (response["status"] == 404) {
            // vim.responseArray = [];
            vim.is_api_call = false;
          }
          else if (response["response"].length > 0) {
            vim.temp_study_id = response["response"][0].study_id;
            if (vim.temp_study_id == vim.id) {
            } else {
              vim.responseArray = [];
            }

            for (var i = 0; i < response["response"].length; i++) {
              vim.responseArray.push(response["response"][i]);
              vim.temp_study_id = vim.id;
            }
          }
        }
        vim.commonAsyn.isHide();
      } else {
        vim.responseArray = [];
        vim.commonAsyn.isHide();
        if (vim.isAlreadyExist(response)) {
        } else {
        }
      }
    }
  }

  /**
   *
   * @param error
   * @param api_type
   * @purpose :-  This is error handler method is called.
   * @method: errorHandler
   */
  errorHandler(error, api_type) {
    const vim = this;
    if (api_type == "MaternalFormSubmit") {
      vim.errorToasty(error);
    }
  }

  /**
   *
   * @param response
   * @method: it is a common herlper for check the status is 200 or not
   */

  isSuccess(response) {
    const vim = this;
    if (
      response.hasOwnProperty("status") &&
      response["status"] === vim.success_status
    ) {
      return true;
    } else if (response["status"] === 404) {
      return true;
    }
    return false;
  }
  /**
   *
   * @param response
   * @method :- isAlreadyExist
   * @purpose :- check if User Already Exist.
   */
  isAlreadyExist(response) {
    const vim = this;
    if (
      response.hasOwnProperty("status") &&
      response["status"] === vim.already_exist_status
    ) {
      return true;
    }
    return false;
  }
  /**
   * @method :- errorToasty
   */
  errorToasty(error) {
    const vim = this;
    if (error.hasOwnProperty("message")) {
      vim.toastr.error("Error!", error["message"]);
    } else {
      vim.toastr.error("Error!", "Somethink wrong!!!..");
    }
  }

  /**
   *
   * @param id
   */

  get_maternal(id, hospital_id, page) {
    const vim = this;
    if (vim.temp_study_id == vim.id) {

    } else {
      vim.page = 1;
      vim.temp_study_id = vim.id;
    }

    const newdata = vim.common_api.get_tabs_general("patient/get_maternal", id, hospital_id, page);
    newdata.subscribe(
      response => {
        vim.success(response, "get_all");
        vim.isMotherEdit = false;
        console.log(response['status'])
        if(response['status'] == 200) {
          vim.readingDataService.isMotherProfileHaveResp = false;
        }
      },
      error => {
        console.error("errro", error);
      }
    );
  }

  changeDropdown(dropdownVal, dropdownId) {
    var vim = this;
    // debugger;
    if (dropdownId == 'mother_height') {
      if (dropdownVal == 'NA') {
        vim.chkMotherHeight = false;
        vim.maternalForm.patchValue({
          mother_height: 'NA'
        });
        vim.maternalForm.value["mother_height"] = 'NA';
          
        vim.maternalForm.controls["mother_height"].clearValidators();
        vim.maternalForm.controls["mother_height"].updateValueAndValidity();

        if( vim.maternalForm.value["mother_height_unit"] == 'NA' &&  vim.maternalForm.value["mother_weight_unit"] == 'NA'){
          this.isEditable=false;
          vim.maternalForm.patchValue({
            mother_bmi: ''
          })
        }

      } else {
        this.hasBmi=true;
        this.isEditable=true;
        vim.maternalForm.controls["mother_height"].setValidators([Validators.required]);
        vim.maternalForm.controls["mother_height"].updateValueAndValidity();
        vim.chkMotherHeight = true;
        vim.maternalForm.patchValue({
          mother_height: ''
        })
        
      }
    }

    if (dropdownId == 'mother_weight') {
      if (dropdownVal == 'NA') {
        vim.chkMotherWeight = false;
        vim.maternalForm.patchValue({
          mother_weight: 'NA'
        });
        vim.maternalForm.value["mother_weight"] = 'NA';
          
        vim.maternalForm.controls["mother_weight"].clearValidators();
        vim.maternalForm.controls["mother_weight"].updateValueAndValidity();
        if( vim.maternalForm.value["mother_height_unit"] == 'NA' &&  vim.maternalForm.value["mother_weight_unit"] == 'NA'){
          this.isEditable=false;
          vim.maternalForm.patchValue({
            mother_bmi: ''
          })
        }
      } else {
        this.isEditable=true;
        this.hasBmi=true;
        vim.chkMotherWeight = true;
        vim.maternalForm.patchValue({
          mother_weight: ''
        })
        vim.maternalForm.controls["mother_weight"].setValidators([Validators.required]);
        vim.maternalForm.controls["mother_weight"].updateValueAndValidity();
      }
    }

    if (dropdownId == 'maternal_thyroid_function_unit_basic_id') {
      if (dropdownVal == 'NA') {
        vim.chkThyroidUnit = false;
        vim.maternalForm.patchValue({
          maternal_thyroid_function_unit_basic: 'NA'
        });
        vim.maternalForm.value["maternal_thyroid_function_unit_basic"] = 'NA';
          
        vim.maternalForm.controls["maternal_thyroid_function_unit_basic"].clearValidators();
        vim.maternalForm.controls["maternal_thyroid_function_unit_basic"].updateValueAndValidity();

      } else {
        vim.chkThyroidUnit = true;
        vim.maternalForm.patchValue({
          maternal_thyroid_function_unit_basic: ''
        })
        vim.maternalForm.controls["maternal_thyroid_function_unit_basic"].setValidators([Validators.required]);
        vim.maternalForm.controls["maternal_thyroid_function_unit_basic"].updateValueAndValidity();
      }
    }


    if (dropdownId == 'maternal_feverId') {
      if (dropdownVal == 'NA') {
        vim.chkFeverUnit = false;
        vim.maternalForm.patchValue({
          maternal_fever: 'NA'
        });
        vim.maternalForm.value["maternal_fever"] = 'NA';
          
        vim.maternalForm.controls["maternal_fever"].clearValidators();
        vim.maternalForm.controls["maternal_fever"].updateValueAndValidity();

      } else {
        vim.chkFeverUnit = true;
        vim.maternalForm.patchValue({
          maternal_fever: ''
        })
        vim.maternalForm.controls["maternal_fever"].setValidators([Validators.required]);
        vim.maternalForm.controls["maternal_fever"].updateValueAndValidity();
      }
    }
  }

  // Update data of maternal form
  update_maternal_form() {
    var vim = this;
    vim.submitted = true;
    if(vim.maternalForm.invalid) {
      return;
    } else {

      if (this.maternalForm.value["mother_age"] == '') {
        this.maternalForm.value["mother_age"] = 'NA';
      }
  
      if (this.maternalForm.value["mother_haemoglobin"] == '') {
        this.maternalForm.value["mother_haemoglobin"] = 'NA';
      }
  
      if (this.maternalForm.value["maternal_blood_pressure"] == '') {
        this.maternalForm.value["maternal_blood_pressure"] = 'NA';
      }
  
      if (this.maternalForm.value["maternal_blood_pressure_diastolic"] == '') {
        this.maternalForm.value["maternal_blood_pressure_diastolic"] = 'NA';
      }
  
      if (this.maternalForm.value["rupture_of_membranes_rom_two"] == '') {
        this.maternalForm.value["rupture_of_membranes_rom_two"] = 'NA';
      }
  
      if (this.maternalForm.value["vaginal_swab_culture_three"] == '') {
        this.maternalForm.value["vaginal_swab_culture_three"] = 'NA';
      }
  
      if (this.maternalForm.value["amniotic_fluid_culture_three"] == '') {
        this.maternalForm.value["amniotic_fluid_culture_three"] = 'NA';
      }
  
      if (this.maternalForm.value["mother_height"] == '') {
        this.maternalForm.value["mother_height"] = 'NA';
      }
  
      if (this.maternalForm.value["mother_weight"] == '') {
        this.maternalForm.value["mother_weight"] = 'NA';
      }
  
      if (this.maternalForm.value["maternal_thyroid_function_unit_basic"] == '') {
        this.maternalForm.value["maternal_thyroid_function_unit_basic"] = 'NA';
      }
  
      if (this.maternalForm.value["maternal_fever"] == '') {
        this.maternalForm.value["maternal_fever"] = 'NA';
      }
      if (this.maternalForm.value["mother_bmi"] == '') {
        this.maternalForm.value["mother_bmi"] = 'NA';
      }

      if (this.maternalForm.value["maternal_fever_duration"] == '') {
        this.maternalForm.value["maternal_fever_duration"] = 'NA';
      }
      
      
  
      if(this.dataServiceObj.study_id) {
        this.maternalForm.value['study_id'] = this.dataServiceObj.study_id;
      }

    vim.common_api.updateMaternalProfile(vim.id, vim.maternalForm.value,vim.loggedInUserId)
    .subscribe(result => {
      if(result['status'] != 200) {
        vim.toastr.error(result['message']);
      } else {
        vim.toastr.success(
          "",
          "Data Updated Succesfully"
        );
        vim.updateFlag = false;
        vim.get_maternal(vim.dataServiceObj.study_id, vim.login_hospital['id'], vim.page);
      }
    })
    }
  }

  showErrorMessage(response){
    if(response['message']=='required have data'){
      this.toastr.error('Please fill Basic Profile form first.');
    }else{
      this.toastr.error(response['message'],'');
    }
  }
}