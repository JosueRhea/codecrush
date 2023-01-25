import {
  ActivityBarComponent,
  AutocompletionComponent,
  Component,
} from "codecrush-core";
import debounce from "../utils/debounce";

export class CohereAutoCompletion extends Component {
  getResultsFromAi: any;
  constructor() {
    super("cohere-autocompletion");

    this.init();
  }

  init() {
    this.getResultsFromAi = debounce(() => {
      if (process.env.NEXT_PUBLIC_COHERE_TOKEN) {
        const completion =
          this.editor.getComponent<AutocompletionComponent>("autocompletion");
        const activityBar =
          this.editor.getComponent<ActivityBarComponent>("activity-bar");

        activityBar.registerActivity(
          "cohere-activity",
          "Getting autocompletions..."
        );
        this.fetchAutoCompletions(completion.currentWord)
          .then((res) => res.json())
          .then((data) => {
            const suggestions = data.generations[0].text
              .replace("\n", "")
              .replace("--", "")
              .split(",")
              .map((x: string) => x.trim())
              .filter((x: string) => x !== "");
            suggestions.forEach((item: string) => {
              completion.results.push({ suggestion: item, owner: "co:here" });
            });
            completion.render();
            activityBar.removeActivity("cohere-activity");
          })
          .catch(() => {
            activityBar.removeActivity("cohere-activity");
          });
      }
    }, 500);
  }

  async fetchAutoCompletions(currentWord: string) {
    return fetch("https://api.cohere.ai/generate", {
      method: "POST",
      headers: {
        "Cohere-Version": "2022-12-06",
        accept: "application/json",
        authorization: `Bearer ${process.env.NEXT_PUBLIC_COHERE_TOKEN}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        max_tokens: 100,
        return_likelihoods: "NONE",
        truncate: "END",
        prompt: `this program returns text autocompletions for code editor, it can have multiple autocompletions and should only return javascript code like this
--
input:spl
autocompletion:splice,slice
--
input:con
autocompletion:const,console,continue
--
input:for
autocompletion:for(let i = 0; i < array.length, i++),forEach,for(const a in array)
--
input:${currentWord}
autocompletion:`,
        temperature: 0.2,
        k: 0,
        p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop_sequences: ["--"],
      }),
    });
  }

  onSearchSuggestions(): void {
    this.getResultsFromAi();
  }
}
