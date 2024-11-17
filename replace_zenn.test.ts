import { replaceNewLine } from "./replace_zenn";

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
  expect(
    replaceNewLine(
      `---
title: "複数GitHubアカウントをssh設定で使い分ける"
emoji: "🐕" type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["GitHub", "ssh", "1Password"]
published: false
--- GitHubのアカウントを複数使い分けしようとした時、CloneはできるもののPushができないという問題が起きた。それに対しての対処法をまとめる。 なおここでは通信方式はSSHに限った話とする。

aaa
`
    )
  ).toStrictEqual(
    `---
title: "複数GitHubアカウントをssh設定で使い分ける"
emoji: "🐕" type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["GitHub", "ssh", "1Password"]
published: false
--- GitHubのアカウントを複数使い分けしようとした時、CloneはできるもののPushができないという問題が起きた。それに対しての対処法をまとめる。 なおここでは通信方式はSSHに限った話とする。

aaa
`
  );
  expect(replaceNewLine(`- aaa\n- bbb\nxyz\n`)).toStrictEqual(
    `- aaa\n- bbb\n\nxyz\n`
  );
});
