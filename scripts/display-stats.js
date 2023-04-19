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

    const totalIssues = issues.length;
    const totalPRs = pullRequests.length;

    const totalOpenedIssues = issues.filter(
      (issue) => issue.state === "open"
    ).length;
    console.log(`totalIssues${totalIssues}`);
    console.log(`totalPRs${totalPRs}`);

    const totalOpenedPRs = pullRequests.filter(
      (pr) => pr.state === "open"
    ).length;

    console.log(`totalOpenedPRs${totalOpenedPRs}`);
    const totalClosedIssues = issues.filter(
      (issue) => issue.state === "closed"
    ).length;
    console.log(`totalClosedIssues${totalClosedIssues}`);
    const totalClosedPRs = pullRequests.filter(
      (pr) => pr.state === "closed"
    ).length;

    console.log(`totalClosedPRs${totalClosedPRs}`);
    const openedIssues = issues.filter(
      (issue) =>
        issue.state === "open" &&
        new Date(issue.created_at) >
          new Date(Date.now() - diffDays * 24 * 60 * 60 * 1000)
    ).length;

    const openedPRs = pullRequests.filter(
      (pr) =>
        pr.state === "open" &&
        new Date(pr.created_at) >
          new Date(Date.now() - diffDays * 24 * 60 * 60 * 1000)
    ).length;

    const closedIssues = issues.filter(
      (issue) =>
        issue.state === "closed" &&
        new Date(issue.closed_at) >
          new Date(Date.now() - diffDays * 24 * 60 * 60 * 1000)
    ).length;

    const closedPRs = pullRequests.filter(
      (pr) =>
        pr.state === "closed" &&
        new Date(pr.closed_at) >
          new Date(Date.now() - diffDays * 24 * 60 * 60 * 1000)
    ).length;

    console.log(`Total PR's/Issues: ${totalPRs + totalIssues}`);

    console.log(
      `Total opened PR's/Issues: ${totalOpenedPRs + totalOpenedIssues}`
    );

    console.log(
      `Total closed PR's/Issues: ${totalClosedPRs + totalClosedIssues}`
    );

    console.log(
      `Opened PR's/Issues in the last ${diffDays} days: ${
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
