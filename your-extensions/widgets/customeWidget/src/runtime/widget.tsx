import { React, type AllWidgetProps, DataSourceComponent, dataSourceUtils, DataSourceManager, type FeatureLayerDataSource, DataSourceStatus } from 'jimu-core'
import { Button } from 'jimu-ui'

import { type IMConfig } from '../config'

const Widget = (props: AllWidgetProps<any>) => {

 const isDsConfigured = () => {
    if (props.useDataSources && props.useDataSources.length === 1) {
      return true
    }
    return false
  }
  const onCreateDataSourceFailed = () => {
    setSourceRecordsToOutputDs()
  }
 const  onDataSourceCreated = () => {
    setSourceRecordsToOutputDs()
  }
  const getOriginDataSource = () => {
    return DataSourceManager.getInstance().getDataSource(props.useDataSources?.[0]?.dataSourceId)
  }

  const getOutputDataSource = () => {
    return DataSourceManager.getInstance().getDataSource(props.outputDataSources?.[0])
  }

  const setSourceRecordsToOutputDs = () => {
    debugger
    if (!getOutputDataSource()) {
      return
    }
    if (!getOriginDataSource()) {
      getOutputDataSource().setStatus(DataSourceStatus.NotReady)
      getOutputDataSource().setCountStatus(DataSourceStatus.NotReady)
      return
    }
    const sql = dataSourceUtils.getArcGISSQL(props.config.sqlExpression, getOriginDataSource()).sql || '1=1'
    const featureLayerDs = getOriginDataSource() as FeatureLayerDataSource
    featureLayerDs.query({ where: sql }).then(res => {
     
      getOutputDataSource()?.setSourceRecords(res.records)
      console.log(res.records)
      getOutputDataSource()?.setStatus(DataSourceStatus.Unloaded)
      getOutputDataSource()?.setCountStatus(DataSourceStatus.Unloaded)
    })
  }
  return (
      // <>
      // {
      //    !isDsConfigured() ? (
      //     <><h3>
      //     This widget demonstrates how to use attribute query results to generate a client-side output data source.          
      //   </h3></>
      //    ) : (
      //     <><h2>Please config data source.</h2></>
      //    )
      // }
       
      <div className='widget-attribute-query-result-as-output' style={{ width: '100%', height: '100%', maxHeight: '800px', overflow: 'auto' }}>
        
        <Button onClick={setSourceRecordsToOutputDs}>
          Update output data source
        </Button>

        <DataSourceComponent
          useDataSource={props.useDataSources?.[0]}
          widgetId={props.id}
          onDataSourceCreated={onDataSourceCreated}
          onCreateDataSourceFailed={onCreateDataSourceFailed}
        />

      </div>
      // </>
    )
  }
export default Widget