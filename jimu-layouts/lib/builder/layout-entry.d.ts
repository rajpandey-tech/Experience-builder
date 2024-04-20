/// <reference types="react" />
/// <reference types="seamless-immutable" />
/** @jsx jsx */
import { React, jsx, ReactRedux, type LayoutItemConstructorProps } from 'jimu-core';
import { type LayoutProps, type StateToLayoutProps } from 'jimu-layouts/layout-runtime';
declare const enum LayoutEntryMode {
    ChooseLayoutType = 0,
    RenderLayout = 1
}
interface State {
    mode: LayoutEntryMode;
}
declare class LayoutEntry extends React.Component<LayoutProps & StateToLayoutProps, State> {
    state: State;
    shouldComponentUpdate(nextProps: LayoutProps): boolean;
    onLayoutTypeSelected: () => void;
    switchToChoosingMobe: () => void;
    render(): jsx.JSX.Element;
}
declare const _default: ReactRedux.ConnectedComponent<typeof LayoutEntry, {
    ref?: React.LegacyRef<LayoutEntry>;
    layouts: import("seamless-immutable").ImmutableObjectMixin<import("jimu-core").SizeModeLayoutJson> & {
        readonly [x: string]: string;
    };
    children?: React.ReactNode;
    style?: any;
    visible?: boolean;
    className?: string;
    key?: React.Key;
    isInSection?: boolean;
    isInWidget?: boolean;
    isRepeat?: boolean;
    isPageItem?: boolean;
    itemDraggable?: boolean;
    itemResizable?: boolean;
    itemSelectable?: boolean;
    droppable?: boolean;
    showDefaultTools?: boolean;
    isItemAccepted?: (item: LayoutItemConstructorProps, isReplacePlaceholder: boolean) => boolean;
    onItemClick?: (e: any, widgetId: string) => void;
    ignoreMinHeight?: boolean;
    context?: React.Context<ReactRedux.ReactReduxContextValue<any, import("redux").AnyAction>>;
    store?: import("redux").Store<any, import("redux").AnyAction>;
}>;
export default _default;
export declare function defaultWidgetFilter(item: LayoutItemConstructorProps): boolean;
