// hooks
import { useChart } from "components/gantt-chart";
// helpers
import { cn } from "helpers/common.helper";
// types
import { IMonthBlock } from "../../views";

export const MonthChartView = () => {
  // chart hook
  const { currentViewData, renderView } = useChart();

  const monthBlocks: IMonthBlock[] = renderView;

  return (
    <div className="relative z-[1] h-full w-full flex flex-grow divide-x divide-custom-border-100/50">
      {monthBlocks?.map((block, rootIndex) => (
        <div key={`month-${block?.month}-${block?.year}`} className="relative flex flex-col">
          <div className="flex h-full w-full divide-x divide-custom-border-100/50">
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
                <span className="absolute left-1/2 -translate-x-1/2 text-xs">
                  {block.monthData.shortTitle} {monthDay?.dayData?.shortTitle[0]} {monthDay?.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
