import * as fs from "fs";
import * as path from "path";
import { replaceNewLine } from "./replace_zenn";

interface FileState {
  [filename: string]: string; // ファイル名をキーに、最終更新日時を値として持つ
}

interface State {
  last_check_time: string;
  file_states: FileState;
}

class FileChangeDetector {
  private stateFile: string;
  private directory: string;
  private state: State;

  constructor(directory: string, stateFile: string) {
    this.directory = directory;
    this.stateFile = stateFile;
    this.state = this.loadState();
  }

  private loadState(): State {
    try {
      const data = fs.readFileSync(this.stateFile, "utf8");
      return JSON.parse(data);
    } catch (error) {
      // ファイルが存在しない場合や読み込みエラーの場合は新しい状態を作成
      return { last_check_time: new Date().toISOString(), file_states: {} };
    }
  }

  private saveState(): void {
    fs.writeFileSync(this.stateFile, JSON.stringify(this.state), "utf8");
  }

  public checkForChanges(): string[] {
    const changedFiles: string[] = [];
    const currentTime = new Date().toISOString();

    fs.readdirSync(this.directory).forEach((file) => {
      const filePath = path.join(this.directory, file);
      const stats = fs.statSync(filePath);

      if (stats.isFile()) {
        const lastModified = stats.mtime.toISOString();
        if (
          !this.state.file_states[file] ||
          lastModified > this.state.file_states[file]
        ) {
          changedFiles.push(file);
          this.state.file_states[file] = lastModified;
        }
      }
    });

    this.state.last_check_time = currentTime;
    this.saveState();

    return changedFiles;
  }
}

function replaceAndSave(inputPath: string, outputPath: string): void {
  try {
    // 入力ファイルの内容を読み込む
    let s = fs.readFileSync(inputPath, "utf-8");

    // 正規表現で内容を置換
    s = replaceNewLine(s);

    // 新しい内容を出力ファイルに書き込む
    fs.writeFileSync(outputPath, s, "utf-8");

    console.log(`File successfully processed and saved to ${outputPath}`);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

const args = process.argv.slice(2);
console.log(args);

const detector = new FileChangeDetector(args[0], "./file_state.json");
const changedFiles = detector.checkForChanges();
for (const file of changedFiles) {
  replaceAndSave(path.join(args[0], file), path.join(args[1], file));
}
console.log("Changed files:", changedFiles);
