import { React, DataSourceTypes, Immutable, UseDataSource } from 'jimu-core';
import { AllWidgetSettingProps } from 'jimu-for-builder';
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector';

const Setting = (props: AllWidgetSettingProps<unknown>) => {

  const supportedTypes = Immutable([DataSourceTypes.FeatureLayer]);

  const onDataSourceChange = (useDataSources: UseDataSource[]) => {
    props.onSettingChange({
      id: props.id,
      useDataSources: useDataSources
    });
  };
  

  return (
    <div className='widget-setting-demo p-3'>
      <DataSourceSelector
        types={supportedTypes}
        mustUseDataSource
        useDataSources={props.useDataSources}
        onChange={onDataSourceChange}
        widgetId={props.id}
      />
     
    </div>
  )
}

export default Setting