import { v4, version, validate } from "uuid";

export const generateGuid = () => v4();

export const isGuid = (guid) => validate(guid) && version(guid) === 4;