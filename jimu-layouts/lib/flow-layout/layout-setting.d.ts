/// <reference types="react" />
/** @jsx jsx */
import { jsx, React, ReactRedux } from 'jimu-core';
interface Props {
    layoutId: string;
    formatMessage: (id: string) => string;
}
interface StateToProps {
    setting?: any;
}
declare class FlowLayoutSetting extends React.PureComponent<Props & StateToProps> {
    updateSpace: (value: any) => void;
    updatePadding: (value: any) => void;
    render(): jsx.JSX.Element;
}
declare const _default: ReactRedux.ConnectedComponent<typeof FlowLayoutSetting, {
    ref?: React.LegacyRef<FlowLayoutSetting>;
    layoutId: string;
    key?: React.Key;
    formatMessage: (id: string) => string;
    context?: React.Context<ReactRedux.ReactReduxContextValue<any, import("redux").AnyAction>>;
    store?: import("redux").Store<any, import("redux").AnyAction>;
}>;
export default _default;
