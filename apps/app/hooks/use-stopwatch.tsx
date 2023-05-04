import { useState, useEffect, useCallback, useMemo } from "react";

// hooks
import useLocalStorage from "hooks/use-local-storage";

type TimeSlot = {
  start_time: Date | string;
  end_time: Date | null | string;
  type: "START" | "PAUSE" | "RESUME" | "STOP";
  actual_time: number;
};

type Props = {
  key: string | null;
};

const defaultValue: {
  actual_time_spent: number;
  time_slots: TimeSlot[];
} = {
  actual_time_spent: 0,
  time_slots: [],
};

const useStopwatch = (props: Props) => {
  const { key } = props;

  const { storedValue, setValue } = useLocalStorage(key ?? "", defaultValue);

  const [elapsed, setElapsed] = useState(0);

  const start = useCallback(() => {
    setValue({
      actual_time_spent: 0,
      time_slots: [
        {
          start_time: new Date(),
          end_time: null,
          type: "START",
          actual_time: 0,
        },
      ],
    });
  }, [setValue]);

  const stop = useCallback(() => {
    if (!storedValue || storedValue.time_slots.length <= 0) return;

    const lastTimeSlot = storedValue.time_slots[storedValue.time_slots.length - 1];

    if (lastTimeSlot.type === "STOP") return;

    const newTimeSlot = {
      start_time: lastTimeSlot.start_time,
      end_time: new Date(),
      type: "STOP" as const,
      actual_time:
        lastTimeSlot.type === "PAUSE"
          ? lastTimeSlot.actual_time
          : lastTimeSlot.actual_time +
            (new Date().getTime() - new Date(lastTimeSlot.start_time).getTime()),
    };

    setValue({
      actual_time_spent: storedValue.actual_time_spent + newTimeSlot.actual_time,
      time_slots: [...storedValue.time_slots, newTimeSlot],
    });
  }, [setValue, storedValue]);

  const pause = useCallback(() => {
    if (!storedValue || storedValue.time_slots.length <= 0) return;

    const lastTimeSlot = storedValue.time_slots[storedValue.time_slots.length - 1];

    if (lastTimeSlot.type === "PAUSE") return;

    const newTimeSlot = {
      start_time: lastTimeSlot.start_time,
      end_time: new Date(),
      type: "PAUSE" as const,
      actual_time:
        lastTimeSlot.actual_time +
        (new Date().getTime() - new Date(lastTimeSlot.start_time).getTime()),
    };

    setValue({
      actual_time_spent: storedValue.actual_time_spent + newTimeSlot.actual_time,
      time_slots: [...storedValue.time_slots, newTimeSlot],
    });
  }, [setValue, storedValue]);

  const resume = useCallback(() => {
    if (!storedValue || storedValue.time_slots.length <= 0) return;

    const lastTimeSlot = storedValue.time_slots[storedValue.time_slots.length - 1];

    if (lastTimeSlot.type === "RESUME") return;

    const newTimeSlot = {
      start_time: new Date(),
      end_time: null,
      type: "RESUME" as const,
      actual_time: lastTimeSlot.actual_time,
    };

    setValue({
      actual_time_spent: storedValue.actual_time_spent,
      time_slots: [...storedValue.time_slots, newTimeSlot],
    });
  }, [setValue, storedValue]);

  const reset = useCallback(() => {
    setElapsed(0);
    setValue(defaultValue);
  }, [setValue]);

  const isRunning = useMemo(() => {
    if (!storedValue || storedValue.time_slots.length <= 0) return false;

    const lastTimeSlot = storedValue.time_slots[storedValue.time_slots.length - 1];

    return lastTimeSlot.type === "START" || lastTimeSlot.type === "RESUME";
  }, [storedValue]);

  useEffect(() => {
    if (!storedValue || storedValue.time_slots.length <= 0) return;

    const lastTimeSlot = storedValue.time_slots[storedValue.time_slots.length - 1];

    if (lastTimeSlot.type === "START" || lastTimeSlot.type === "RESUME") {
      const interval = setInterval(() => {
        setElapsed(
          lastTimeSlot.actual_time +
            (new Date().getTime() - new Date(lastTimeSlot.start_time).getTime())
        );
      }, 1000);

      return () => clearInterval(interval);
    } else setElapsed(lastTimeSlot.actual_time);
  }, [storedValue, setElapsed]);

  return {
    elapsed,
    isRunning,
    start,
    stop,
    isStopped: storedValue?.time_slots[storedValue?.time_slots.length - 1]?.type === "STOP",
    reset,
    pause,
    resume,
  } as const;
};

export default useStopwatch;
