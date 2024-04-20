import React, { useState, useRef, useEffect } from 'react';
import {
  IMDataSourceInfo, AllWidgetProps, DataSourceComponent, type DataSource,
  DataSourceManager, FeatureLayerQueryParams, DataSourceStatus,
  FeatureLayerDataSource,
  SqlQueryParams
} from 'jimu-core';
import { Button } from 'jimu-ui';

const Widget = (props: AllWidgetProps<any>) => {
  const [query, setQuery] = useState<FeatureLayerQueryParams>({ where: '1=1', outFields: ['*'], pageSize: 10 });
  const [variableType, setVariableType] = useState<string>('');
  // const [uniqueValuesCount, setUniqueValuesCount] = useState<Record<string, number>>({});

  const [selectField, setSelectField] = useState('');
  const [selectFieldValue, setSelectFieldValue] = useState('');
  const [fname, setFname] = useState<string>('');

  const isDsConfigured = () => {
    return props.useDataSources &&
      props.useDataSources.length === 1 &&
      props.useDataSources[0].fields &&
      props.useDataSources[0].fields.length === 1;
  }

  const handleFieldChange = (event) => {
    const selectedOption = event.target.value;
    setSelectField(selectedOption);
    // setSelectFieldValue('');
    filterValueFromDataSource(selectField);
  };

  const handleFieldValueChange = (event) => {
    const selectedFieldOption = event.target.value;
    setSelectFieldValue(selectedFieldOption);
    // filterValueFromDataSource(selectFieldValue);
  };

  const filterValueFromDataSource = (selectFieldValue) => {
    if (!isDsConfigured()) return;
    const fieldName = selectField;
    let query = '1=1';
    if (variableType === "esriFieldTypeInteger" || variableType === "esriFieldTypeOID" || variableType === "esriFieldTypeDouble") {
      query = `${fieldName} =${selectFieldValue}`;
    } else {
      query = `${fieldName} like '%${selectFieldValue}%'`;
    }
    const w = selectFieldValue ? query : '1=1';
    setQuery({
      where: w,
      outFields: ['*'],
      pageSize: 10
    });
  }
  useEffect(() => {
    filterValueFromDataSource(selectFieldValue)
  }, [selectFieldValue]);

  const renderer = (ds: DataSource, info: IMDataSourceInfo) => {
    // createOutputDs(ds); // Not sure what this function does, it's not called anywhere
    setFname(selectField || (props.useDataSources[0].fields[0]))
    if (fname === '') {
      setFname(props.useDataSources[0].fields[0]);
      setVariableType(ds.fetchedSchema.fields[fname].esriType);
    } else {
      setVariableType(ds.fetchedSchema.fields[fname].esriType);
    }
    return (
      <>
        <div className="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
          Select Field:
          <select value={selectField} onChange={handleFieldChange}>
            <option value="">ALL</option>
            {Object.keys(ds.fetchedSchema.fields).map((key, index) => (
              <option key={index} value={key}>{key}</option>
            ))}
          </select>
        </div>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Query State: {info.status}</div>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Total Count: {ds.count}</div>

        <div className="record-list" style={{ width: '100%', marginTop: '20px', height: 'calc(100% - 80px)', overflow: 'auto', fontSize: '14px' }}>
          {
            ds && ds.getStatus() === DataSourceStatus.Loaded ? (() => {
              const records = ds.getRecords();
              const uniqueValuesCount = {};
              records.forEach(record => {
                const value = record.getData()[fname];
                if (value && value != " ") { uniqueValuesCount[value] = (uniqueValuesCount[value] || 0) + 1; }
              });
              return (
                <>{
                  selectField && (
                    
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                      Select Value:
                      <select value={selectFieldValue} onChange={handleFieldValueChange} style={{fontSize: '16px'}}>
                        <option value="">ALL</option>
                        {/* Map over the dynamic data array and create an option element for each item */}
                        {Object.entries(uniqueValuesCount).map(([count], i) => (
                          <option key={i} value={count}>{count}</option>
                        ))}
                      </select>
                      {/* <button onClick={filterValueFromDataSource}>Apply for list</button> */}
                      <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '30px' }}>Total Count Of Selected Field: {Object.keys(uniqueValuesCount).length}</div>
                    </div>
                  )
                }
                </>
              );
            })() : null
          }
        </div>
      </>
    );
  }

  if (!isDsConfigured()) {
    return <h3>This widget demonstrates how to use a feature layer as a data source. Configure the data source.</h3>;
  }
  return (
    <div className="widget-use-feature-layer" style={{ width: '100%', height: '100%', maxHeight: '800px', overflow: 'auto', alignItems: 'center' }}>
      <h3>Use a feature layer as a data source.</h3>
      <DataSourceComponent useDataSource={props.useDataSources?.[0]} query={query} widgetId={props.id} queryCount>
        {renderer}
      </DataSourceComponent>
    </div>
  );
  
}

export default Widget;
