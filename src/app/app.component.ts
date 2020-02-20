import { Component } from '@angular/core';
import { DataSvcService } from "./data-svc.service";

import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  
  data;
  countryMap;
  groups;

  constructor(private dataSvc:DataSvcService){
    this.data=dataSvc.getData(50);
  }

  init(grid){
    //some initialization work
  }

  initFil(fil){
    fil.filterChanged.addHandler((s, e)=>{
      let colFil = fil.getColumnFilter(e.col);
      if(colFil && !colFil.valueFilter.isActive){
        colFil.valueFilter.uniqueValues = null;
      }
    });

    fil.filterChanging.addHandler(()=>{
      setTimeout(()=>{
        let columnEditor = fil.activeEditor;
        if(!columnEditor){
          return;
        }
        let valEditor = columnEditor._edtVal,
          filterCombo = valEditor._cmbFilter;
        
        let filterComboUpdateCount = 0;
        filterCombo.textChanged.addHandler((s,e)=>{
          if(filterCombo['_toText']){
            clearTimeout(filterCombo['_toText']);
          }

          // fetch data only when user stops typing
          filterCombo['_toText'] = setTimeout(() => {
            filterComboUpdateCount++;
            let localCopyCount = filterComboUpdateCount;

            // mocking network delay using promises
            this.fetchValuesFromServer(s.text).then((vals: any[]) =>{
              // update values only from the last
              if(localCopyCount != filterComboUpdateCount){
                return;
              }

              let uvals = vals.map(item => ({
                value: item,
                text: item.toString()
              }));
              valEditor.filter.uniqueValues = vals;
              valEditor._view.sourceCollection = uvals;  
            });            
          }, 300);
        });
      });
    });


  }


  fetchValuesFromServer(filText){
    let filVals = [];

    for(let i = 0; i < 10; i++){
      filVals.push(filText+':'+i);
    }

    return new Promise((res)=>{
      setTimeout(()=>{
        res(filVals);
      }, Math.floor(300 + Math.random()*200));
    });
  }

}
