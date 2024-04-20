import { React, Immutable, DataSourceTypes, DataSourceManager, type UseDataSource, type DataSourceJson, SqlExpressionMode, type IMSqlExpression } from 'jimu-core'
import { type AllWidgetSettingProps } from 'jimu-for-builder'
import { SqlExpressionBuilderPopup } from 'jimu-ui/advanced/sql-expression-builder'
import { getJimuFieldNamesBySqlExpression } from 'jimu-ui/basic/sql-expression-runtime'
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector'
import { type IMConfig } from '../config'
import { Button } from 'jimu-ui'
import { useState } from 'react'

interface State {
  isSqlBuilderOpen: boolean
}
const Setting = (props: AllWidgetSettingProps<any>) => {
  const supportedTypes = Immutable([DataSourceTypes.FeatureLayer])
  const [state,setState]=useState({isSqlBuilderOpen:null})

  const onDataSourceChange = (useDataSources: UseDataSource[]) => {
    if (useDataSources?.length > 0) {
      const originDsId = useDataSources[0]?.dataSourceId
      const originDs = DataSourceManager.getInstance().getDataSource(originDsId)
      const outputDsJsons: DataSourceJson[] = [{
        id: `${props.id}-ouput`,
        type: DataSourceTypes.FeatureLayer,
        label: `${props.manifest.name}-output-data-source`,
        geometryType: originDs.getDataSourceJson().geometryType,
        originDataSources: [useDataSources[0]],
        isDataInDataSourceInstance: true
      }]

      // Let framework know which data source current widget is using and which data source current widget is outputing.
      props.onSettingChange({
        id: props.id,
        useDataSources: useDataSources
      }, outputDsJsons)
    }
  }

  const onSqlExpressionChange = (sqlExpression: IMSqlExpression) => {
    const usedFields = getJimuFieldNamesBySqlExpression(sqlExpression)
    const newUseDs = props.useDataSources[0].set('fields', usedFields).asMutable({ deep: true })

    // Save the SQL expression to config and update use data sources based on the fields SQL expression is using.
    props.onSettingChange({
      id: props.id,
      useDataSources: [newUseDs],
      config: { sqlExpression }
    })
  }

  const toggleSqlBuilder = () => { setState({ isSqlBuilderOpen: !state.isSqlBuilderOpen }) }
  const dsId = props.useDataSources?.[0]?.dataSourceId
    const ds = dsId && DataSourceManager.getInstance().getDataSource(dsId)

  return (
    
   
      <div className='setting-attribute-query-result-as-output p-2'>
        <DataSourceSelector
          mustUseDataSource
          types={supportedTypes}
          useDataSources={props.useDataSources}
          useDataSourcesEnabled={props.useDataSourcesEnabled}
          onChange={onDataSourceChange}
          widgetId={props.id}
        />

        {
          ds && <div className='mt-2'>
            <Button onClick={toggleSqlBuilder}>Click to set a SQL expression</Button>
          </div>
        }

        <SqlExpressionBuilderPopup
          dataSource={ds}
          mode={SqlExpressionMode.Simple}
          expression={props.config.sqlExpression}
          onChange={onSqlExpressionChange}
          isOpen={state.isSqlBuilderOpen}
          toggle={toggleSqlBuilder}
        />
      </div>
    )
  }
  export default Setting