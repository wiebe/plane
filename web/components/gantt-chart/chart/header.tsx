// hooks
import { Expand, Shrink } from "lucide-react";
import { useChart } from "../hooks";
// types
import { IGanttBlock, TGanttViews } from "../types";
import { IMonthBlock } from "../views";
import { ScrollSyncPane } from "react-scroll-sync";

type Props = {
  blocks: IGanttBlock[] | null;
  fullScreenMode: boolean;
  handleChartView: (view: TGanttViews) => void;
  handleToday: () => void;
  loaderTitle: string;
  title: string;
  toggleFullScreenMode: () => void;
};

export const GanttChartHeader: React.FC<Props> = (props) => {
  const { blocks, fullScreenMode, handleChartView, handleToday, loaderTitle, title, toggleFullScreenMode } = props;
  // chart hook
  const { currentView, currentViewData, allViews, renderView } = useChart();

  const monthBlocks: IMonthBlock[] = renderView;

  return (
    <>
      <div className="relative flex w-full flex-shrink-0 flex-wrap items-center gap-2 whitespace-nowrap px-2.5 py-2 z-10">
        <div className="flex items-center gap-2 text-lg font-medium">{title}</div>

        <div className="ml-auto">
          <div className="ml-auto text-sm font-medium">{blocks ? `${blocks.length} ${loaderTitle}` : "Loading..."}</div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {allViews &&
            allViews.map((_chatView: any) => (
              <div
                key={_chatView?.key}
                className={`cursor-pointer rounded-sm p-1 px-2 text-xs ${
                  currentView === _chatView?.key ? `bg-custom-background-80` : `hover:bg-custom-background-90`
                }`}
                onClick={() => handleChartView(_chatView?.key)}
              >
                {_chatView?.title}
              </div>
            ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-sm p-1 px-2 text-xs hover:bg-custom-background-80"
            onClick={handleToday}
          >
            Today
          </button>
        </div>

        <button
          type="button"
          className="flex items-center justify-center rounded-sm border border-custom-border-200 p-1 transition-all hover:bg-custom-background-80"
          onClick={toggleFullScreenMode}
        >
          {fullScreenMode ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
        </button>
      </div>
      <div className="flex w-full">
        <ScrollSyncPane>
          <div className="h-full flex flex-grow divide-x divide-custom-border-100/50 overflow-x-auto">
            {monthBlocks?.map((block, rootIndex) => (
              <div key={`month-${block?.month}-${block?.year}`} className="relative flex flex-col">
                <div className="h-[60px] w-full">
                  <div className="relative h-[30px]">
                    <div className="sticky left-0 inline-flex whitespace-nowrap px-3 py-2 text-xs font-medium capitalize">
                      {block?.title}
                    </div>
                  </div>

                  <div className="flex h-[30px] w-full">
                    {block?.children?.map((monthDay, _idx) => (
                      <div
                        key={`sub-title-${rootIndex}-${_idx}`}
                        className="flex-shrink-0 border-b border-custom-border-200 py-1 text-center capitalize"
                        style={{ width: `${currentViewData?.data.width}px` }}
                      >
                        <div className="space-x-1 text-xs">
                          <span className="text-custom-text-200">{monthDay.dayData.shortTitle[0]}</span>{" "}
                          <span className={monthDay.today ? "rounded-full bg-custom-primary-100 px-1 text-white" : ""}>
                            {monthDay.day}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* <div className="flex h-full w-full divide-x divide-custom-border-100/50">
              {block?.children?.map((monthDay, index) => (
                <div
                  key={`column-${rootIndex}-${index}`}
                  className="relative flex h-full flex-col overflow-hidden whitespace-nowrap"
                  style={{ width: `${currentViewData?.data.width}px` }}
                >
                  <div
                    className={cn("relative flex h-full w-full flex-1 justify-center", {
                      "bg-custom-background-90": ["sat", "sun"].includes(monthDay?.dayData?.shortTitle),
                    })}
                  />
                </div>
              ))}
            </div> */}
              </div>
            ))}
          </div>
        </ScrollSyncPane>
      </div>
    </>
  );
};
