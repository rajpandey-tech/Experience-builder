import { AbstractDataSource } from './abstract-data-source';
import { type QueriableDataSource, type DataSourceConstructorOptions, type QueryOptions, type QueryResult, type DataRecord, type QueryParams, type IMQueryParams, type GetCurrentQueryParamsOptions, type QueriableSelectOptions, type QueryProgressCallback, type Capabilities, type QueriableUsedFieldsOptions } from '../interfaces';
export declare abstract class AbstractQueriableDataSource extends AbstractDataSource implements QueriableDataSource {
    lastUpdateTime: Date;
    isSqlCaseSensitive: boolean;
    private lastQueryId;
    private lastQueryParams;
    private lastCountQueryParams;
    private lastRefreshTime;
    /**
     * Data will be cached here, not this.records.
     *
     * When selectRecordById, some selected records may be put in this.records, so they are not in the pages.
     */
    private pages;
    private pagePromises;
    /**
     * Promises to load missing fields for every page.
     * The promises contain a specail page (its id is variable SELECTION_DATA_VIEW_ID), it is the promise to load missing fields for source records of selection view.
     */
    private loadMissingFieldsByPagePromises;
    /**
     * Promise to load missing fields for all pages.
     */
    private loadMissingFieldsForAllPagePromise;
    /**
     * If delay and merge multiple calls of load missing fields, will save used fields of these calls here and then send one request.
     */
    private usedFieldsInTimeWindow;
    /**
     * If delay and merge multiple calls of load missing fields, will save timer here.
     */
    private loadMissingFieldsTimer;
    private capabilities;
    private countPromise;
    private byIdPromise;
    private autoRefreshHandle;
    private _count;
    /**
     * Will call this function after the first time widget/components call `setSourceRecords`.
     */
    private onceSetSourceRecords;
    private readonly throttleQueryRecordsByIdWithCurrentQueryParams;
    /**
     * Pending promise which is used to query selected records preset before data source is ready.
     * E.g. selected record id in URL.
     */
    private pendingPromiseToQuerySelectedRecordsPresetBeforeDsReady;
    private abortControllerOfPendingPromiseToQuerySelectedRecordsBySelectOptions;
    constructor(options: DataSourceConstructorOptions);
    ready(): Promise<any>;
    getCurrentQueryParams(options?: GetCurrentQueryParamsOptions): any;
    getRuntimeQueryParams(excludeWidgetId?: string): QueryParams;
    private getCurrentQueryParamsByQuery;
    private getMergedWidgetQueries;
    getCurrentQueryId(): string;
    getRealQueryParams(query: QueryParams, flag: 'query' | 'load', options?: QueryOptions): QueryParams;
    private mergeQueryWithConfigQuery;
    updateQueryParams(query: QueryParams, widgetId: string): void;
    getQueryPageSize(): number;
    getMaxRecordCount(): number;
    private getQueryWithoutPage;
    private checkClearLocalCache;
    selectRecords(options: QueriableSelectOptions, signal?: AbortSignal, progressCallback?: QueryProgressCallback): Promise<QueryResult>;
    selectRecordById(id: string, record?: DataRecord): void;
    selectRecordsByIds(ids: string[], records?: DataRecord[]): void;
    selectRecord(index: number): void;
    clearSelection(): void;
    private clearPendingSelect;
    getRecordsByPage(page: number, pageSize: number): DataRecord[];
    getRecordsByPageWithSelection(page: number, pageSize: number): DataRecord[];
    getPagesData(): {
        [page: number]: DataRecord[];
    };
    setPagesData(pages: {
        [page: number]: DataRecord[];
    }): void;
    clearRecordsNotAddVersion(): void;
    /**
     * get continuious page records
     */
    getRecords(): DataRecord[];
    setRecords(records: DataRecord[]): void;
    setSourceRecords(records: DataRecord[]): void;
    get count(): number;
    set count(c: number);
    getRealQueryPages(page: number, pageSize: number): number[];
    /**
     * the page/pageSize in query will not be used in the actual query
     */
    load(query: QueryParams, options?: QueryOptions): Promise<DataRecord[]>;
    /**
     * Check and load missing fields for loaded records.
     * If delay is true, will merge mulitple calls and send one request after time window run out.
     */
    loadMissingFields(realQuery: QueryParams, delay?: boolean): void;
    private doLoadMissingFields;
    private loadMissingFieldsByPage;
    /**
     * Keep selection after data source or data view is loaded.
     */
    private handleSelectionOnQueryParamChanges;
    /**
     * the resolved boolean means whether the query result is used (only the last query update records)
     * @param realQuery
     * @param page
     */
    private loadByPage;
    private sourceRecordsMissingFields;
    loadCount(query: QueryParams, options?: QueryOptions): Promise<number>;
    loadById(id: string, refresh?: boolean): Promise<DataRecord>;
    query(query: QueryParams, options?: QueryOptions): Promise<QueryResult>;
    queryCount(query: QueryParams, options?: QueryOptions): Promise<QueryResult>;
    queryIds(query: QueryParams, options?: QueryOptions): Promise<QueryResult>;
    queryAll(query: QueryParams, signal?: AbortSignal, progressCallback?: QueryProgressCallback, options?: QueryOptions): Promise<QueryResult>;
    queryById(id: string): Promise<DataRecord>;
    getAutoRefreshInterval(): number;
    getLastRefreshTime(): Date;
    startAutoRefresh(): void;
    stopAutoRefresh(): void;
    setNeedRefresh(needRefresh: boolean): void;
    setCapabilities(cap: Capabilities): void;
    getCapabilities(): Capabilities;
    getMainDataSource(): QueriableDataSource;
    getDataViews(): QueriableDataSource[];
    getDataView(dataViewId: string): QueriableDataSource;
    updateSelectionInfo(options: QueriableSelectOptions, triggerDataSource: QueriableDataSource, forceCheck?: boolean): void;
    private changeSelectedRecordIdsOfDsInfo;
    private queryRecordsByIdWithCurrentQueryParams;
    protected deleteOneLoadedRecordById(ds: QueriableDataSource, id: string): void;
    setOnceSetSourceRecords(func: () => void): void;
    getAllUsedFields(options: QueriableUsedFieldsOptions): string[] | '*';
    abstract getConfigQueryParams(): QueryParams;
    abstract getRemoteQueryParams(): QueryParams;
    abstract mergeQueryParams(...queries: QueryParams[]): QueryParams;
    abstract allowToExportData(): Promise<boolean>;
    /**
     * Apply used fields to query params to only load the fields which are used by widgets/components.
     */
    abstract applyUsedFields(query: QueryParams, usedFields: string[] | '*'): QueryParams;
    /**
     * Origin query is the query params which is passed to `query` / `load` method.
     * Real query is the result of merging origin query and other configured queries.
     * In the merging process, some query params may be removed due to the service capability.
     *
     * Use real query to send the query request, use origin query to get the removed query params and enhance the query result.
     */
    protected abstract doQuery(realQuery: IMQueryParams, originQuery: IMQueryParams): Promise<QueryResult>;
    protected abstract doQueryCount(realQuery: IMQueryParams): Promise<QueryResult>;
    protected abstract doQueryIds(realQuery: IMQueryParams): Promise<QueryResult>;
    protected abstract doQueryById(id: string): Promise<DataRecord>;
}
