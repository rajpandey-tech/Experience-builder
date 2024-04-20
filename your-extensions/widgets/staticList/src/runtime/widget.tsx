import {
  React, type IMDataSourceInfo, type AllWidgetProps, DataSourceComponent, type DataSource,
  DataSourceManager, type FeatureLayerQueryParams, DataSourceStatus
} from 'jimu-core'
import { Button } from 'jimu-ui'
import { useState, useRef } from 'react'

const Widget = (props: AllWidgetProps<any>) => {
  const uniqueValuesCount = {};
  const [query, setQuery] = useState<FeatureLayerQueryParams>(null)
  const fieldNameRef = useRef<HTMLInputElement>(null)
  const selectFieldRef = useRef(null);
  const selectFieldValueRef = useRef(null);
  const [variableType, setDynamicValue] = useState('');
  
  // State to store the selected value
  const [selectedValue, setSelectedValue] = useState('');
  const [fieldData, setFieldData] = useState('');


  const isDsConfigured = () => {
    if (props.useDataSources &&
      props.useDataSources.length === 1 &&
      props.useDataSources[0].fields &&
      props.useDataSources[0].fields.length === 1) {
      return true
    }
    return false
  }
  // Function to handle change in the select element
  const handleFieldChange = (event) => {
    const selectedOption = event.target.value;
      // const selectedOption = selectFieldRef.current.value;
      console.log('Selected value is='+selectedOption); 
      setSelectedValue(selectedOption);
      setFieldData('');
  };

  const handleFieldValueChange = (event) => {
    // const selectedOption = event.target.value;
    setFieldData(event.target.value);
  };
  const queryFunc = () => {
    if (!isDsConfigured()) {
      return
    }
    const fieldName =  props.useDataSources[0].fields[0];
    // selectedValue;
    // let expNumericValue = `${fieldName} =${fieldNameRef.current.value}`;
    let query = '1=1';
    if (variableType == "esriFieldTypeInteger" || variableType == "esriFieldTypeOID" || variableType == "esriFieldTypeDouble")
      query = `${fieldName} =${fieldNameRef.current.value}`
    else
      query = `${fieldName} like '%${fieldNameRef.current.value}%'`;
    const w = fieldNameRef.current && fieldNameRef.current.value
      ? query : '1=1'
    setQuery({
      where: w,
      outFields: ['*'],
      pageSize: 10
    })
  }
   // Sample function to apply the selected value
  //  const filterVaueFromDataSource = () => {
  //   if (!isDsConfigured()) {
  //     return
  //   }
  //   const fieldName =props.useDataSources[0].fields[0];
  //   //  props.useDataSources[0].fields[0]
  //   // let expNumericValue = `${fieldName} =${fieldNameRef.current.value}`;
  //   let query = '1=1';
  //   if (variableType == "esriFieldTypeInteger" || variableType == "esriFieldTypeOID" || variableType == "esriFieldTypeDouble")
  //     query = `${fieldName} =${fieldData}`
  //   else
  //     query = `${fieldName} like '%${fieldData}%'`;

  //   const w = fieldData && fieldData
  //     ? query : '1=1'
  //   setQuery({
  //     where: w,
  //     outFields: ['*'],
  //     pageSize: 10
  //   })
  // };
  const useEffect = (() => {
    // queryFunc()   
    // selectFieldRef.current.focus(); 
    // filterVaueFromDataSource(selectedValue);
  }, [])

 

  const renderer = (ds: DataSource, info: IMDataSourceInfo) => {
    createOutputDs(ds);
    let fName = selectedValue;
    if (fName == '') {
      fName = props.useDataSources[0].fields[0]; //Display deafult data in list bcz fName returns null by default 
      setDynamicValue(ds.fetchedSchema.fields[fName].esriType)
    }
    else {
      setDynamicValue(ds.fetchedSchema.fields[fName].esriType)
    }
    return <>
      <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
        Select Field:
        {/* <select value={selectedValue} onChange={handleFieldChange}>
          {Object.keys(ds.fetchedSchema.fields).map((key, index) => (
            <option key={index} value={key}>{key}</option>
          ))}
        </select> */}
      </div>
      <div style={{ fontSize: '14px',fontWeight: 'bold' }}>       
         Current Field:{fName}        
        <input placeholder="Query value" ref={fieldNameRef} />
        <button onClick={queryFunc}>Query</button>
      </div>
      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Query State: {info.status}</div>
      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Total Count: {ds.count}</div>

      {

        <div className="record-list" style={{ width: '100%', marginTop: '20px', height: 'calc(100% - 80px)', overflow: 'auto', fontSize: '14px' }}>
          {
            ds && ds.getStatus() === DataSourceStatus.Loaded ? (() => {
              const records = ds.getRecords();
              const uniqueValuesCount = {};
              records.forEach(record => {
                const value = record.getData()[fName];
                if (value && value != " ") { uniqueValuesCount[value] = (uniqueValuesCount[value] || 0) + 1; }
              });
              return (
                <>{
                  selectedValue&&(
                    <select>
                    {/* Map over the dynamic data array and create an option element for each item */}
                    {Object.entries(uniqueValuesCount).map(([count], i) => (
                      <option key={i} value={count}>{count}</option>
                    ))}
                  </select>
                  )
                }                 
                   {/* <button onClick={filterVaueFromDataSource}>Apply for list</button> */}
                  <div style={{ fontSize: '14px',fontWeight:'bold' }}>Total Count Of Selected Field: {Object.keys(uniqueValuesCount).length}</div>
                </>
              );
            })() : null
          }
        </div>
      }
    </>
  }
  //  eslint-disable-next-line @typescript-eslint/no-unused-vars
  const createOutputDs = (useDs: DataSource) => {
    if (!props.outputDataSources) {
      return
    }
    const outputDsId = props.outputDataSources[0]
    const dsManager = DataSourceManager.getInstance()
    if (dsManager.getDataSource(outputDsId)) {
      if (dsManager.getDataSource(outputDsId).getDataSourceJson().originDataSources[0].dataSourceId !== useDs.id) {
        dsManager.destroyDataSource(outputDsId)
      }
    }
    dsManager.createDataSource(outputDsId).then(ods => {
      ods.setRecords(useDs.getRecords())
    })
  }
  if (!isDsConfigured()) {
    return <h3>
      This widget demonstrates how to use a feature layer as a data source.
      <br />
      Configure the data source.
    </h3>
  }
  return (
    <div className="widget-use-feature-layer" style={{ width: '100%', height: '100%', maxHeight: '800px', overflow: 'auto',alignItems:'center' }}>
      <h3>
        Use a feature layer as a data source.
        {/* This widget shows how to */}
      </h3>
      <DataSourceComponent useDataSource={props.useDataSources?.[0]} query={query} widgetId={props.id} queryCount>
        {renderer}
      </DataSourceComponent>
    </div>
  )
}
export default Widget


/* Display list of all values(including duplicate)
 <div className="record-list" style={{ width: '100%', marginTop: '20px', height: 'calc(100% - 80px)', overflow: 'auto' }}>
        {
          ds && ds.getStatus() === DataSourceStatus.Loaded ? ds.getRecords().map((r, i) => {
             return <div key={i}>{r.getData()[fName]}</div>
            }): null
        }
  </div> */
// Display list of all  unique values
//         <div className="record-list" style={{ width: '100%', marginTop: '20px', height: 'calc(100% - 80px)', overflow: 'auto' }}>
//           {
//             ds && ds.getStatus() === DataSourceStatus.Loaded ? (
//               Array.from(new Set(ds.getRecords().map(r => r.getData()[fName]))).map((uniqueValue, i) => (
//                 <div key={i}>{uniqueValue}</div>
//               ))
//             ) : null
//           }
//          </div>