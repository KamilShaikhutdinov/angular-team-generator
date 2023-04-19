const core = require("@actions/core");
const github = require("@actions/github");
const { getOctokit } = require("@actions/github");

async function run() {
  try {
    const octokit = getOctokit(process.env.GITHUB_TOKEN);
    const since = new Date("2023-04-04");
    const sinceISO = since.toISOString();
    const { data: issues } = await octokit.rest.issues.listForRepo({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      state: "all",
      since: core.getInput(sinceISO),
    });

    const { data: pullRequests } = await octokit.rest.pulls.list({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      state: "all",
      since: core.getInput(sinceISO),
    });

    const totalIssues = issues.length;
    const totalPRs = pullRequests.length;

    const openedIssues = issues.filter(
      (issue) => issue.state === "open"
    ).length;
    const openedPRs = pullRequests.filter((pr) => pr.state === "open").length;

    const closedIssues = issues.filter(
      (issue) => issue.state === "closed"
    ).length;
    const closedPRs = pullRequests.filter((pr) => pr.state === "closed").length;

    console.log(`Total PRs/Issues: ${totalPRs + totalIssues}`);
    console.log(`Open PRs/Issues: ${openedPRs + openedIssues}`);
    console.log(`Closed PRs/Issues: ${closedPRs + closedIssues}`);
    console.log(
      `PRs/Issues opened in the last month: ${openedPRs + openedIssues}`
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
