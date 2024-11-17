import { replaceNewLine } from "./directory_watcher";

test("replaceNewLine", () => {
  expect(
    replaceNewLine(`# 見出し1\nこんにちは。\nさようなら。\n`)
  ).toStrictEqual(`# 見出し1\nこんにちは。さようなら。\n`);
});
