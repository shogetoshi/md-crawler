import { replaceNewLine } from "./directory_watcher";

test("replaceNewLine", () => {
  expect(
    replaceNewLine(`# 見出し1\nこんにちは。\nさようなら。\n\nハロー\n`)
  ).toStrictEqual(`# 見出し1\nこんにちは。 さようなら。\n\nハロー\n`);
  expect(
    replaceNewLine(
      "Pythonのコードを\n示します。\n\n```python\nif True:\n  print('a')\n```\n\n以上が\nコードです。\n"
    )
  ).toStrictEqual(
    "Pythonのコードを 示します。\n\n```python\nif True:\n  print('a')\n```\n\n以上が コードです。\n"
  );
});
