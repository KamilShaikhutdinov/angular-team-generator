const core = require("@actions/core");
const github = require("@actions/github");
const { getOctokit } = require("@actions/github");

async function run() {
  try {
    const token = core.getInput("github-token");
    const octokit = getOctokit(process.env.GITHUB_TOKEN);
    const { data: issues } = await octokit.rest.issues.listForRepo({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      state: "all",
      since: core.getInput("ISSUE_AGE"),
    });

    const { data: pullRequests } = await octokit.rest.pulls.list({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      state: "all",
      since: core.getInput("ISSUE_AGE"),
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
