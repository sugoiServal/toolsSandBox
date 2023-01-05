- Testing is basically quality control of software product or service. it's also part of the development process to make the development more fluent,
- one of the main responsibility for tester is to find defects as soon as possible

# Development live cycle
![](https://imgur.com/5nrLVMC.jpg)
- Planning: "What we want"
- Defining: "how to get what we want"
- testing: "在开发任何一个阶段都要进行TEST
- Deploying: "start to use what we built"
- Maintaining: "make sure everything is still working"
### Planning
  - identify system of development
  - **software requirement**
  - feasibility assessment
  - create the project plan
```md
About **software requirement**
- it's a description of the software product
- including:
  - functional or nonfunctional requirement
  - use cases
  - defined by business analysts or product owner
- examples:
  - user can make money transfer between accounts
  - user can receive money from other accounts
  - user can search previous transaction
```
### Defining: "how to get what we want"
  - process diagrams
  - tech stacks
### Building
### Testing: "在开发任何一个阶段都要进行TEST
  - write test cases
  - execute test cases

# Testing Practice
> " developers write code to pass the test while tester tries to fail them"
### Test flow breakdown
- test planning: **test plan** Is a document describing software testing scope and tools:
  - features to be tested
  - test env
  - entry/exit test criterias
- test specifications
  - two tasks
    - Design test cases: "how identified test conditions are to be excised through code"
    - Build(implements) test cases, eg scripts, datas
- Execution
  - run tests by priority

- Bug Report
## Entry and Exit Criteria
- Entry criteria define when to start testing such as:
  - at the beginning of test level
  - when a set of tests is ready for execution (environment, tools, codes, data available)
- exit criteria defined when stop testing such as
  - end of test level
  - when the set of tests has achieved a specific goal

## Test Case and checklist
- test case is a documentation containing
  -  set of test data
  -  preconductions and postconditions
  -  expected result

## Environment:
- in software engineering you typically see 4 types of environment
  - Development
  - Testing: should be stable and close to production env
  - Staging: it's an environment for testing that exactly resembles the production environment, mirroring the production environment as closely as possible (eg beta test)
  - Production
### Example

|||
|--|--|
|User Story| As a User I can access to my bank accounts from the main menu|
|Description|User can have multiple accounts; User can see Balance next to the account number; Placeholder should appear if user has no accounts;|


![](https://imgur.com/Zc2OIxj.jpg)
- checklist is similar to test case but in a more compact form, allowing for faster dev. Used by smaller or more experienced team
![](https://imgur.com/KNXClKm.jpg)
## Bugs Report
- Bugs reports should be self explanatory and as simple as possible
- ![](https://imgur.com/aVyAeiw.jpg)
### Categorize Web bugs
- visual bugs: truncated image, alignment issues
- functional bugs: freeze... 
- performance issues: takes 10 seconds to open the page
### Documenting Bugs
|Bug Title|Bug Priority|Description|Attachment|
|--|--|--|--|
|Simple title|Your ranking system|{summary; steps to reproduce; expected results; Auctual result;}|any files/ images|
### Bugs lifecycle
- A bug lifecycle starts when a bug is found and ends when it's closed
![](https://imgur.com/Itr3mvO.jpg)
![](https://imgur.com/s1PYuEe.jpg)

# Testing techniques

### Functional test vs Nonfunctional test  
- **functional test** focus on the main feature of the product, it includes:
  - unit test, integration test, smoking test, sanity test, regression test
- **nonfunctional test** focus on other aspects such as performance usability, reliability, expandability, it includes:
  - load test, stress test, security test, installation test

### Black Box test vs White box test  
- White box test knows the implementation while the black box tester only sees the product
- typical White box test: unit test, statement test
- black box test techniques examples: 
  - equivalence partitioning, boundary value, decision tree, state transition, use case testing
### Testing teniques details
- Black Box testing
- Negative Testing
- Regression Testing
- Experienced Based Testing
- Risk Based Testing
## Black Box testing
- testing without knowing internal implementation of the software
- example:
  - open the browser and browse the website like the user
- black box testing techniques List

|||
|--|--|
| equivalent class testing| exercise test to one representative member of each partition of the test case|
| boundary value testing|focus values at the boundaries/ extreme ends, like begining and end of a loop|
| decision table testing|大概就是比如说user使用了a combination of操作然后对每一个combination我会EXPECT有什么outcome|
| state transition testing|大概就是说用state transition graph来表示我们期望的产品状态转移情况，然后测试是否满足这一个期望|
| use case testing|大概就是说simulate user's interaction to the system, tester vaildate这一个过程|

- decision table testing/ state transition testing/ use case testing 的设计图、表一般都是由产品经理或者UX DESIGNER给的

### Decision table testing
example:
![](https://imgur.com/x9gszMB.jpg)
- there are 2^{#of conditions} combinations for a binary choice decision 

### state transition testing
- used for application that involves state 
example
![](https://imgur.com/JhRjQFf.jpg)
- test cases should cover all the edges
### use case testing
- Commonly used in agile framework
- involves:
  - actor(stakeholder)
  - steps/actions
  - extensions(cover edge scenarios)
example:
![](https://imgur.com/kKr9upC.jpg)

## Negative test
- previous techniques we explored the positive testing: "if I do this then that should happen, everything work as expected"
- negative test is about "If I do this then that shouldn't happen"
- examples:
  - leave form field blank or input different type of content: then the form should't proceed
  - upload file types that is not supported

## Smoke/ Sanity/ Regression test
Regression is superset of Smoke/ sanity test, meaning that they in effect, are also regression regression tests
### Smoke test
- smoke test  
  - is carried out in initial stage of the development 
  - to make sure that the core/main functionality is working fine
  - it's not a type of deep testing
- when to perform:
  - when fresh/unstable build is provided to QA team
  

### Sanity test
- Sanity test is for test newly introduced minor changes applied to a stable build, before the deployment eg:
  - bug fix
  - new feature
  - replace component
  - performance fixes...

![](https://imgur.com/QrLtFS0.jpg)
### Regression test 
- it is about making sure the change or additions of feature/ bug fixing doesn't broke any existing function
- in general, new test cases are not created during regression tests, instead, old tests are re-executed
- Regression test is very frequently excuted, it ensure issues are detected in early stage

- workflow:
  - code submit
  - regression test
  - pass => code freeze for push => review for release
## Experence based test 
- 基本上就是说要TEST的内容是从公司过去的经验或者测试员长久以来开发的经验里面得到的，比如
  - error guessing：在这样的系统里面什么样的问题经常会出现
  - Exploratory test: 就是通过一些timed brain storm session 找到edge cases  
    - tools:
      - see file: exploratory test template.doc
      - [app.testbuddy.co](app.testbuddy.co): note taking tool
  - checklist-based test:
- 比较适合于比较小而且有经验的team

## Risk based testing
- It's basically prioritize issues that have high possibility to happen(hense high risk). 当你的时间成本高的时候你就会优先解决比较重要可能会出错的地方
- risk can be broken down into two components: impact and likelihood
  $$risk=impace\times likelihood$$
- help to focus on most important part of software in stressful situation
## static test
- example of statics test: code review

## Misc
### Localisation test 
- Localization is defined as adapting a product to meet the culture or lingual of a specific region
  - time/ date format
  - currency
  - keyboard usage
  - color/ symbols/ icons
  - text/graphical content that is sensitive
  - different legal requirment
- Localisation test 
  - linguistic test: performed by native speaker
  - functionality test: if localization introduce bugs
  - layout/UI: usually AB test with original version 
### Accessibility test 
- to ensure that the application is usable by people with disabilities: hearing, color blindness, sight...
- assistive technologies:
  - speech recognition: speech to text
  - screen reader: eg ios voiceOver, windows narrator
  - screen magnification 
  - special keyboard
- example of Accessibility test: use only windows narrator to complete the main function of your product
### usability test 
- usability testing is a way to see how easy real user to use something by observing their real-time usage. users are asked to complete task while being observed by a researcher to see where the encounter problems and experience confusion. If many people encounter similar problems recommendation will be made to overcome those usability issues.
- usability testing usually handled by UX team. any input as a user really helps the design


# Test in action
## Web Testing
### backend api test
- **API** stands for application program interface it's responsible for data communicatiion between frontend GUI and the server business logic
-  API testing **can be started before frontend is ready**, fixing bugs in chaper way

|checklist|
|-|  
|HTTP methods: POST, GET, PUT, DELETE|
|sample payload|
|response + status code: 200, 400, 500|
|response messages|
|response body|


## Tools
- **Atlassian Jira** for scrum project management/ bug report
- **Github issue/project** for bug report
- **Atlassian Confluence/ Github wiki** for Documentation 
- TestRail for test process Management
- TestLodge for test process Management
-  **Miro** for team colab 
-  Charles Proxy for debugging 