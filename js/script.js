const url = "https://jsonplaceholder.typicode.com/posts";

const loadingElement = document.querySelector("#loading");
const postsContainer = document.querySelector("#posts-container");

const postPage = document.querySelector("#post");
const postContainer = document.querySelector("#post-container");
const commentsContainer = document.querySelector("#comments-container");

const inputEmailElement = document.querySelector("#email");
const inputBodyElement = document.querySelector("#body");
const buttonElement = document.querySelector("#submit");

const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get("id");

const getAllPosts = async () => {
  const response = await fetch(url);

  const data = await response.json();

  loadingElement.classList.add("hide");

  data.map((post) => {
    const div = document.createElement("div");
    const title = document.createElement("h2");
    const body = document.createElement("p");
    const link = document.createElement("a");

    title.innerText = post.title;
    body.innerText = post.body;
    link.innerText = "Ler";
    link.setAttribute("href", `/post.html?id=${post.id}`);

    div.appendChild(title);
    div.appendChild(body);
    div.appendChild(link);

    postsContainer.appendChild(div);
  });
};

const getIndividualPost = async (id) => {
  const [responsePost, responseComments] = await Promise.all([
    fetch(`${url}/${id}`),
    fetch(`${url}/${id}/comments`),
  ]);

  const dataPost = await responsePost.json();

  const dataComments = await responseComments.json();

  loadingElement.classList.add("hide");
  postPage.classList.remove("hide");

  const title = document.createElement("h1");
  const body = document.createElement("p");

  title.innerText = dataPost.title;
  body.innerText = dataPost.body;

  postContainer.appendChild(title);
  postContainer.appendChild(body);

  dataComments.map((comment) => {
    createComent(comment);
  });
};

const createComent = (comment) => {
  const div = document.createElement("div");
  const email = document.createElement("h3");
  const Commentbody = document.createElement("p");

  email.innerText = comment.email;
  Commentbody.innerText = comment.body;

  div.appendChild(email);
  div.appendChild(Commentbody);

  commentsContainer.appendChild(div);

  inputBodyElement.value = "";
  inputEmailElement.value = "";
};

const postComment = async (comment) => {
  const response = await fetch(`${url}/${postId}/comments`, {
    method: "POST",
    body: comment,
    headers: {
      "Content-type": "application/json",
    },
  });

  const data = await response.json();

  createComent(data);
};

if (!postId) {
  getAllPosts();
} else {
  getIndividualPost(postId);
}

buttonElement.addEventListener("click", (e) => {
  e.preventDefault();

  let comment = {
    email: inputEmailElement.value,
    body: inputBodyElement.value,
  };

  comment = JSON.stringify(comment);

  postComment(comment);
});
