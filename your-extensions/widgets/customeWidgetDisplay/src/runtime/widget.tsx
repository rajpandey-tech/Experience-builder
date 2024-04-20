import { React, type AllWidgetProps } from 'jimu-core'
import { type IMConfig } from '../config'
import { DataSource,DataSourceComponent } from 'jimu-core'
import { useState } from 'react'
interface Field{
  jimuName:string,
  name:string,
  type:string,
  esriType:string,
  alias:string
}

const Widget = (props: AllWidgetProps<IMConfig>) => {
  const [fieldData,setFieldData]=useState<Field[]>([]) 
  const onDataSourceCreated = (ds: DataSource) => {
    const dataSource = ds as any; // If you are sure it's QueriableDataSource, you can cast it to QueriableDataSource
    const { fetchedSchema } = dataSource;

    // Extract field data from fetchedSchema
    const fields = Object.values(fetchedSchema?.fields ?? {});
    const items=Object.values(fetchedSchema?.fields ?? {});
    debugger
    console.log(fields)

    const fieldArray: Field[] = fields.map((field: any) => ({      
      jimuName: field.jimuName,
      name: field.name,
      type: field.type,
      esriType: field.esriType,
      alias: field.alias,
      // Add other field properties here if needed
    }));

    // Update state with field data
    setFieldData(fieldArray);
   
  
};

  
  return (
    <div className="widget-demo jimu-widget m-2 overflow-auto border border-dark border-3">
      <p>Puget Sound block groups</p>
      
      {/* <p>exampleConfigProperty: {props.config.exampleConfigProperty}</p> */}
    <DataSourceComponent useDataSource={props.useDataSources?.[0]} widgetId={props.id} onDataSourceCreated={onDataSourceCreated} />
    </div>

  )
}

export default Widget
