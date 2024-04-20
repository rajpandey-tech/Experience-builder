/** @jsx jsx */
import { jsx, type UseUtility, type ImmutableArray, SupportedUtilityType } from 'jimu-core';
export interface UtilitySelectorProps {
    pattern?: RegExp;
    types?: SupportedUtilityType[];
    isMultiple?: boolean;
    showRemove?: boolean;
    closePopupOnSelect?: boolean;
    showOrgUtility?: boolean;
    useUtilities?: ImmutableArray<UseUtility>;
    onChange?: (utilities: ImmutableArray<UseUtility>) => void;
}
export declare function UtilitySelector(props: UtilitySelectorProps): jsx.JSX.Element;
