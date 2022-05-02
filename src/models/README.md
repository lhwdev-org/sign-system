# Models: Github 유사 api
기존에는 `Issue` 데이터를 받아도 `octokit.rest.issues.createComment({ owner, repo, issue_number, body })`의
구조로 짰어야 하는데, 이게 너무 안좋아서 `issue.addComment(body)` 식으로 바꾸고 싶었다.
그리고 이렇게 추상화를 하면 깃허브라는 플랫폼에 의존하지 않고 짤 수 있기 때문에 로컬에서 테스트 코드를 짤 수
있는 등의 상당한 이점이 있다.

