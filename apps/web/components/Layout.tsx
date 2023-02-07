import { ActivityBarComponent, Component } from "codecrush-core";
import { Editor } from "codecrush-react";
import Head from "next/head";
import { ReactNode } from "react";
import GitHubButton from "react-github-btn";
import { AiFillHeart } from "react-icons/ai";

const INITIAL_VALUE = `import { Component } from "codecrush-core";
  
class Example extends Component {
  constructor(){
    super('example')
  }
  onReady() {
    const activityBar = this.editor.getComponent("activity-bar");
    activityBar.registerActivity("new-character", "Keyboard: ", false);
  }
  onKeyPressed(key) {
    const activityBar = this.editor.getComponent("activity-bar");

    activityBar.updateActivity("new-character", "Keyboard: " + key, false);
  }
}`;

class Example extends Component {
  constructor() {
    super("example");
  }
  onReady() {
    const activityBar =
      this.editor.getComponent<ActivityBarComponent>("activity-bar");
    activityBar.registerActivity("new-character", "Keyboard: ", false);
  }
  onKeyPressed(key: string) {
    const activityBar =
      this.editor.getComponent<ActivityBarComponent>("activity-bar");

    activityBar.updateActivity("new-character", "Keyboard: " + key, false);
  }
}

export default function Web({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex flex-col items-center">
      <Head>
        <title>Codecrush - Code Editor for Javascript</title>
        <meta
          name="description"
          content="Extensible and powerful code editor for Javascript"
        />
        <meta
          property="og:image"
          content="/og.png"
        />
        <link rel="icon" type="image/x-icon" href="/favicon.png" />
      </Head>
      <main className="w-full max-w-6xl my-10 px-2">
        <header className="text-center flex flex-col gap-y-2 items-center">
          <h1 className="text-orange-400 font-bold text-4xl">CODECRUSH </h1>
          <h1 className="text-2xl">
            Extensible and powerful code editor for{" "}
            <span className="underline decoration-orange-400">Javascript</span>
          </h1>
          <p className="rounded-3xl text-orange-400 font-semibold w-fit">
            v0.0.6
          </p>
          <GitHubButton
            href="https://github.com/JosueRhea/codecrush"
            data-size="large"
            data-show-count="true"
            aria-label="Star JosueRhea/codecrush on GitHub"
          >
            Star
          </GitHubButton>
        </header>
        <div className="mt-6">
          <Editor
            height={500}
            id="js-editor"
            theme="material-ocean"
            initialValue={INITIAL_VALUE}
            components={[Example]}
          />
        </div>
        <div className="markdown-body w-full">{children}</div>
        <div className="w-full text-center flex justify-center items-center gap-x-2">
          <AiFillHeart className="w-6 h-6" />
          <p>
            Made by <strong>JosueRhea</strong>
          </p>
          <img src="/me.jpg" className="w-7 h-7 rounded-full" alt="" />
        </div>
      </main>
    </div>
  );
}
