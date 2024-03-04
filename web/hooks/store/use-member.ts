import { useContext } from "react";
// mobx store
import { StoreContext } from "contexts/store-context";
// types;
import { IMemberRootStore } from "oldStore/member";

export const useMember = (): IMemberRootStore => {
  const context = useContext(StoreContext);
  if (context === undefined) throw new Error("useMember must be used within StoreProvider");
  return context.memberRoot;
};
