// Recursively find out the total number of child posts
export default function getTotalNumChildPosts(post, posts) {
  // Base case: there is no element in the children property
  let res;
  if (post.children.length === 0) {
    res = 0;
  } else {
    res = 0;
    for (let i = 0; i < post.children.length; i++) {
      if (!posts[post.children[i]].isDeleted) {
        res = res + 1 + getTotalNumChildPosts(posts[post.children[i]], posts);
      }
    }
  }

  return res;
}
