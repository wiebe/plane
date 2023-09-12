export * from "./importer";
export * from "./ai";
export * from "./analytics";
export * from "./calendar";
export * from "./custom-attributes";
export * from "./cycles";
export * from "./estimate";
export * from "./inbox";
export * from "./integration";
export * from "./issues";
export * from "./modules";
export * from "./notifications";
export * from "./pages";
export * from "./projects";
export * from "./reaction";
export * from "./state";
export * from "./users";
export * from "./views";
export * from "./waitlist";
export * from "./workspace";
export * from "./view-props";

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? ObjectType[Key] extends { pop: any; push: any }
      ? `${Key}`
      : `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];
