import { jsx, Immutable, type UseDataSource, JimuFieldType, AllDataSourceTypes } from 'jimu-core'
import { type AllWidgetSettingProps } from 'jimu-for-builder'
import { DataSourceSelector, FieldSelector } from 'jimu-ui/advanced/data-source-selector'
import {SettingSection,SettingRow} from 'jimu-ui/advanced/setting-components'
import { type IMConfig } from '../config'
import { useState } from 'react'
import defaultMessage from "../setting/translations/default"
import React from 'react'

interface State {
  isSqlBuilderOpen: boolean
}
const Setting = (props: AllWidgetSettingProps<any>) => {
  const supportedDsTypes = Immutable([AllDataSourceTypes.FeatureLayer])
  const supportedFieldTypes = Immutable([JimuFieldType.String])
  
  const [state,setState]=useState({isSqlBuilderOpen:null})
  const onDataSourceChange = (useDataSources: UseDataSource[]) => {
  if (!useDataSources) {
    return
  }

  props.onSettingChange({
    id: props.id,
    useDataSources: useDataSources
  })
}

  // When a field is chosen from the dropdown, save it to the settings.
  const fieldsListChangeHandler = (evt) => {
    if (evt && evt.length === 1) {
      props.onSettingChange({
        id: props.id,
        config: props.config.set('filterField', evt[0].name)
      })
    }
  }
  return (
     <div className="widget-setting-get-map-coordinates">

      <SettingSection
        className="data-source-selector-section"
        title={props.intl.formatMessage({
          id: 'dataSourceSelectorLabel',
          defaultMessage: defaultMessage.selectDataSource
        })}
      >
        <SettingRow>
          <DataSourceSelector
            types={supportedDsTypes}
            useDataSourcesEnabled
            mustUseDataSource
            useDataSources={props.useDataSources}
            onChange={onDataSourceChange} widgetId={props.id}
            hideDataView={true}
          />

        </SettingRow>
      </SettingSection>

      {props.useDataSources && props.useDataSources.length > 0 &&
        <SettingSection
          className="attribute-selector-section"
          title={props.intl.formatMessage({
            id: 'chooseAttributeSelectorLabel',
            defaultMessage: defaultMessage.chooseAttribute
          })}
        >
          <SettingRow>
            <FieldSelector
              useDataSources={props.useDataSources}
              types={supportedFieldTypes}
              onChange={fieldsListChangeHandler}
              selectedFields={Immutable([props.config.filterField])}
              isMultiple={false}
              isSearchInputHidden={false}
              isDataSourceDropDownHidden
              useDropdown
            />
          </SettingRow>
        </SettingSection>
      }

    </div>
     )
  }
  export default Setting