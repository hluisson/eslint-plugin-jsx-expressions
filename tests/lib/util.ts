import * as path from "path";

export const getFixturesRootDir = (): string => {
  return path.join(__dirname, "fixtures");
};
