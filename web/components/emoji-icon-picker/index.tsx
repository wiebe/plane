import React, { useEffect, useState } from "react";
import { Tab, Popover } from "@headlessui/react";
import { TwitterPicker } from "react-color";
import { usePopper } from "react-popper";

// emojis
import emojis from "./emojis.json";
import icons from "./icons.json";
// helpers
import { getRecentEmojis, saveRecentEmoji } from "./helpers";
import { getRandomEmoji, renderEmoji } from "helpers/emoji.helper";
// types
import { Props } from "./types";

const tabOptions = [
  {
    key: "emoji",
    title: "Emoji",
  },
  {
    key: "icon",
    title: "Icon",
  },
];

const EmojiIconPicker: React.FC<Props> = ({
  label,
  value,
  onChange,
  onIconColorChange,
  disabled = false,
  showEmojiPicker = true,
  showIconPicker = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [activeColor, setActiveColor] = useState<string>("rgb(var(--color-text-200))");

  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);

  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-start",
  });

  useEffect(() => {
    setRecentEmojis(getRecentEmojis());
  }, []);

  useEffect(() => {
    if (!value || value?.length === 0) onChange(getRandomEmoji());
  }, [value, onChange]);

  return (
    <Popover>
      <Popover.Button as={React.Fragment}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="outline-none"
          ref={setReferenceElement}
          disabled={disabled}
        >
          {label}
        </button>
      </Popover.Button>
      <Popover.Panel>
        <div
          className="mt-2 w-[250px] rounded-[4px] border border-custom-border-200 bg-custom-background-80 shadow-lg"
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <div className="h-[230px] w-[250px] overflow-auto rounded-[4px] border border-custom-border-200 bg-custom-background-80 p-2 shadow-xl">
            <Tab.Group as="div" className="flex h-full w-full flex-col">
              <Tab.List className="flex-0 -mx-2 flex justify-around gap-1 p-1">
                {tabOptions.map((tab) => {
                  if (!showEmojiPicker && tab.key === "emoji") return null;
                  if (!showIconPicker && tab.key === "icon") return null;

                  return (
                    <Tab key={tab.key} as={React.Fragment}>
                      {({ selected }) => (
                        <button
                          type="button"
                          onClick={() => {
                            setOpenColorPicker(false);
                          }}
                          className={`-my-1 w-1/2 border-b pb-2 text-center text-sm font-medium outline-none transition-colors ${
                            selected ? "" : "border-transparent text-custom-text-200"
                          }`}
                        >
                          {tab.title}
                        </button>
                      )}
                    </Tab>
                  );
                })}
              </Tab.List>
              <Tab.Panels className="flex-1 overflow-y-auto">
                <Tab.Panel>
                  {recentEmojis.length > 0 && (
                    <div className="py-2">
                      <h3 className="mb-2 text-xs text-custom-text-200">Recent</h3>
                      <div className="grid grid-cols-8 gap-2">
                        {recentEmojis.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            className="flex h-4 w-4 select-none items-center justify-between text-sm"
                            onClick={() => {
                              onChange(emoji);
                              setIsOpen(false);
                            }}
                          >
                            {renderEmoji(emoji)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <hr className="mb-2 h-[1px] w-full border-custom-border-200" />
                  <div>
                    <div className="grid grid-cols-8 gap-x-2 gap-y-3">
                      {emojis.map((emoji) => (
                        <button
                          type="button"
                          className="mb-1 flex h-4 w-4 select-none items-center text-sm"
                          key={emoji}
                          onClick={() => {
                            onChange(emoji);
                            saveRecentEmoji(emoji);
                            setIsOpen(false);
                          }}
                        >
                          {renderEmoji(emoji)}
                        </button>
                      ))}
                    </div>
                  </div>
                </Tab.Panel>
                <div className="py-2">
                  <Tab.Panel className="flex h-full w-full flex-col justify-center">
                    <div className="relative">
                      <div className="flex items-center justify-between px-1 pb-2">
                        {[
                          "#FF6B00",
                          "#8CC1FF",
                          "#FCBE1D",
                          "#18904F",
                          "#ADF672",
                          "#05C3FF",
                          "#000000",
                        ].map((curCol) => (
                          <span
                            key={curCol}
                            className="h-4 w-4 cursor-pointer rounded-full"
                            style={{ backgroundColor: curCol }}
                            onClick={() => setActiveColor(curCol)}
                          />
                        ))}
                        <button
                          type="button"
                          onClick={() => setOpenColorPicker((prev) => !prev)}
                          className="flex items-center gap-1"
                        >
                          <span
                            className="conical-gradient h-4 w-4 rounded-full"
                            style={{ backgroundColor: activeColor }}
                          />
                        </button>
                      </div>
                      <div>
                        <TwitterPicker
                          className={`!absolute top-4 left-4 z-10 m-2 ${
                            openColorPicker ? "block" : "hidden"
                          }`}
                          color={activeColor}
                          onChange={(color) => {
                            setActiveColor(color.hex);
                            if (onIconColorChange) onIconColorChange(color.hex);
                          }}
                          triangle="hide"
                          width="205px"
                        />
                      </div>
                    </div>
                    <hr className="mb-1 h-[1px] w-full border-custom-border-200" />
                    <div className="mt-1 ml-1 grid grid-cols-8 gap-x-2 gap-y-3">
                      {icons.material_rounded.map((icon, index) => (
                        <button
                          key={`${icon.name}-${index}`}
                          type="button"
                          className="mb-1 flex h-4 w-4 select-none items-center text-lg"
                          onClick={() => {
                            onChange({ name: icon.name, color: activeColor });
                            setIsOpen(false);
                          }}
                        >
                          <span
                            style={{ color: activeColor }}
                            className="material-symbols-rounded text-lg"
                          >
                            {icon.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </Tab.Panel>
                </div>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </Popover.Panel>
    </Popover>
  );
};

export default EmojiIconPicker;
