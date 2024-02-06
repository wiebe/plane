// components
import {
  BiWeekChartView,
  DayChartView,
  GanttChartBlocksList,
  HourChartView,
  IBlockUpdateData,
  IGanttBlock,
  MonthChartView,
  QuarterChartView,
  TGanttViews,
  WeekChartView,
  YearChartView,
  useChart,
} from "components/gantt-chart";
// helpers
import { cn } from "helpers/common.helper";
import { ScrollSyncPane } from "react-scroll-sync";

type Props = {
  blocks: IGanttBlock[] | null;
  blockToRender: (data: any, textDisplacement: number) => React.ReactNode;
  blockUpdateHandler: (block: any, payload: IBlockUpdateData) => void;
  bottomSpacing: boolean;
  chartBlocks: IGanttBlock[] | null;
  enableBlockLeftResize: boolean;
  enableBlockMove: boolean;
  enableBlockRightResize: boolean;
  enableReorder: boolean;
  itemsContainerWidth: number;
  showAllBlocks: boolean;
  sidebarToRender: (props: any) => React.ReactNode;
  title: string;
  updateCurrentViewRenderPayload: (direction: "left" | "right", currentView: TGanttViews) => void;
};

export const GanttChartMainContent: React.FC<Props> = (props) => {
  const {
    blocks,
    blockToRender,
    blockUpdateHandler,
    bottomSpacing,
    chartBlocks,
    enableBlockLeftResize,
    enableBlockMove,
    enableBlockRightResize,
    enableReorder,
    itemsContainerWidth,
    showAllBlocks,
    sidebarToRender,
    title,
    updateCurrentViewRenderPayload,
  } = props;
  // chart hook
  const { currentView, currentViewData, updateScrollLeft, updateScrollTop } = useChart();
  // handling scroll functionality
  const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const { clientWidth: clientVisibleWidth, scrollLeft: currentLeftScrollPosition, scrollWidth } = e.currentTarget;

    updateScrollLeft(currentLeftScrollPosition);
    updateScrollTop(e.currentTarget.scrollTop);

    const approxRangeLeft = scrollWidth >= clientVisibleWidth + 1000 ? 1000 : scrollWidth - clientVisibleWidth;
    const approxRangeRight = scrollWidth - (approxRangeLeft + clientVisibleWidth);

    if (currentLeftScrollPosition >= approxRangeRight) updateCurrentViewRenderPayload("right", currentView);
    if (currentLeftScrollPosition <= approxRangeLeft) updateCurrentViewRenderPayload("left", currentView);
  };

  const CHART_VIEW_COMPONENTS: {
    [key in TGanttViews]: React.FC;
  } = {
    hours: HourChartView,
    day: DayChartView,
    week: WeekChartView,
    bi_week: BiWeekChartView,
    month: MonthChartView,
    quarter: QuarterChartView,
    year: YearChartView,
  };

  if (!currentView) return null;
  const ActiveChartView = CHART_VIEW_COMPONENTS[currentView];

  return (
    <div
      // DO NOT REMOVE THE ID
      id="gantt-container"
      className={cn("relative z-[1] h-full w-full overflow-hidden border-t border-custom-border-200", {
        "mb-8": bottomSpacing,
      })}
    >
      <div className="h-full w-full flex">
        <ScrollSyncPane>
          <div
            // DO NOT REMOVE THE ID
            id="scroll-container"
            className="relative h-full w-full flex flex-1 overflow-hidden overflow-x-auto z-[1]"
            // onScroll={onScroll}
          >
            <ActiveChartView />
          </div>
        </ScrollSyncPane>
        {currentViewData && (
          // <ScrollSyncPane>
          <GanttChartBlocksList
            itemsContainerWidth={itemsContainerWidth}
            blocks={chartBlocks}
            blockToRender={blockToRender}
            blockUpdateHandler={blockUpdateHandler}
            enableBlockLeftResize={enableBlockLeftResize}
            enableBlockRightResize={enableBlockRightResize}
            enableBlockMove={enableBlockMove}
            showAllBlocks={showAllBlocks}
          />
          // </ScrollSyncPane>
        )}
      </div>
    </div>
  );
};
