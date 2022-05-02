type Url = string;

type Link = {
  text: string;
  url: Url;
};

type SignRequest = {
  id: string;
  kind: string;
  metadata: {
    url: Url;
    author: Link;
    origin: Link;
  };
  artifact: Url;
};

function parseContent(lines: string[]) {
}
