const core = require("@actions/core");
const github = require("@actions/github");
const { getOctokit } = require("@actions/github");

async function run() {
  try {
    const octokit = getOctokit(process.env.GITHUB_TOKEN);
    const since = process.env.since;

    const sinceDate = new Date(Date.parse(since));
    const today = new Date();
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

    const totalIssues = issues.length - 1;
    const totalPRs = pullRequests.length - 1;

    const totalOpenedIssues =
      issues.filter((issue) => issue.state === "open").length - 1;

    const totalOpenedPRs =
      pullRequests.filter((pr) => pr.state === "open").length - 1;

    const totalClosedIssues =
      issues.filter((issue) => issue.state === "closed").length - 1;

    const totalClosedPRs =
      pullRequests.filter((pr) => pr.state === "closed").length - 1;

    const openedIssues =
      issues.filter(
        (issue) =>
          issue.state === "open" &&
          new Date(issue.created_at) >
            new Date(Date.now() - diffDays * 24 * 60 * 60 * 1000)
      ).length - 1;

    const openedPRs =
      pullRequests.filter(
        (pr) =>
          pr.state === "open" &&
          new Date(pr.created_at) >
            new Date(Date.now() - diffDays * 24 * 60 * 60 * 1000)
      ).length - 1;

    const closedIssues =
      issues.filter(
        (issue) =>
          issue.state === "closed" &&
          new Date(issue.closed_at) >
            new Date(Date.now() - diffDays * 24 * 60 * 60 * 1000)
      ).length - 1;

    const closedPRs =
      pullRequests.filter(
        (pr) =>
          pr.state === "closed" &&
          new Date(pr.closed_at) >
            new Date(Date.now() - diffDays * 24 * 60 * 60 * 1000)
      ).length - 1;

    console.log(`Total PR's/Issues: ${totalPRs + totalIssues}`);

    console.log(
      `Total open PR's/Issues: ${totalOpenedPRs + totalOpenedIssues}`
    );

    console.log(
      `Total closed PR's/Issues: ${totalClosedPRs + totalClosedIssues}`
    );

    console.log(
      `Open PR's/Issues in the last ${diffDays} days: ${
        openedPRs + openedIssues
      }`
    );
    console.log(
      `Closed PR's/Issues in the last ${diffDays} days: ${
        closedPRs + closedIssues
      }`
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
