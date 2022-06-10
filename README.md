# sign-system
Sign external files such as .apk with key safely.
라는 명목 하에 Github Actions 관련 각종 유틸리티와 코드들을 짜놓는 곳
(ex: rest api 호출 위주의 날것 그대로의 api를 wrap함: 아래 예시코드 참조)

자세한 작동방식은 [paper-ko.md](paper-ko.md)를 참고하세요.


## 유틸리티: [models](./src/models)
기존에는 `Issue` 데이터를 받아도 `octokit.rest.issues.createComment({ owner, repo, issue_number, body })`의
구조로 짰어야 하는데, 이게 너무 안좋아서 `issue.addComment(body)` 식으로 바꾸고 싶었다.
그리고 이렇게 추상화를 하면 깃허브라는 플랫폼에 의존하지 않고 짤 수 있기 때문에 로컬에서 테스트 코드를 짤 수
있는 등의 상당한 이점이 있다. 히힛
