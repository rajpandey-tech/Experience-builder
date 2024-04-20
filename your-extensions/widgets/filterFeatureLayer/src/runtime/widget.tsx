import { React, type AllWidgetProps, DataSourceComponent, dataSourceUtils, DataSourceManager, 
type FeatureLayerDataSource, DataSourceStatus,jsx,type SqlQueryParams} from 'jimu-core'
import { Button } from 'jimu-ui'
import { TextInput, WidgetPlaceholder } from 'jimu-ui'
import { type IMConfig } from '../config'
import defaultMessage from "../runtime/translations/default"

const Widget = (props: AllWidgetProps<any>) => {
 
const alertIcon = require('./assets/alert.svg')

  const textInputChangeHandler = (evt) => {
    debugger
    if (props.useDataSources.length > 0) {
           // First get the DataSourceManager instance
      const dsManager = DataSourceManager.getInstance()

      // Get the data source using useDataSource.dataSourceId
      const useDataSource = props.useDataSources[0]
      const ds: FeatureLayerDataSource = dsManager.getDataSource(useDataSource.dataSourceId) as FeatureLayerDataSource

      // Build the queryParams, with the configured filterField and the value
      // that has been typed into the TextInput by the user
      const queryParams: SqlQueryParams = {
        where: `${props.config.filterField} LIKE '%${evt.target.value}%'`
      }

      // Filter the data source using updateQueryParams function.
      ds.updateQueryParams(queryParams, props.id)
    }
  }

   // By default, if we have no filterField selected, show a placeholder:
   let mainContent = <WidgetPlaceholder icon={alertIcon} message={defaultMessage.chooseAttribute} />

   if (props.config.filterField) {
    // If fieldField is selected, show the Text Input box to allow filtering.
    const placeholderText = `${defaultMessage.filterLayer} on ${props.config.filterField} attribute`
    mainContent = <p>
      <TextInput onChange={(e) => { textInputChangeHandler(e) }} />
    </p>
  };

  return (
    <div className="widget-get-map-coordinates jimu-widget p-2">
      {mainContent}
    </div>
  )  
  }
export default Widget