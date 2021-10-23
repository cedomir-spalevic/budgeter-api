import { generateGuid, isGuid } from "lib/security/guid.js";

describe("Guid tests", () => {
   test("Guid is 36 characters", () => {
      const guid = generateGuid();
      expect(guid.length).toBe(36);
   });

   test("Null value returns false", () => {
      expect(isGuid(null)).toBeFalsy();
   });

   test("Undefined value returns false", () => {
      expect(isGuid()).toBeFalsy();
   });

   test("Generated guid passes validation", () => {
      const guid = generateGuid();
      expect(isGuid(guid)).toBeTruthy();
   });

   test("Random string does not pass validation", () => {
      expect(isGuid("asd;klfn")).toBeFalsy();
   });
});