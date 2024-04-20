/// <reference types="react" />
/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import type { JimuSymbol, JimuPointSymbol, JimuPolylineSymbol, JimuPolygonSymbol } from 'jimu-ui/advanced/map';
import { Arrangement } from '../layouts/constraints';
export type { JimuSymbol, JimuPointSymbol, JimuPolylineSymbol, JimuPolygonSymbol };
export interface Props {
    isShow: boolean;
    isAutoWidth?: boolean;
    sketchContainer?: HTMLElement;
    arrangement?: Arrangement;
    onA11yFocus?: () => void;
}
export declare const SymbolListWithMeasurements: React.MemoExoticComponent<(props: Props) => jsx.JSX.Element>;
