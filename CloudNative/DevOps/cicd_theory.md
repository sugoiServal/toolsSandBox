# CI/CD (theories, whatever)

- CI/CD = `continuous integration` and `continuous delivery`
- automate: commit => test => build => deploy
- CI practices:
  - integrating `all your code changes` into the `main branch` 
  - automatically testing each change, 
  - merge change that passed the test
  - automatically kicking off a build (eg: Docker).

- CI benefit
  - Avoid sub-branches, frequently check-ins to main branch
  - Self-testing, failure of a test results is a failed build
  - Automated builds
  - Frequent iterations
  - Maximum visibility, Every developer should be able to access the latest commit and build
  - Predictable & low-risk deployments, make the team’s comfortable doing them anytime.
    
- CD practice
  - CD after CI
  - set criterias for releases, deploy when those criteria are met and validated
- CD benefit
  - merging changes frequently to aovoid of code conflict 
  - don't have to wait long for feedbacks and can fix bugs while the topic is still fresh.
  - smaller tasks, easier to complete each stage on time and track progress. 

- `CICD products`
  - Jenkins
  - GitLab
  - Github Action


