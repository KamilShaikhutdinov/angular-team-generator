const core = require("@actions/core");
const github = require("@actions/github");
const { getOctokit } = require("@actions/github");

async function run() {
  try {
    const octokit = getOctokit(process.env.GITHUB_TOKEN);
    const since = process.env.SINCE;
    const sinceDate = new Date(Date.parse(since));
    const today = new Date(); //
    const diffTime = Math.abs(today - sinceDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const { data: issues } = await octokit.rest.issues.listForRepo({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      state: "all",
      since,
    });

    const { data: pullRequests } = await octokit.rest.pulls.list({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      state: "all",
      since,
    });

    const totalIssues = issues.length;
    const totalPRs = pullRequests.length;

    const openedIssues = issues.filter(
      (issue) =>
        issue.state === "open" &&
        new Date(issue.created_at) >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    const openedPRs = pullRequests.filter(
      (pr) =>
        pr.state === "open" &&
        new Date(pr.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    const closedIssues = issues.filter(
      (issue) => issue.state === "closed"
    ).length;
    const closedPRs = pullRequests.filter((pr) => pr.state === "closed").length;

    console.log(`Total PRs/Issues: ${totalPRs + totalIssues}`);
    console.log(`Open PRs/Issues: ${openedPRs + openedIssues}`);
    console.log(`Closed PRs/Issues: ${closedPRs + closedIssues}`);
    console.log(
      `PRs/Issues opened in the last ${diffDays} days: ${
        openedPRs + openedIssues
      }`
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
